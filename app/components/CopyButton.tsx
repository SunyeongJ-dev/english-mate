import { useEffect, useState } from "react";

type Status = "idle" | "copied" | "failed";

const STATUS_TEXT: Record<Status, string> = {
  idle: "",
  copied: "Copied",
  failed: "Couldn't copy",
};

type Props = {
  text: string;
  label: string;
};

export default function CopyButton({ text, label }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  // Show "Copied" or "Couldn't copy" for 2 seconds.
  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      {/* The live region stays on the page so screen readers announce new text. */}
      <span
        aria-live="polite"
        className={`text-sm ${
          status === "failed" ? "text-red-600" : "text-neutral-600"
        }`}
      >
        {STATUS_TEXT[status]}
      </span>
      <button
        type="button"
        aria-label={label}
        onClick={handleClick}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {status === "copied" ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        )}
      </button>
    </div>
  );
}
