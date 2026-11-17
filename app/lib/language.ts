import { LANGUAGES, Language } from "@/app/lib/types";

export const LANGUAGE_KEY = "english-mate:language";

// Reads the saved language. Call it in the browser only.
export function loadLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    const language = LANGUAGES.find((item) => item === saved);
    // Nothing saved, or damaged data: start in English.
    return language ?? "en";
  } catch {
    // Blocked storage: start in English.
    return "en";
  }
}

export function saveLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    // Blocked or full storage: the page keeps the choice in memory.
  }
}
