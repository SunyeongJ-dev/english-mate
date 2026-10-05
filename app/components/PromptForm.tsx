type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  errorMessage?: string;
};

export default function PromptForm({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  errorMessage,
}: Props) {
  const isEmpty = value.trim() === "";

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex items-end gap-2 rounded-xl border border-neutral-300 bg-neutral-100 p-2 focus-within:border-black">
        <label htmlFor="sentence" className="sr-only">
          Your sentence
        </label>
        <textarea
          id="sentence"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          rows={2}
          placeholder="Type your sentence here..."
          disabled={isLoading}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? "sentence-error" : undefined}
          className="field-sizing-content min-h-12 flex-1 resize-none bg-transparent p-2 outline-none placeholder:text-neutral-500 disabled:text-neutral-500"
        />
        <button
          type="submit"
          aria-label={isLoading ? "Sending sentence" : "Send sentence"}
          disabled={isEmpty || isLoading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {isLoading ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            >
              <path d="M12 3a9 9 0 1 0 9 9" />
            </svg>
          ) : (
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
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>

      {errorMessage && (
        <p id="sentence-error" role="alert" className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </form>
  );
}