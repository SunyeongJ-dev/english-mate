import { useEffect, useRef } from "react";
import { LEVEL_LABELS, Language, Level, Result } from "@/app/lib/types";
import CopyButton from "@/app/components/CopyButton";

// Tailwind only finds class names written out in full, so each level lists its own.
const LEVEL_STYLES: Record<Level, { card: string; badge: string; icon: string }> =
  {
    natural: {
      card: "border-green-200 bg-green-50",
      badge: "bg-green-700",
      icon: "M5 12l5 5L20 7",
    },
    slightly_awkward: {
      card: "border-amber-200 bg-amber-50",
      badge: "bg-amber-700",
      icon: "M12 6v8M12 18h.01",
    },
    awkward: {
      card: "border-red-200 bg-red-50",
      badge: "bg-red-700",
      icon: "M6 6l12 12M18 6L6 18",
    },
  };

type Props = {
  sentence: string;
  result: Result;
  language: Language;
  onNew: () => void;
};

export default function ResultView({
  sentence,
  result,
  language,
  onNew,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const style = LEVEL_STYLES[result.level];

  // Move focus to the result so screen reader users hear it.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const alternatives = [
    { label: "Formal", value: result.formal, copyLabel: "Copy formal sentence" },
    { label: "Casual", value: result.casual, copyLabel: "Copy casual sentence" },
  ];

  return (
    <section className={`rounded-xl border p-4 md:p-6 ${style.card}`}>
      <h1 ref={headingRef} tabIndex={-1} className="sr-only">
        Review result
      </h1>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm font-medium text-neutral-600">Your sentence</p>
        <p className="wrap-anywhere text-lg md:text-xl">“{sentence}”</p>
      </div>

      <div className="mt-4 flex justify-center">
        <p
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold text-white ${style.badge}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={style.icon} />
          </svg>
          {LEVEL_LABELS[language][result.level]}
        </p>
      </div>

      <dl className="mt-4 divide-y divide-neutral-200 rounded-lg bg-white px-4 md:px-6">
        {alternatives.map((row) => (
          <div key={row.label} className="py-3">
            <dt className="text-sm font-semibold text-blue-700">{row.label}</dt>
            <dd className="flex items-center justify-between gap-2">
              <span className="min-w-0 whitespace-pre-wrap wrap-anywhere">
                {row.value}
              </span>
              <CopyButton text={row.value} label={row.copyLabel} />
            </dd>
          </div>
        ))}
        <div className="py-4">
          <dt className="text-sm font-semibold text-neutral-600">Note</dt>
          <dd className="mt-1 whitespace-pre-wrap wrap-anywhere">{result.note}</dd>
        </div>
      </dl>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onNew}
          className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          New sentence
        </button>
      </div>
    </section>
  );
}
