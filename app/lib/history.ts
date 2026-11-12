import { HistoryItem, LANGUAGES, LEVELS } from "@/app/lib/types";

export const HISTORY_KEY = "english-mate:history";
export const MAX_HISTORY = 50;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isHistoryItem(value: unknown): value is HistoryItem {
  if (!isRecord(value) || !isRecord(value.result)) return false;
  const { result } = value;
  return (
    typeof value.id === "string" &&
    typeof value.input === "string" &&
    typeof value.createdAt === "string" &&
    (LANGUAGES as readonly unknown[]).includes(value.language) &&
    (LEVELS as readonly unknown[]).includes(result.level) &&
    typeof result.formal === "string" &&
    typeof result.casual === "string" &&
    typeof result.note === "string"
  );
}

// Reads the saved history. Call it in the browser only.
export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryItem).slice(0, MAX_HISTORY);
  } catch {
    // Blocked storage or damaged data: start with an empty history.
    return [];
  }
}

export function saveHistory(items: HistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch {
    // Blocked or full storage: the page keeps the list in memory.
  }
}

// Returns a new list with the item first, cut to the MAX_HISTORY newest items.
export function addToHistory(
  items: HistoryItem[],
  item: HistoryItem,
): HistoryItem[] {
  return [item, ...items].slice(0, MAX_HISTORY);
}
