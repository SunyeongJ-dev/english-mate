import LogoButton from "@/app/components/LogoButton";
import HistoryList, { HistoryListProps } from "@/app/components/HistoryList";

type Props = HistoryListProps & {
  onLogoClick: () => void;
};

export default function Sidebar({ onLogoClick, ...list }: Props) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-blue-100 bg-blue-50 md:flex">
      <div className="flex p-2">
        <LogoButton onClick={onLogoClick} textClassName="text-lg" />
      </div>

      <HistoryList {...list} />
    </aside>
  );
}
