# 26 — /contact redesign

**Date.** 2026-10-22
**Class.** S/L boundary · owner request: "зроби редизайн сторінки контакт"

## Problem

/contact is the last page on the pre-v2 layout: centered badge hero,
an 11px uppercase "Prefer email?" label, social links as 36px
initials-only circles (GH, X, IN, DEV), and the reason for writing
hidden in a `<select>`. Nothing says what happens after you press
Send beyond one muted line under the button.

## Goal

Same rules as /work, /tools and /blog: clear up front, equal
treatment, tokens only.

- **Left column** (sticky on lg): availability pill (green, functional),
  h1 "Let's talk.", one-line lede, "What happens next" as three
  numbered steps built only from facts already on the site (reply
  within two business days; a straight answer, including "not the
  right fit"; based in Ohio, EST/CST hours), then direct channels as a
  labelled list — name + handle, 44px rows — with email first.
- **Right column**: the form. Reason for writing becomes three radio
  cards (label + one-line description), still `name="intent"`, still
  pre-selected from `?intent=`. Inputs 44px tall, visible focus ring,
  message hint tied with `aria-describedby`. Success state on the same
  card.
- Server action, validation, honeypot and analytics unchanged.

## Done when

1440 and 390 without overflow; axe clean; form posts and shows the
error state on an empty submit; `?intent=full-time` pre-selects the
right card.
