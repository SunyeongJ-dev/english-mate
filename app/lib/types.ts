export const LEVELS = ["natural", "slightly_awkward", "awkward"] as const;
export type Level = (typeof LEVELS)[number];
export const LANGUAGES = ["en", "fr", "ko"] as const;
export type Language = (typeof LANGUAGES)[number];

export type Result = {
  level: Level;
  formal: string;
  informal: string;
  note: string;
};

export type HistoryItem = {
  id: string;
  input: string;
  result: Result;
  language: Language;
  createdAt: string;
};

export type ViewState =
  | { status: "waiting" }
  | { status: "loading" }
  | { status: "result"; item: HistoryItem }
  | { status: "error"; message: string };

export const LEVEL_LABELS: Record<Language, Record<Level, string>> = {
  en: {
    natural: "This sounds natural.",
    slightly_awkward: "This is a bit awkward.",
    awkward: "This sounds quite awkward.",
  },
  fr: {
    natural: "Cette phrase est naturelle.",
    slightly_awkward: "Cette phrase est un peu maladroite.",
    awkward: "Cette phrase est assez maladroite.",
  },
  ko: {
    natural: "자연스러운 문장입니다.",
    slightly_awkward: "약간 어색한 문장입니다.",
    awkward: "꽤 어색한 문장입니다.",
  },
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
