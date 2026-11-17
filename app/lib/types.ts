export const LEVELS = ["natural", "slightly_awkward", "awkward"] as const;
export type Level = (typeof LEVELS)[number];
export const LANGUAGES = ["en", "fr", "ko"] as const;
export type Language = (typeof LANGUAGES)[number];

export type Result = {
  level: Level;
  formal: string;
  casual: string;
  note: string;
};

export type HistoryItem = {
  id: string;
  input: string;
  result: Result;
  language: Language;
  createdAt: string;
};

// The state of the check request. It is separate from what is on screen,
// because a check keeps running while the user reads a history item.
export type CheckState =
  | { status: "idle" }
  | { status: "loading"; text: string }
  | { status: "error"; message: string };

// A check that failed while the user was reading a history item. It lives in
// memory only and is never saved to localStorage.
export type FailedItem = {
  id: string;
  input: string;
  message: string;
  createdAt: string;
};

export function createHistoryItem(
  input: string,
  result: Result,
  language: Language,
): HistoryItem {
  return {
    id: crypto.randomUUID(),
    input,
    result,
    language,
    createdAt: new Date().toISOString(),
  };
}
