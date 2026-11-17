"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckState,
  FailedItem,
  HistoryItem,
  Language,
  Result,
  createHistoryItem,
} from "@/app/lib/types";
import { TEXTS } from "@/app/lib/texts";
import { addToHistory, loadHistory, saveHistory } from "@/app/lib/history";
import { loadLanguage, saveLanguage } from "@/app/lib/language";
import Sidebar from "@/app/components/Sidebar";
import HistoryDrawer from "@/app/components/HistoryDrawer";
import { HistoryListProps } from "@/app/components/HistoryList";
import LogoMark from "@/app/components/LogoMark";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import PromptForm from "@/app/components/PromptForm";
import ResultView from "@/app/components/ResultView";

// An error whose message comes from /api/chat and is safe to show the user.
class ReviewError extends Error {}

// Reads the message from an error response. The fallback is for a response
// that has none.
function getErrorMessage(data: unknown, fallback: string): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }
  return fallback;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [check, setCheck] = useState<CheckState>({ status: "idle" });
  // The history item whose card is showing. null means the input screen.
  const [openItem, setOpenItem] = useState<HistoryItem | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  // The texts of the selected language.
  const t = TEXTS[language];
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Counts the picks from the history list. It is part of the keys of the
  // result card and the form, so every pick moves focus to what it opens.
  const [selectCount, setSelectCount] = useState(0);
  // Checks that failed while a history card was showing.
  const [failedItems, setFailedItems] = useState<FailedItem[]>([]);
  // Saved results that arrived while a history card was showing and that the
  // user has not opened yet.
  const [unreadIds, setUnreadIds] = useState<string[]>([]);

  // handleSubmit continues seconds after it starts, and by then its own
  // openItem is out of date. The ref always holds the latest value.
  const openItemRef = useRef(openItem);
  useEffect(() => {
    openItemRef.current = openItem;
  }, [openItem]);

  // localStorage exists only in the browser, so read it after the first
  // render. The server and the first client render both show an empty list
  // in English.
  useEffect(() => {
    // This runs once on load, so the extra render the rule warns about is fine.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(loadHistory());
    setLanguage(loadLanguage());
  }, []);

  // The <html> tag is outside this component, so set its lang attribute here.
  // Screen readers use it to pick the right pronunciation.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function handleLanguageChange(next: Language) {
    setLanguage(next);
    saveLanguage(next);
  }

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    if (check.status === "loading") return;
    const text = input.trim();
    setCheck({ status: "loading", text });

    try {
      const result = await requestReview(text);
      const item = createHistoryItem(text, result, language);
      const nextHistory = addToHistory(history, item);
      setHistory(nextHistory);
      saveHistory(nextHistory);
      setInput("");
      setCheck({ status: "idle" });
      if (openItemRef.current === null) {
        // The user waited on the input screen, so open the result.
        setOpenItem(item);
      } else {
        // The user is reading a history card. Keep it and mark the result new.
        setUnreadIds((ids) => [...ids, item.id]);
      }
    } catch (error) {
      // A ReviewError carries an expected message from /api/chat.
      const isExpected = error instanceof ReviewError;
      // This t is from the moment of the submit, so the message keeps that
      // language even if the user has switched since.
      const message = isExpected ? error.message : t.requestFailed;
      if (!isExpected) {
        console.error("Error during requestReview:", error);
      }
      if (openItemRef.current === null) {
        setCheck({ status: "error", message });
        return;
      }
      // The user is reading a history card. Keep the failure in the list, so
      // they can open it later.
      const failed: FailedItem = {
        id: crypto.randomUUID(),
        input: text,
        message,
        createdAt: new Date().toISOString(),
      };
      setFailedItems((items) => [failed, ...items]);
      setInput("");
      setCheck({ status: "idle" });
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
      throw new ReviewError(getErrorMessage(data, t.requestFailed));
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
    setUnreadIds((ids) => ids.filter((id) => id !== item.id));
  }

  // Opens a failed check again on the input screen, ready to fix and resend.
  function handleSelectFailed(failed: FailedItem) {
    setOpenItem(null);
    setSelectCount((count) => count + 1);
    setInput(failed.input);
    setCheck({ status: "error", message: failed.message });
    setFailedItems((items) => items.filter((item) => item.id !== failed.id));
  }

  function handleNewSentence() {
    setOpenItem(null);
    // A check that is still running keeps its sentence and loading state.
    if (check.status !== "loading") {
      setInput("");
      setCheck({ status: "idle" });
    }
  }

  const isLoading = check.status === "loading";
  // The sidebar and the drawer show the same list, so they get the same props.
  const listProps: HistoryListProps = {
    language,
    items: history,
    currentId: openItem?.id,
    onSelect: handleSelectItem,
    // The check shows in the list only while a history card hides the form.
    pendingText: isLoading && openItem !== null ? check.text : undefined,
    onSelectPending: handleNewSentence,
    failedItems,
    failedDisabled: isLoading,
    onSelectFailed: handleSelectFailed,
    unreadIds,
  };
  // The menu button shows a dot while the list has something new to open.
  const hasUpdate =
    failedItems.length > 0 ||
    history.some((item) => unreadIds.includes(item.id));

  return (
    <div className="flex h-dvh">
      <Sidebar {...listProps} />
      <HistoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        {...listProps}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-4 py-1 md:justify-end md:border-b-0 md:bg-white md:px-8 md:py-4">
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              aria-label={hasUpdate ? t.openHistoryUpdate : t.openHistory}
              onClick={() => setDrawerOpen(true)}
              className="relative -ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-blue-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
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
              {hasUpdate && (
                <span
                  aria-hidden="true"
                  className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600"
                />
              )}
            </button>
            <LogoMark />
            {/* Under 375px there is no room for the name next to the buttons. */}
            <span className="hidden text-base font-semibold whitespace-nowrap min-[375px]:inline">
              English Mate
            </span>
          </div>
          <LanguageSwitcher value={language} onChange={handleLanguageChange} />
        </header>
 
        <main className="flex flex-1 flex-col overflow-y-auto px-4">
          <div className="m-auto w-full max-w-2xl py-4">
            {openItem ? (
              // The key remounts the card per pick, so focus moves to it.
              <ResultView
                key={`${openItem.id}-${selectCount}`}
                sentence={openItem.input}
                result={openItem.result}
                language={language}
                onNew={handleNewSentence}
              />
            ) : (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {t.heading}
                </h1>
                <p className="mt-1 mb-6 text-neutral-600">{t.intro}</p>
                <PromptForm
                  key={selectCount}
                  language={language}
                  value={input}
                  onChange={handleInputChange}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
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
