"use client";

import { useEffect, useRef, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { Sparkles, Send } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hi! I'm JudeAI. Ask me anything about your exams, concepts, or revision.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Jude AI"
        subtitle="Ask questions, get explanations, and revise faster with JudeAI support"
        action={<Sparkles className="text-blue-500" />}
      />

      <div className="mt-6 flex flex-col h-[calc(100vh-200px)] border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm"
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

                    pre: ({ children }) => (
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs mb-3">
                        {children}
                      </pre>
                    ),

                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic my-3">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Jude is thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-linear-to-t from-white dark:from-slate-900 to-transparent">
          <div className="flex gap-3 items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-md">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something like: Explain Bernoulli's equation..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="border-0 focus:ring-0 bg-transparent"
            />

            <Button
              onClick={handleSend}
              disabled={loading}
              className="rounded-xl px-4"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
