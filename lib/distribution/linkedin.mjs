import path from "node:path";
import { collectImages, renderPlainTextForLinkedIn } from "./render.mjs";
import { LinkedInAuthError } from "./types.mjs";
import { uploadLinkedInImage } from "./linkedin-upload.mjs";

const UGC_ENDPOINT = "https://api.linkedin.com/v2/ugcPosts";
const PUBLIC_DIR = "public";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`missing env: ${name}`);
  return v;
}

function resolveLocalImagePath(src) {
  if (!src || src.startsWith("http")) return null;
  const trimmed = src.startsWith("/") ? src.slice(1) : src;
  return path.join(process.cwd(), PUBLIC_DIR, trimmed);
}

function buildArticleBody(post, memberUrn, text) {
  return {
    author: memberUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "ARTICLE",
        media: [
          {
            status: "READY",
            originalUrl: post.canonicalUrl,
            title: { text: post.frontmatter.title },
            description: { text: post.frontmatter.tagline ?? "" },
          },
        ],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };
}

function buildImageBody(post, memberUrn, text, mediaEntries) {
  return {
    author: memberUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "IMAGE",
        media: mediaEntries,
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };
}

/**
 * Publish a blog post to LinkedIn as a shared article using the
 * self-serve `w_member_social` scope via `/v2/ugcPosts`.
 *
 * IMPORTANT: do NOT switch to `/rest/posts` unless the app has been
 * granted Community Management API access (weeks-long partner review).
 * Symptom of the wrong endpoint is 403 despite a valid token.
 *
 * @type {import("./types.mjs").Publisher}
 */
export async function publishToLinkedIn(post, opts) {
  const log = opts.log ?? ((m) => console.log(m));
  const memberUrn = requireEnv("LINKEDIN_MEMBER_URN");
  const text = renderPlainTextForLinkedIn(
    post.mdxSource,
    post.frontmatter,
    post.canonicalUrl,
  );

  const images = collectImages(post)
    .map((img) => ({ ...img, localPath: resolveLocalImagePath(img.src) }))
    .filter((img) => img.localPath !== null)
    .slice(0, 20);

  if (opts.dryRun) {
    const mode = images.length > 0 ? "IMAGE" : "ARTICLE";
    log(`[linkedin:dry-run] would POST ${UGC_ENDPOINT} as ${mode}`);
    log(`[linkedin:dry-run] images (${images.length}):`);
    for (const img of images) log(`  · ${img.localPath}`);
    log(`[linkedin:dry-run] commentary (${text.length} chars):`);
    log(text);
    return {
      publishedUrl: `https://www.linkedin.com/dryrun/${post.slug}`,
      remoteId: `urn:li:dryrun:${post.slug}`,
    };
  }

  const token = requireEnv("LINKEDIN_ACCESS_TOKEN");

  let payload;
  if (images.length > 0) {
    const mediaEntries = [];
    for (const img of images) {
      const assetUrn = await uploadLinkedInImage(img.localPath, {
        token,
        memberUrn,
        log,
      });
      const entry = {
        status: "READY",
        media: assetUrn,
      };
      if (img.alt) entry.title = { text: img.alt.slice(0, 200) };
      if (img.caption) entry.description = { text: img.caption };
      mediaEntries.push(entry);
    }
    payload = buildImageBody(post, memberUrn, text, mediaEntries);
  } else {
    payload = buildArticleBody(post, memberUrn, text);
  }

  const res = await fetch(UGC_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "x-restli-protocol-version": "2.0.0",
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw new LinkedInAuthError("LinkedIn 401 — access token rejected");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `LinkedIn POST failed: ${res.status} ${res.statusText} — ${body}`,
    );
  }

  const remoteId =
    res.headers.get("x-restli-id") ??
    res.headers.get("x-linkedin-id") ??
    "";
  const publishedUrl = remoteId
    ? `https://www.linkedin.com/feed/update/${encodeURIComponent(remoteId)}/`
    : post.canonicalUrl;

  return { publishedUrl, remoteId };
}

/**
 * Delete a previously published UGC post by URN. UGC posts are not
 * editable in-place — the pattern for "update" is delete-then-repost.
 * Requires `w_member_social` and the token's owner must be the author.
 */
export async function deleteLinkedInPost(urn, opts = {}) {
  const log = opts.log ?? ((m) => console.log(m));
  if (opts.dryRun) {
    log(`[linkedin:dry-run] would DELETE ${UGC_ENDPOINT}/${encodeURIComponent(urn)}`);
    return { deleted: urn };
  }
  const token = requireEnv("LINKEDIN_ACCESS_TOKEN");
  const res = await fetch(`${UGC_ENDPOINT}/${encodeURIComponent(urn)}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
      "x-restli-protocol-version": "2.0.0",
    },
  });
  if (res.status === 401) {
    throw new LinkedInAuthError("LinkedIn 401 on DELETE — access token rejected");
  }
  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `LinkedIn DELETE failed: ${res.status} ${res.statusText} — ${text}`,
    );
  }
  return { deleted: urn };
}
