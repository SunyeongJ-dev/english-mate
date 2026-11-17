import { FailedItem, HistoryItem } from "@/app/lib/types";

export type HistoryListProps = {
  items: HistoryItem[];
  currentId?: string;
  onSelect: (item: HistoryItem) => void;
  // The sentence of a check that is loading while a history card is showing.
  pendingText?: string;
  onSelectPending: () => void;
  failedItems: FailedItem[];
  failedDisabled: boolean;
  onSelectFailed: (item: FailedItem) => void;
  // Saved items with a result the user has not opened yet.
  unreadIds: string[];
};

type Entry =
  | { kind: "saved"; item: HistoryItem }
  | { kind: "failed"; item: FailedItem };

const ROW_CLASS =
  "flex min-h-11 w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-neutral-900 hover:bg-blue-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:text-neutral-500 disabled:hover:bg-transparent";

// The history list. The desktop sidebar and the mobile drawer both show it.
export default function HistoryList({
  items,
  currentId,
  onSelect,
  pendingText,
  onSelectPending,
  failedItems,
  failedDisabled,
  onSelectFailed,
  unreadIds,
}: HistoryListProps) {
  // Saved and failed items share one list, newest first, so a check keeps its
  // place when it finishes. ISO dates sort correctly as plain text.
  const entries: Entry[] = [
    ...failedItems.map((item): Entry => ({ kind: "failed", item })),
    ...items.map((item): Entry => ({ kind: "saved", item })),
  ].sort((a, b) => b.item.createdAt.localeCompare(a.item.createdAt));

  const isEmpty = entries.length === 0 && pendingText === undefined;

  return (
    <nav aria-label="Chat history" className="flex-1 overflow-y-auto px-2 pb-2">
      {isEmpty ? (
        <p className="px-2 py-2 text-sm text-neutral-600">No chats yet</p>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {pendingText !== undefined && (
            <li>
              <button
                type="button"
                onClick={onSelectPending}
                title={pendingText}
                className={ROW_CLASS}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="shrink-0 animate-spin text-neutral-600 motion-reduce:animate-none"
                  aria-hidden="true"
                >
                  <path d="M12 3a9 9 0 1 0 9 9" />
                </svg>
                <span className="sr-only">Checking</span>
                <span className="truncate">{pendingText}</span>
              </button>
            </li>
          )}

          {entries.map((entry) => {
            if (entry.kind === "failed") {
              const { item } = entry;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelectFailed(item)}
                    disabled={failedDisabled}
                    title={item.input}
                    className={ROW_CLASS}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-red-700"
                      aria-hidden="true"
                    >
                      <path d="M12 4L2.5 20h19L12 4zM12 10v4M12 17h.01" />
                    </svg>
                    <span className="sr-only">Check failed</span>
                    <span className="truncate">{item.input}</span>
                  </button>
                </li>
              );
            }

            const { item } = entry;
            const isCurrent = item.id === currentId;
            const isUnread = unreadIds.includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  title={item.input}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`${ROW_CLASS} ${isCurrent ? "bg-blue-100" : ""} ${
                    isUnread ? "font-semibold" : ""
                  }`}
                >
                  {isUnread && <span className="sr-only">New result</span>}
                  <span className="truncate">{item.input}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
