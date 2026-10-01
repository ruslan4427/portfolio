import { renderPlainTextForLinkedIn } from "./render.mjs";
import { LinkedInAuthError } from "./types.mjs";

const UGC_ENDPOINT = "https://api.linkedin.com/v2/ugcPosts";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`missing env: ${name}`);
  return v;
}

function buildBody(post, memberUrn) {
  const text = renderPlainTextForLinkedIn(
    post.mdxSource,
    post.frontmatter,
    post.canonicalUrl,
  );

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
  const payload = buildBody(post, memberUrn);

  if (opts.dryRun) {
    log(`[linkedin:dry-run] would POST ${UGC_ENDPOINT}`);
    log(JSON.stringify(payload, null, 2));
    return {
      publishedUrl: `https://www.linkedin.com/dryrun/${post.slug}`,
      remoteId: `urn:li:dryrun:${post.slug}`,
    };
  }

  const token = requireEnv("LINKEDIN_ACCESS_TOKEN");
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
    const text = await res.text().catch(() => "");
    throw new Error(
      `LinkedIn POST failed: ${res.status} ${res.statusText} — ${text}`,
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
