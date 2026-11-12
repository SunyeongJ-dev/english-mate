import { HistoryItem } from "@/app/lib/types";
import LogoMark from "@/app/components/LogoMark";

type Props = {
  items: HistoryItem[];
  currentId?: string;
  onSelect: (item: HistoryItem) => void;
};

export default function Sidebar({ items, currentId, onSelect }: Props) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-blue-100 bg-blue-50 md:flex">
      <div className="flex items-center gap-2.5 p-4">
        <LogoMark />
        <span className="text-lg font-semibold">English Mate</span>
      </div>

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
    </aside>
  );
}
