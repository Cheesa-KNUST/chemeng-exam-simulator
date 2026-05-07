"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Bot, User, Sparkles, RotateCcw } from "lucide-react";
import { ExamQuestion } from "@/mock/exams";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

type Message = {
  role: "user" | "ai";
  content: string;
  imageUrl?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  question: ExamQuestion;
  questionIndex: number;
  correctAnswer: string;
};

export default function ExplanationModal({
  open,
  onClose,
  question,
  questionIndex,
  correctAnswer,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function buildSeed(): Message {
    const base = {
      role: "user" as const,
      content: `Please explain the correct answer to this exam question.\n\nQuestion: ${question.question}\nCorrect answer: ${correctAnswer}\n\nGive me a clear academic explanation of why this is correct.`,
    };
    if (question.kind === "pictorial_mcq" && question.image) {
      return { ...base, imageUrl: question.image };
    }
    return base;
  }

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const initialize = async () => {
      setLoading(true);
      setMessages([]);
      setInput("");

      try {
        const reply = await fetchAI([buildSeed()]);
        if (!cancelled) setMessages([{ role: "ai", content: reply }]);
      } catch {
        if (!cancelled) {
          setMessages([
            { role: "ai", content: "Something went wrong. Please try again." },
          ]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timeout = setTimeout(initialize, 0);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, question.question, correctAnswer]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading && open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [loading, open]);

  async function fetchAI(msgs: Message[]): Promise<string> {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs }),
    });
    if (!res.ok) throw new Error("AI request failed");
    const data = await res.json();
    return data.response ?? "Sorry, I couldn't generate a response.";
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    const withContext = [buildSeed(), ...updated];

    try {
      const reply = await fetchAI(withContext);
      setMessages((prev) => [...prev, { role: "ai", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleReset() {
    if (loading) return;

    setMessages([]);
    setLoading(true);

    fetchAI([buildSeed()])
      .then((reply) => setMessages([{ role: "ai", content: reply }]))
      .catch(() =>
        setMessages([
          { role: "ai", content: "Something went wrong. Please try again." },
        ]),
      )
      .finally(() => setLoading(false));
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col w-full sm:max-w-2xl h-[92dvh] sm:h-[75vh] bg-white dark:bg-slate-900 sm:rounded-2xl rounded-t-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-start gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 shrink-0 mt-0.5">
            <Sparkles size={16} className="text-blue-500 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
              Q{questionIndex + 1} Explanation
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
              {question.question}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleReset}
              disabled={loading}
              title="Restart explanation"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-emerald-800/30 shrink-0">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            Correct answer:{" "}
            <span className="font-semibold">{correctAnswer}</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
          {loading && messages.length === 0 && (
            <div className="flex items-start gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 shrink-0 mt-0.5">
                <Bot size={14} className="text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4 animate-pulse" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-full animate-pulse" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-5/6 animate-pulse" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3 animate-pulse" />
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 mt-0.5 ${
                  msg.role === "ai"
                    ? "bg-blue-100 dark:bg-blue-900/40"
                    : "bg-slate-100 dark:bg-slate-700"
                }`}
              >
                {msg.role === "ai" ? (
                  <Bot size={14} className="text-blue-500 dark:text-blue-400" />
                ) : (
                  <User
                    size={14}
                    className="text-slate-500 dark:text-slate-400"
                  />
                )}
              </div>

              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm"
                    : "bg-blue-500 text-white rounded-tr-sm"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-3 last:mb-0 leading-7">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 mb-3 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 mb-3 space-y-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li>{children}</li>,
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mb-3">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold mb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold mb-2">{children}</h3>
                    ),
                    code: ({ children }) => (
                      <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-[0.9em]">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && messages.length > 0 && (
            <div className="flex items-start gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 shrink-0 mt-0.5">
                <Bot size={14} className="text-blue-500 dark:text-blue-400" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="px-3 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-grow up to ~4 rows
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask a follow-up question…"
              className="flex-1 bg-transparent resize-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:opacity-50 leading-relaxed py-0.5 max-h-25"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 mb-0.5"
            >
              <Send size={14} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center mt-1.5">
            Press Enter to send . Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
