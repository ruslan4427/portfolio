"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import {
  INTENTS,
  type ContactState,
  type ContactValues,
  type Intent,
} from "./types";

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;
const rateLimit = new Map<string, number[]>();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN = 20;
const MESSAGE_MAX = 5000;
const NAME_MAX = 100;

function readValues(formData: FormData): ContactValues {
  const rawIntent = String(formData.get("intent") ?? "");
  const intent: Intent = (INTENTS as readonly string[]).includes(rawIntent)
    ? (rawIntent as Intent)
    : "fractional";
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    intent,
    message: String(formData.get("message") ?? "").trim(),
  };
}

function validate(values: ContactValues): string | null {
  if (!values.name || values.name.length > NAME_MAX) return "Please enter your name.";
  if (!EMAIL_RE.test(values.email)) return "Please enter a valid email.";
  if (values.message.length < MESSAGE_MIN)
    return `Please write at least ${MESSAGE_MIN} characters so I know what you're after.`;
  if (values.message.length > MESSAGE_MAX)
    return `Please keep the message under ${MESSAGE_MAX} characters.`;
  return null;
}

function allowRate(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const hits = (rateLimit.get(ip) ?? []).filter((t) => t > cutoff);
  if (hits.length >= RATE_MAX) {
    rateLimit.set(ip, hits);
    return false;
  }
  hits.push(now);
  rateLimit.set(ip, hits);
  return true;
}

function formatBody(values: ContactValues, ip: string): string {
  return [
    `Name:    ${values.name}`,
    `Email:   ${values.email}`,
    `Intent:  ${values.intent}`,
    `IP:      ${ip}`,
    "",
    "Message:",
    values.message,
  ].join("\n");
}

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (String(formData.get("_gotcha") ?? "").length > 0) {
    return { status: "success" };
  }

  const values = readValues(formData);
  const error = validate(values);
  if (error) return { status: "error", message: error, values };

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "local";

  if (!allowRate(ip)) {
    return {
      status: "error",
      message: "Too many submissions from this IP. Try again in an hour.",
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "rusgrekovua@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
  const subject = `[Portfolio · ${values.intent}] ${values.name}`;

  if (!apiKey) {
    console.info("[contact] no RESEND_API_KEY — logging submission only");
    console.info(`[contact] to=${to} subject=${subject}`);
    console.info(formatBody(values, ip));
    return { status: "success" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error: sendErr } = await resend.emails.send({
      from,
      to,
      replyTo: values.email,
      subject,
      text: formatBody(values, ip),
    });
    if (sendErr) {
      console.error("[contact] resend error", sendErr);
      return {
        status: "error",
        message: "Couldn't send just now. Please email me directly.",
        values,
      };
    }
    return { status: "success" };
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again or email me directly.",
      values,
    };
  }
}
