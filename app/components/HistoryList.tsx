import { FailedItem, HistoryItem, Language } from "@/app/lib/types";
import { TEXTS } from "@/app/lib/texts";

export type HistoryListProps = {
  language: Language;
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
  onDelete: (item: HistoryItem) => void;
  onDeleteFailed: (item: FailedItem) => void;
};

type Entry =
  | { kind: "saved"; item: HistoryItem }
  | { kind: "failed"; item: FailedItem };

const ROW_CLASS =
  "flex min-h-11 w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-neutral-900 hover:bg-blue-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:text-neutral-500 disabled:hover:bg-transparent";

// A row with a delete button keeps room for it on the right. In the sidebar
// (md and up) the button and its room show only while the pointer is over the
// row or focus is in it. In the mobile drawer they always show.
const DELETABLE_ROW_CLASS =
  "pr-11 md:pr-2 md:group-hover:pr-11 md:group-focus-within:pr-11";

type DeleteButtonProps = {
  label: string;
  onClick: () => void;
};

function DeleteButton({ label, onClick }: DeleteButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="absolute top-0 right-0 flex h-11 w-11 items-center justify-center rounded-lg text-neutral-600 hover:text-red-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
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
        aria-hidden="true"
      >
        <path d="M4 7h16M9 7V4h6v3M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M10 11v6M14 11v6" />
      </svg>
    </button>
  );
}

// The history list. The desktop sidebar and the mobile drawer both show it.
export default function HistoryList({
  language,
  items,
  currentId,
  onSelect,
  pendingText,
  onSelectPending,
  failedItems,
  failedDisabled,
  onSelectFailed,
  unreadIds,
  onDelete,
  onDeleteFailed,
}: HistoryListProps) {
  const t = TEXTS[language];
  // Saved and failed items share one list, newest first, so a check keeps its
  // place when it finishes. ISO dates sort correctly as plain text.
  const entries: Entry[] = [
    ...failedItems.map((item): Entry => ({ kind: "failed", item })),
    ...items.map((item): Entry => ({ kind: "saved", item })),
  ].sort((a, b) => b.item.createdAt.localeCompare(a.item.createdAt));

  const isEmpty = entries.length === 0 && pendingText === undefined;

  return (
    <nav
      aria-label={t.chatHistory}
      className="flex-1 overflow-y-auto px-2 pb-2"
    >
      {isEmpty ? (
        <p className="px-2 py-2 text-sm text-neutral-600">{t.noChats}</p>
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
                <span className="sr-only">{t.checking}</span>
                <span className="truncate">{pendingText}</span>
              </button>
            </li>
          )}

          {entries.map((entry) => {
            if (entry.kind === "failed") {
              const { item } = entry;
              return (
                <li key={item.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onSelectFailed(item)}
                    disabled={failedDisabled}
                    title={item.input}
                    className={`${ROW_CLASS} ${DELETABLE_ROW_CLASS}`}
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
                    <span className="sr-only">{t.checkFailed}</span>
                    <span className="truncate">{item.input}</span>
                  </button>
                  <DeleteButton
                    label={`${t.deleteItem}: ${item.input}`}
                    onClick={() => onDeleteFailed(item)}
                  />
                </li>
              );
            }

            const { item } = entry;
            const isCurrent = item.id === currentId;
            const isUnread = unreadIds.includes(item.id);
            return (
              <li key={item.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  title={item.input}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`${ROW_CLASS} ${DELETABLE_ROW_CLASS} ${
                    isCurrent ? "bg-blue-100" : ""
                  } ${isUnread ? "font-semibold" : ""}`}
                >
                  {isUnread && <span className="sr-only">{t.newResult}</span>}
                  <span className="truncate">{item.input}</span>
                </button>
                <DeleteButton
                  label={`${t.deleteItem}: ${item.input}`}
                  onClick={() => onDelete(item)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
