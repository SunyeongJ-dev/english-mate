import LogoMark from "@/app/components/LogoMark";

type Props = {
  onClick: () => void;
  // Classes for the name: its size, and whether it hides on a narrow window.
  textClassName: string;
};

// The logo mark and the app name as one button. It goes to the input screen.
export default function LogoButton({ onClick, textClassName }: Props) {
  return (
    <button
      type="button"
      // The name can be hidden, so screen readers get it from here.
      aria-label="English Mate"
      onClick={onClick}
      className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg px-2 hover:bg-blue-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
    >
      <LogoMark />
      <span className={`font-semibold whitespace-nowrap ${textClassName}`}>
        English Mate
      </span>
    </button>
  );
}
