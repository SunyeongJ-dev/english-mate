import LogoMark from "@/app/components/LogoMark";

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-blue-100 bg-blue-50 md:flex">
      <div className="flex items-center gap-2.5 p-4">
        <LogoMark />
        <span className="text-lg font-semibold">English Mate</span>
      </div>

      <nav aria-label="Chat history" className="flex-1 overflow-y-auto px-2">
        {/* Chat history goes here (spec 003) */}
        <p className="px-2 py-2 text-sm text-neutral-600">No chats yet</p>
      </nav>
    </aside>
  );
}
