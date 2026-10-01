/**
 * @typedef {object} PublishResult
 * @property {string} publishedUrl  Canonical URL of the published item.
 * @property {string} remoteId      Remote platform id (dev.to numeric, LinkedIn URN).
 *
 * @typedef {object} PublishOptions
 * @property {boolean} dryRun       When true: log request body, skip network, return synthetic result.
 * @property {(msg: string) => void} [log]  Optional structured logger; defaults to console.log.
 *
 * @typedef {object} BlogPost
 * @property {string} slug
 * @property {object} frontmatter
 * @property {string} frontmatter.title
 * @property {string} frontmatter.tagline
 * @property {string[]} [frontmatter.tags]
 * @property {string} [frontmatter.format]
 * @property {string} mdxSource     Raw MDX body (no frontmatter).
 * @property {string} canonicalUrl  e.g. https://hrekov.dev/blog/<slug>.
 *
 * @typedef {(post: BlogPost, opts: PublishOptions) => Promise<PublishResult>} Publisher
 */

export class LinkedInAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "LinkedInAuthError";
  }
}

export {};
