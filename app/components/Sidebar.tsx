import LogoMark from "@/app/components/LogoMark";
import HistoryList, { HistoryListProps } from "@/app/components/HistoryList";

export default function Sidebar(props: HistoryListProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-blue-100 bg-blue-50 md:flex">
      <div className="flex items-center gap-2.5 p-4">
        <LogoMark />
        <span className="text-lg font-semibold">English Mate</span>
      </div>

      <HistoryList {...props} />
    </aside>
  );
}
