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
        onSelect={setOpenItem}
      />
 
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-4 py-3 md:justify-end md:border-b-0 md:bg-white md:px-8 md:py-4">
          <div className="flex items-center gap-2 md:hidden">
            <LogoMark />
            <span className="text-base font-semibold">English Mate</span>
          </div>
          <LanguageSwitcher value={language} onChange={setLanguage} />
        </header>
 
        <main className="flex flex-1 flex-col overflow-y-auto px-4">
          <div className="m-auto w-full max-w-2xl py-4">
            {openItem ? (
              // The key remounts the card per item, so focus moves to it.
              <ResultView
                key={openItem.id}
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
