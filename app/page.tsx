"use client";

import { useState } from "react";
import {
  ViewState,
  Language,
  Result,
  REQUEST_FAILED_MESSAGE,
  createHistoryItem,
} from "@/app/lib/types";
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
  const [state, setState] = useState<ViewState>({ status: "waiting" });
  const [language, setLanguage] = useState<Language>("en");

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    const text = input.trim();
    setState({ status: "loading" });

    try {
      const result = await requestReview(text);
      setInput("");
      const reviewedResult = createHistoryItem(text, result, language);
      setState({ status: "result", item: reviewedResult });
    } catch (error) {
      if (error instanceof ReviewError) {
        // An expected message from /api/chat. Show it without logging.
        setState({ status: "error", message: error.message });
        return;
      }
      setState({ status: "error", message: REQUEST_FAILED_MESSAGE });
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

    function handleNewSentence() {
    setState({ status: "waiting" });
  }

  return (
    <div className="flex h-dvh">
      <Sidebar />
 
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
            {state.status === "result" ? (
              <ResultView
                sentence={state.item.input}
                result={state.item.result}
                language={state.item.language}
                onNew={handleNewSentence}
              />
            ) : (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Give your sentence
                </h1>
                <p className="mt-1 mb-6 text-neutral-600">
                  Write a sentence you want to practice.
                </p>
                <PromptForm
                  value={input}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                  isLoading={state.status === "loading"}
                  errorMessage={
                    state.status === "error" ? state.message : undefined
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
