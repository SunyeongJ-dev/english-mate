import { Language } from "@/app/lib/types";

const OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
  { value: "ko", label: "KO" },
];

type Props = {
  value: Language;
  onChange: (language: Language) => void;
};

export default function LanguageSwitcher({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex rounded-lg border border-neutral-300 p-0.5"
    >
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-3 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
              selected
                ? "bg-black text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}