import { HistoryItem } from "@/app/lib/types";
import LogoMark from "@/app/components/LogoMark";
import HistoryList from "@/app/components/HistoryList";

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

      <HistoryList items={items} currentId={currentId} onSelect={onSelect} />
    </aside>
  );
}
