export const INTENTS = ["fractional", "full-time", "other"] as const;
export type Intent = (typeof INTENTS)[number];

export type ContactValues = {
  name: string;
  email: string;
  intent: Intent;
  message: string;
};

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; values: ContactValues };

export const initialContactState: ContactState = { status: "idle" };
