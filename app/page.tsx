"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput("");
    setIsChatting(true);
    setMessages((prevMessages) => [...prevMessages, input]);
  };

  return (
    <>
      <header className="flex items-center justify-between gap-2">
        <h1>English Mate</h1>
        <p>Your Name</p>
      </header>
      <div className="p-4">
        <div
          aria-label="chat"
          className={`${isChatting ? "flex" : "hidden"} flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-md p-4`}
        >
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        <div
          aria-label="input"
          className="flex flex-col items-center justify-center gap-4"
        >
          <form onSubmit={handleSubmit} className="flex w-full justify-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your text here..."
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></input>
          </form>
        </div>
      </div>
    </>
  );
}
