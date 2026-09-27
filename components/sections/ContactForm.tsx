"use client";

import { useActionState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { sendContact } from "@/app/(marketing)/contact/actions";
import {
  initialContactState,
  type ContactState,
} from "@/app/(marketing)/contact/types";
import { CTAButton } from "@/components/ui/CTAButton";
import { track } from "@/lib/analytics";

const INTENT_OPTIONS = [
  { value: "fractional", label: "Fractional / consulting" },
  { value: "full-time", label: "Full-time role" },
  { value: "other", label: "Other / just saying hi" },
] as const;

type IntentValue = (typeof INTENT_OPTIONS)[number]["value"];

function readIntentParam(raw: string | null): IntentValue {
  if (raw === "fractional" || raw === "full-time" || raw === "other") return raw;
  return "fractional";
}

function fieldValue(state: ContactState, key: "name" | "email" | "message"): string {
  if (state.status === "error") return state.values[key];
  return "";
}

function fieldIntent(state: ContactState, prefill: IntentValue): IntentValue {
  if (state.status === "error") return state.values.intent;
  return prefill;
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const prefillIntent = readIntentParam(searchParams.get("intent"));
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendContact,
    initialContactState,
  );
  const successHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (state.status === "success") {
      successHeadingRef.current?.focus();
      track("contact_form_submit", { intent: prefillIntent });
    }
  }, [state.status, prefillIntent]);

  if (state.status === "success") {
    return (
      <div
        className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-8 py-12 text-center shadow-[var(--shadow-card)]"
        role="status"
        aria-live="polite"
      >
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="font-serif text-[clamp(28px,3.5vw,40px)] text-[color:var(--ink-primary)] outline-none"
        >
          Thanks — I got it.
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-[color:var(--ink-body)]">
          I read every message and reply within two business days.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-4 py-2 font-sans text-sm text-[color:var(--ink-primary)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none"
        >
          <span aria-hidden>←</span>
          <span>Back to home</span>
        </Link>
      </div>
    );
  }

  const errorMessage = state.status === "error" ? state.message : null;
  const currentIntent = fieldIntent(state, prefillIntent);

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-6 py-8 shadow-[var(--shadow-card)] md:px-8 md:py-10"
    >
      <div className="flex flex-col gap-5">
        <Field
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          required
          defaultValue={fieldValue(state, "name")}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={fieldValue(state, "email")}
        />
        <label className="flex flex-col gap-2">
          <span className="font-sans text-sm text-[color:var(--ink-primary)]">
            I&rsquo;m reaching out about
          </span>
          <select
            name="intent"
            defaultValue={currentIntent}
            className="rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-3.5 py-2.5 font-sans text-sm text-[color:var(--ink-primary)] transition-colors focus-visible:border-[color:var(--ink-primary)] focus-visible:outline-none"
          >
            {INTENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-sans text-sm text-[color:var(--ink-primary)]">
            Message
          </span>
          <textarea
            name="message"
            rows={6}
            required
            minLength={20}
            maxLength={5000}
            defaultValue={fieldValue(state, "message")}
            placeholder="What are you building, and how could I help?"
            className="resize-y rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-3.5 py-2.5 font-sans text-sm text-[color:var(--ink-primary)] transition-colors placeholder:text-[color:var(--ink-muted)] focus-visible:border-[color:var(--ink-primary)] focus-visible:outline-none"
          />
        </label>

        <Honeypot />

        {errorMessage ? (
          <p
            role="alert"
            aria-live="assertive"
            className="rounded-[var(--radius-tile)] border border-[color:var(--ink-primary)] bg-[color:var(--bg-page)] px-3.5 py-2.5 font-sans text-sm text-[color:var(--ink-primary)]"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-4 pt-2">
          <p className="font-sans text-xs text-[color:var(--ink-muted)]" aria-live="polite">
            {pending ? "Sending your message…" : "Usually replies within two business days."}
          </p>
          <CTAButton type="submit" disabled={pending}>
            {pending ? "Sending…" : "Send message"}
            <span aria-hidden>→</span>
          </CTAButton>
        </div>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type: "text" | "email";
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
};

function Field({ label, name, type, autoComplete, required, defaultValue }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-sm text-[color:var(--ink-primary)]">
        {label}
      </span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
        className="rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-3.5 py-2.5 font-sans text-sm text-[color:var(--ink-primary)] transition-colors placeholder:text-[color:var(--ink-muted)] focus-visible:border-[color:var(--ink-primary)] focus-visible:outline-none"
      />
    </label>
  );
}

function Honeypot() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <label>
        Do not fill this in
        <input
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}
