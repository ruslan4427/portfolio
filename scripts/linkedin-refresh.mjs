import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`missing env: ${name}`);
    process.exit(2);
  }
  return v;
}

const clientId = requireEnv("LINKEDIN_CLIENT_ID");
const clientSecret = requireEnv("LINKEDIN_CLIENT_SECRET");
const refreshToken = process.env.LINKEDIN_REFRESH_TOKEN;

// Self-serve w_member_social does NOT grant refresh tokens — only the
// 60-day access token. If we have no refresh token, this job is a no-op;
// the user must re-handshake via scripts/linkedin-oauth.mjs before the
// access token cliff. Exit 0 so the weekly cron stays green.
if (!refreshToken) {
  const issuedAt = process.env.LINKEDIN_REFRESH_TOKEN_ISSUED_AT;
  if (issuedAt) {
    const issued = new Date(issuedAt);
    const now = new Date();
    const daysSince = Math.round((now - issued) / 86_400_000);
    const daysLeft = 60 - daysSince;
    console.log(`[linkedin-refresh] no refresh token (self-serve limit); access token ~${daysLeft}d from cliff.`);
    if (daysLeft < 14) {
      console.warn(`[linkedin-refresh] WARNING: ${daysLeft}d until access token expires — re-handshake via scripts/linkedin-oauth.mjs.`);
    }
  } else {
    console.log("[linkedin-refresh] no refresh token and no issued-at timestamp — nothing to rotate.");
  }
  process.exit(0);
}

const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  }),
});

if (!res.ok) {
  console.error(`[linkedin-refresh] token exchange failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}

const tokens = await res.json();
const newAccess = tokens.access_token;
const newRefresh = tokens.refresh_token ?? refreshToken;
const issuedAt = new Date().toISOString();

console.log(`[linkedin-refresh] new access token expires in ${tokens.expires_in}s (~${Math.round(tokens.expires_in / 86400)}d)`);
if (tokens.refresh_token_expires_in) {
  const days = Math.round(tokens.refresh_token_expires_in / 86400);
  console.log(`[linkedin-refresh] new refresh token expires in ${tokens.refresh_token_expires_in}s (~${days}d)`);
  if (days < 30) {
    console.warn(`[linkedin-refresh] WARNING: refresh token has <30d left — a full re-handshake will be needed soon.`);
  }
}

if (!process.env.GH_TOKEN) {
  console.log("\n[linkedin-refresh] GH_TOKEN not set — run manually to rotate secrets:");
  console.log(`  gh secret set LINKEDIN_ACCESS_TOKEN --body "${newAccess}"`);
  console.log(`  gh secret set LINKEDIN_REFRESH_TOKEN --body "${newRefresh}"`);
  console.log(`  gh secret set LINKEDIN_REFRESH_TOKEN_ISSUED_AT --body "${issuedAt}"`);
  process.exit(0);
}

async function setSecret(name, value) {
  await run("gh", ["secret", "set", name, "--body", value]);
  console.log(`[linkedin-refresh] rotated ${name}`);
}

await setSecret("LINKEDIN_ACCESS_TOKEN", newAccess);
await setSecret("LINKEDIN_REFRESH_TOKEN", newRefresh);
await setSecret("LINKEDIN_REFRESH_TOKEN_ISSUED_AT", issuedAt);

console.log("[linkedin-refresh] rotation complete.");
