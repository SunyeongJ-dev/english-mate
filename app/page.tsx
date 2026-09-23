"use client";

import { useState } from "react";
import { ViewState, Language, Result, createHistoryItem } from "@/app/lib/types";


export default function Home() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<ViewState>({ status: "waiting" });
  const [language, setLanguage] = useState<Language>("en");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    setState({ status: "loading" });

    try {
      const result = await requestReview(text);
      const reviewedResult = createHistoryItem(text, result, language);
      setState({ status: "result", item: reviewedResult });
    } catch (error) {
      setState({ status: "error", message: "An error occurred while processing your request." }); 
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

  return (
    <>
      <header className="flex items-center justify-between gap-2">
        <h1>English Mate</h1>
        <p>Your Name</p>
      </header>
      <div className="p-4">
        <button className={`language === "en" ? "bg-blue-500 text-white p-2 rounded-md" : "bg-gray-300 text-gray-500 p-2 rounded-md"`}>English</button>
        <button className={`language === "fr" ? "bg-blue-500 text-white p-2 rounded-md" : "bg-gray-300 text-gray-500 p-2 rounded-md"`}>French</button>
        <button className={`language === "ko" ? "bg-blue-500 text-white p-2 rounded-md" : "bg-gray-300 text-gray-500 p-2 rounded-md"`}>Korean</button>
        </div>
      <div className="p-4">
        <div
          aria-label="chat"
          className="flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-md p-4"
        >
            {state.status === "waiting" && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  rows={4}
                  placeholder="Type your text here..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Submit
                </button>
              </form>
            )}
            {state.status === "loading" && (
              <p className="bg-white text-black p-2 rounded-md">Processing your request...</p>
            )}
            {state.status === "result" && (<>
              <p className="bg-white text-black p-2 rounded-md">{state.item.result.level}</p>
              <p className="bg-white text-black p-2 rounded-md">{state.item.result.formal}</p>
              <p className="bg-white text-black p-2 rounded-md">{state.item.result.informal}</p>
              <p className="bg-white text-black p-2 rounded-md">{state.item.result.note}</p>
              </>
            )}
            {state.status === "error" && (
              <p className="bg-white text-black p-2 rounded-md">{state.message}</p>
            )}
        </div>

      </div>
    </>
  );
}
