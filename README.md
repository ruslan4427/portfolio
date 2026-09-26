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
