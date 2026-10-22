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
  { value: "fractional", label: "Fractional / consulting", hint: "A project, an audit or a few weeks of help." },
  { value: "full-time", label: "Full-time role", hint: "You are hiring for a permanent position." },
  { value: "other", label: "Something else", hint: "A question, an idea, or just hi." },
] as const;

const inputClass =
  "min-h-11 rounded-[var(--radius-tile)] border border-[color:var(--outline-strong)] bg-[color:var(--bg-elevated)] px-3.5 py-2.5 font-sans text-[length:var(--type-small)] text-[color:var(--ink-primary)] transition-shadow placeholder:text-[color:var(--ink-muted)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]";

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
        className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8 shadow-[var(--shadow-card)] md:p-10"
        role="status"
        aria-live="polite"
      >
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="font-serif text-[length:var(--type-display-s)] leading-[1.1] text-[color:var(--ink-primary)] outline-none"
        >
          Thanks — I got it.
        </h2>
        <p className="max-w-sm text-[length:var(--type-small)] leading-[1.6] text-[color:var(--ink-body)]">
          I read every message and reply within two business days.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--outline)] px-4 font-sans text-sm text-[color:var(--ink-primary)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] motion-reduce:transform-none"
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
      aria-labelledby="contact-form-heading"
      className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] md:p-9"
    >
      <div className="flex flex-col gap-6">
        <h2 id="contact-form-heading" className="font-serif text-[length:var(--type-display-s)] leading-[1.1] text-[color:var(--ink-primary)]">
          Write to me
        </h2>
        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 font-sans text-sm font-semibold text-[color:var(--ink-primary)]">
            What is this about?
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {INTENT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="group relative flex cursor-pointer flex-col gap-1 rounded-[var(--radius-tile)] border border-[color:var(--outline)] bg-[color:var(--bg-page)] p-3.5 transition-colors has-[:checked]:border-[color:var(--ink-primary)] has-[:checked]:bg-[color:var(--bg-elevated)] has-[:focus-visible]:shadow-[var(--focus-ring)]"
              >
                <input
                  type="radio"
                  name="intent"
                  value={opt.value}
                  defaultChecked={currentIntent === opt.value}
                  className="sr-only"
                />
                <span className="flex items-center gap-2 font-sans text-sm font-semibold text-[color:var(--ink-primary)]">
                  <span
                    aria-hidden
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border border-[color:var(--outline-strong)] after:h-2 after:w-2 after:rounded-[var(--radius-pill)] after:bg-[color:var(--accent)] after:opacity-0 group-has-[:checked]:border-[color:var(--accent)] group-has-[:checked]:after:opacity-100"
                  />
                  {opt.label}
                </span>
                <span className="font-sans text-[length:var(--type-caption)] leading-[1.45] text-[color:var(--ink-muted)]">
                  {opt.hint}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-5 sm:grid-cols-2">
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
        </div>
        <label className="flex flex-col gap-2">
          <span className="font-sans text-sm font-semibold text-[color:var(--ink-primary)]">
            Message
          </span>
          <textarea
            aria-describedby="message-hint"
            name="message"
            rows={6}
            required
            minLength={20}
            maxLength={5000}
            defaultValue={fieldValue(state, "message")}
            placeholder="What are you building, and how could I help?"
            className={`${inputClass} resize-y`}
          />
          <span id="message-hint" className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
            At least 20 characters. Links to a repo, a doc or a live site help.
          </span>
        </label>

        <Honeypot />

        {errorMessage ? (
          <p
            role="alert"
            aria-live="assertive"
            className="rounded-[var(--radius-tile)] border border-[color:var(--accent)] bg-[color:var(--accent-soft)] px-3.5 py-2.5 font-sans text-sm text-[color:var(--ink-primary)]"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--hairline)] pt-5">
          <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]" aria-live="polite">
            {pending ? "Sending your message…" : "Usually replies within two business days."}
          </p>
          <CTAButton type="submit" size="md" disabled={pending}>
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
      <span className="font-sans text-sm font-semibold text-[color:var(--ink-primary)]">
        {label}
      </span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
        className={inputClass}
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
