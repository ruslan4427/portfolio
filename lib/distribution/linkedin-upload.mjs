import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { LinkedInAuthError } from "./types.mjs";

const REGISTER_UPLOAD = "https://api.linkedin.com/v2/assets?action=registerUpload";

/**
 * Register + upload a single image asset to LinkedIn's media service.
 * Two-step dance:
 *   1. POST /v2/assets?action=registerUpload → body carries author URN
 *      and the feedshare-image recipe; response hands back a one-shot
 *      upload URL plus the final asset URN we'll reference in the UGC
 *      post.
 *   2. PUT the raw image bytes to that upload URL with the bearer
 *      token. 201 means the asset is ready.
 *
 * Requires `w_member_social`. Fails fast on 401 — the access token has
 * a 60-day cliff on self-serve, see memory/reference_linkedin_api_endpoint.md.
 *
 * @param {string} absPath — absolute path to the local image file
 * @param {{token: string, memberUrn: string, log?: (m: string) => void}} opts
 * @returns {Promise<string>} the asset URN (e.g. "urn:li:digitalmediaAsset:...")
 */
export async function uploadLinkedInImage(absPath, opts) {
  const { token, memberUrn } = opts;
  const log = opts.log ?? ((m) => console.log(m));

  await stat(absPath);

  const registerPayload = {
    registerUploadRequest: {
      recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
      owner: memberUrn,
      serviceRelationships: [
        {
          relationshipType: "OWNER",
          identifier: "urn:li:userGeneratedContent",
        },
      ],
    },
  };

  const regRes = await fetch(REGISTER_UPLOAD, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "x-restli-protocol-version": "2.0.0",
    },
    body: JSON.stringify(registerPayload),
  });

  if (regRes.status === 401) {
    throw new LinkedInAuthError("LinkedIn 401 on registerUpload — access token rejected");
  }
  if (!regRes.ok) {
    const text = await regRes.text().catch(() => "");
    throw new Error(`LinkedIn registerUpload failed: ${regRes.status} — ${text}`);
  }

  const regJson = await regRes.json();
  const uploadUrl =
    regJson?.value?.uploadMechanism?.["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]
      ?.uploadUrl;
  const assetUrn = regJson?.value?.asset;
  if (!uploadUrl || !assetUrn) {
    throw new Error(
      `LinkedIn registerUpload missing uploadUrl/asset: ${JSON.stringify(regJson)}`,
    );
  }

  const bytes = await readFile(absPath);
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": contentTypeFor(absPath),
    },
    body: bytes,
  });
  if (!putRes.ok && putRes.status !== 201) {
    const text = await putRes.text().catch(() => "");
    throw new Error(`LinkedIn image PUT failed: ${putRes.status} — ${text}`);
  }

  log(`[linkedin:upload] ${path.basename(absPath)} → ${assetUrn}`);
  return assetUrn;
}

function contentTypeFor(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "application/octet-stream";
}
