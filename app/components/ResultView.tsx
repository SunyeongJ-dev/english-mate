import { Result } from "@/app/lib/types";

type Props = {
  sentence: string;
  result: Result;
  onNew: () => void;
};

export default function ResultView({ sentence, result, onNew }: Props) {
  const rows = [
    { label: "Level", value: result.level },
    { label: "Formal", value: result.formal },
    { label: "Informal", value: result.informal },
    { label: "Note", value: result.note },
  ];

  return (
    <section className="rounded-xl bg-neutral-100 p-4 md:p-6">
      <h1 className="sr-only">Review result</h1>

      <p className="break-words text-center text-lg">“{sentence}”</p>

      <dl className="mt-4 divide-y divide-neutral-200 rounded-lg bg-white px-4 md:px-6">
        {rows.map((row) => (
          <div key={row.label} className="py-4">
            <p className="mt-1 whitespace-pre-wrap break-words">{row.value}</p>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex justify-center gap-2">
        <button
          type="button"
          onClick={onNew}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          New sentence
        </button>
      </div>
    </section>
  );
}