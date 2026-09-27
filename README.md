This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contact form

`/contact` posts to a Server Action (`app/(marketing)/contact/actions.ts`)
that delivers submissions via [Resend](https://resend.com).

Env vars (copy `.env.example` → `.env.local` for local dev, set in
Vercel project settings for prod):

- `RESEND_API_KEY` — Resend API key. **Optional.** Without it, the form
  still returns success and logs the submission to the server console —
  useful for shipping the UI before DNS / domain verification are done.
- `CONTACT_TO_EMAIL` — where submissions are delivered. Defaults to
  `rusgrekovua@gmail.com`.
- `CONTACT_FROM_EMAIL` — verified sender (e.g. `Ruslan <contact@hrekov.dev>`).
  Must be on a domain verified in Resend.

Spam defence: hidden honeypot field + in-memory rate limit (5 submissions
per IP per hour, resets on cold start — acceptable for portfolio volume).

## Analytics + consent

GA4 is wired conditionally on `NEXT_PUBLIC_GA_ID`. With no ID set,
no analytics script loads and no cookies are written.

Geo gating: `middleware.ts` reads `x-vercel-ip-country` (set by Vercel
Edge) and writes a `geo-eu=1|0` cookie for one day. `lib/consent-geo.ts`
lists the 27 EU member states plus GB, NO, IS, LI, CH.

- **EU visitors** see a bottom-right consent banner. GA4 stays off
  until they click **Accept**. Choice is stored in a first-party
  `consent=accepted|rejected` cookie (1 year).
- **Non-EU visitors** see no banner. GA4 loads by default. Setting
  `consent=rejected` (via the footer link) turns it back off.

`send_page_view` is disabled on init; `components/analytics/PageViews.tsx`
sends a manual `config` call on every route change with
`anonymize_ip: true`.

Events tracked:
- `blog_post_read` — fires once when the reader hits the end sentinel
  of `/blog/[slug]` (IntersectionObserver with `-20%` root margin)
- `case_study_view_toggle` — fires when the Executive/Technical
  toggle changes
- `contact_form_submit` — fires on Server Action success
- `external_link_click` — delegated document listener; skips
  `hrekov.dev`, `www.hrekov.dev`, `localhost`

Set `NEXT_PUBLIC_GSC_VERIFICATION` if you want the Google Search
Console meta tag emitted (via `metadata.verification.google`).

**Testing consent locally:** Vercel's country header isn't present in
dev, so middleware defaults to `geo-eu=0` (non-EU). To exercise the
banner path, edit `middleware.ts` to force `1`, or run
`document.cookie = "geo-eu=1; Path=/"` in the browser console and
reload.
