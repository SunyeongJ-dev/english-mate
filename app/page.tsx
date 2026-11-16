"use client";

import { useEffect, useState } from "react";
import {
  CheckState,
  HistoryItem,
  Language,
  Result,
  REQUEST_FAILED_MESSAGE,
  createHistoryItem,
} from "@/app/lib/types";
import { addToHistory, loadHistory, saveHistory } from "@/app/lib/history";
import Sidebar from "@/app/components/Sidebar";
import HistoryDrawer from "@/app/components/HistoryDrawer";
import LogoMark from "@/app/components/LogoMark";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import PromptForm from "@/app/components/PromptForm";
import ResultView from "@/app/components/ResultView";

// An error whose message comes from /api/chat and is safe to show the user.
class ReviewError extends Error {}

function getErrorMessage(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }
  return REQUEST_FAILED_MESSAGE;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [check, setCheck] = useState<CheckState>({ status: "idle" });
  // The history item whose card is showing. null means the input screen.
  const [openItem, setOpenItem] = useState<HistoryItem | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Counts the picks from the history list. It is part of the result card's
  // key, so picking the item that is already open moves focus to the card too.
  const [selectCount, setSelectCount] = useState(0);

  // localStorage exists only in the browser, so read it after the first
  // render. The server and the first client render both show an empty list.
  useEffect(() => {
    // This runs once on load, so the extra render the rule warns about is fine.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(loadHistory());
  }, []);

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    if (check.status === "loading") return;
    const text = input.trim();
    setCheck({ status: "loading" });

    try {
      const result = await requestReview(text);
      const item = createHistoryItem(text, result, language);
      const nextHistory = addToHistory(history, item);
      setHistory(nextHistory);
      saveHistory(nextHistory);
      setInput("");
      setCheck({ status: "idle" });
      // If the user opened a history item while waiting, keep that card.
      setOpenItem((current) => current ?? item);
    } catch (error) {
      if (error instanceof ReviewError) {
        // An expected message from /api/chat. Show it without logging.
        setCheck({ status: "error", message: error.message });
        return;
      }
      setCheck({ status: "error", message: REQUEST_FAILED_MESSAGE });
      console.error("Error during requestReview:", error);
    }
  };

  async function requestReview(message: string): Promise<Result> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: message, language }),
    });
    const data: unknown = await res.json().catch(() => null);
    if (!res.ok) {
      throw new ReviewError(getErrorMessage(data));
    }
    if (data === null) {
      throw new Error("The response body is not JSON");
    }
    return data as Result;
  }

  function handleInputChange(value: string) {
    setInput(value);
    // The error is about the old text, so hide it once the user edits.
    if (check.status === "error") {
      setCheck({ status: "idle" });
    }
  }

  function handleSelectItem(item: HistoryItem) {
    setOpenItem(item);
    setSelectCount((count) => count + 1);
  }

  function handleNewSentence() {
    setOpenItem(null);
    // A check that is still running keeps its sentence and loading state.
    if (check.status !== "loading") {
      setInput("");
      setCheck({ status: "idle" });
    }
  }

  return (
    <div className="flex h-dvh">
      <Sidebar
        items={history}
        currentId={openItem?.id}
        onSelect={handleSelectItem}
      />
      <HistoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={history}
        currentId={openItem?.id}
        onSelect={handleSelectItem}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-4 py-1 md:justify-end md:border-b-0 md:bg-white md:px-8 md:py-4">
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              aria-label="Open history"
              onClick={() => setDrawerOpen(true)}
              className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-blue-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
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
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <LogoMark />
            {/* Under 375px there is no room for the name next to the buttons. */}
            <span className="hidden text-base font-semibold whitespace-nowrap min-[375px]:inline">
              English Mate
            </span>
          </div>
          <LanguageSwitcher value={language} onChange={setLanguage} />
        </header>
 
        <main className="flex flex-1 flex-col overflow-y-auto px-4">
          <div className="m-auto w-full max-w-2xl py-4">
            {openItem ? (
              // The key remounts the card per pick, so focus moves to it.
              <ResultView
                key={`${openItem.id}-${selectCount}`}
                sentence={openItem.input}
                result={openItem.result}
                language={openItem.language}
                onNew={handleNewSentence}
              />
            ) : (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  What do you want to say today?
                </h1>
                <p className="mt-1 mb-6 text-neutral-600">
                  Write one English sentence to see how natural it sounds.
                </p>
                <PromptForm
                  value={input}
                  onChange={handleInputChange}
                  onSubmit={handleSubmit}
                  isLoading={check.status === "loading"}
                  errorMessage={
                    check.status === "error" ? check.message : undefined
                  }
                />
              </>
            )}
          </div>
        </main>
 
        <footer className="px-4 py-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} English Mate
        </footer>
      </div>
    </div>
  );
}
