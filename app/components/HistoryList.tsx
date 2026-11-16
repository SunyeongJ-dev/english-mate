import { HistoryItem } from "@/app/lib/types";

type Props = {
  items: HistoryItem[];
  currentId?: string;
  onSelect: (item: HistoryItem) => void;
};

// The history list. The desktop sidebar and the mobile drawer both show it.
export default function HistoryList({ items, currentId, onSelect }: Props) {
  return (
    <nav aria-label="Chat history" className="flex-1 overflow-y-auto px-2 pb-2">
      {items.length === 0 ? (
        <p className="px-2 py-2 text-sm text-neutral-600">No chats yet</p>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const isCurrent = item.id === currentId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  title={item.input}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`block min-h-11 w-full truncate rounded-lg px-2 py-2 text-left text-sm text-neutral-900 hover:bg-blue-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 ${
                    isCurrent ? "bg-blue-100" : ""
                  }`}
                >
                  {item.input}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
