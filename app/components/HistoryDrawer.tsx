import { useEffect, useRef } from "react";
import LogoButton from "@/app/components/LogoButton";
import HistoryList, { HistoryListProps } from "@/app/components/HistoryList";
import { TEXTS } from "@/app/lib/texts";

type Props = HistoryListProps & {
  open: boolean;
  onClose: () => void;
  onLogoClick: () => void;
};

// The history list on mobile. A <dialog> opened with showModal() keeps focus
// inside, closes on Escape, blocks the page behind it, and gives focus back
// to the menu button when it closes.
export default function HistoryDrawer({
  open,
  onClose,
  onLogoClick,
  ...list
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const t = TEXTS[list.language];

  // Open or close the dialog to match the open prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // The desktop layout has no drawer, so close it when the window gets wide.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    const handleChange = () => {
      if (desktop.matches) onClose();
    };
    desktop.addEventListener("change", handleChange);
    return () => desktop.removeEventListener("change", handleChange);
  }, [open, onClose]);

  // Runs a pick from the list after closing the drawer. Closing gives focus
  // back to the menu button, and what the pick opens takes focus after that.
  function closeThen(pick: () => void) {
    dialogRef.current?.close();
    pick();
  }

  return (
    // No display class here: a closed <dialog> must stay display: none.
    <dialog
      ref={dialogRef}
      aria-label={t.history}
      onClose={onClose}
      onClick={(e) => {
        // A click on the backdrop lands on the dialog element itself.
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-0 h-dvh max-h-none w-64 border-0 border-r border-blue-100 bg-blue-50 p-0 text-neutral-900 backdrop:bg-neutral-900/40 md:hidden"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-2 p-2">
          <LogoButton
            onClick={() => closeThen(onLogoClick)}
            textClassName="text-lg"
          />
          <button
            type="button"
            aria-label={t.closeHistory}
            onClick={() => dialogRef.current?.close()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-blue-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <HistoryList
          {...list}
          onSelect={(item) => closeThen(() => list.onSelect(item))}
          onSelectPending={() => closeThen(list.onSelectPending)}
          onSelectFailed={(item) => closeThen(() => list.onSelectFailed(item))}
        />
      </div>
    </dialog>
  );
}
