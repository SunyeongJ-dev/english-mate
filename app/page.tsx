"use client";

import { useState } from "react";
import { ViewState, Language, Result, createHistoryItem } from "@/app/lib/types";
import Sidebar from "@/app/components/Sidebar";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import PromptForm from "@/app/components/PromptForm";
import ResultView from "@/app/components/ResultView";

export default function Home() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<ViewState>({ status: "waiting" });
  const [language, setLanguage] = useState<Language>("en");

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setState({ status: "loading" });

    try {
      const result = await requestReview(text);
      setInput("");
      const reviewedResult = createHistoryItem(text, result, language);
      setState({ status: "result", item: reviewedResult });
    } catch (error) {
      setState({ status: "error", message: "An error occurred while processing your request." });
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
    if (!res.ok) {
      throw new Error("Failed to fetch review");
    }
    const data = await res.json();
    return data;
  }

    function handleNewSentence() {
    setState({ status: "waiting" });
  }

  return (
    <div className="flex h-dvh bg-white text-neutral-900">
      <Sidebar />
 
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex justify-end px-4 py-4 md:px-8">
          <LanguageSwitcher value={language} onChange={setLanguage} />
        </header>
 
        <main className="flex flex-1 flex-col overflow-y-auto px-4">
          <div className="m-auto w-full max-w-2xl py-4">
            {state.status === "result" ? (
              <ResultView
                sentence={state.item.input}
                result={state.item.result}
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
