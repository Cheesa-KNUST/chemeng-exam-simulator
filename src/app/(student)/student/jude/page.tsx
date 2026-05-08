"use client";

import { useEffect, useRef, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Send, History, Trash2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { useAuth } from "@/context/AuthContext";
import { listenToUserSettings } from "@/context/userService";

type Message = { role: "user" | "ai"; content: string };
type SavedChat = {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    role: "ai",
    content:
      "Hi! I'm JudeAI. Ask me anything about your exams, concepts, or revision.",
  },
];

export default function AIPage() {
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveChats, setSaveChats] = useState(false);

  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const currentChatIdRef = useRef<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserSettings(user.uid, (s) =>
      setSaveChats(s.saveChats ?? false),
    );
    return () => unsub();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    currentChatIdRef.current = currentChatId;
  }, [currentChatId]);

  useEffect(() => {
    if (!saveChats || !user || messages.length <= 1) return;

    const timeout = setTimeout(async () => {
      const existingId = currentChatIdRef.current;

      if (existingId) {
        await fetch(`/api/chats/${existingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });
      } else {
        const res = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, messages }),
        });
        const data = await res.json();
        if (data.id) {
          currentChatIdRef.current = data.id;
          setCurrentChatId(data.id);
        }
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [messages, saveChats, user]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/chats?uid=${user.uid}`);
      const data = await res.json();
      setSavedChats(data);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openHistory = () => {
    setShowHistory(true);
    fetchHistory();
  };

  const loadChat = (chat: SavedChat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat._id);
    setShowHistory(false);
  };

  const deleteChat = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/chats/${id}`, { method: "DELETE" });
      setSavedChats((prev) => prev.filter((c) => c._id !== id));
      if (currentChatId === id) {
        setMessages(INITIAL_MESSAGES);
        setCurrentChatId(null);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const startNewChat = () => {
    setMessages(INITIAL_MESSAGES);
    setCurrentChatId(null);
    setShowHistory(false);
  };

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <PageHeader
          title="Jude AI"
          subtitle="Ask questions, get explanations, and revise faster with JudeAI support"
        />
        <button
          onClick={openHistory}
          className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition mt-1"
        >
          <History size={16} />
          <span>History</span>
        </button>
      </div>

      <div className="mt-6 flex flex-col h-[calc(100vh-200px)] border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
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

        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
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

      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Saved Chats
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click a chat to continue the session
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={startNewChat}
                  className="text-xs text-blue-500 hover:underline"
                >
                  + New Chat
                </button>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-3 space-y-2">
              {loadingHistory ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  Loading...
                </p>
              ) : savedChats.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  No saved chats yet.{" "}
                  {!saveChats && (
                    <span className="block mt-1 text-xs">
                      Enable <strong>Save AI Chats</strong> in Settings to start
                      saving.
                    </span>
                  )}
                </p>
              ) : (
                savedChats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition cursor-pointer group ${
                      currentChatId === chat._id
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                    onClick={() => loadChat(chat)}
                  >
                    <div className="min-w-0 flex-1">
                      {renamingId === chat._id ? (
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={async () => {
                            if (
                              renameValue.trim() &&
                              renameValue !== chat.title
                            ) {
                              await fetch(`/api/chats/${chat._id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  title: renameValue.trim(),
                                }),
                              });
                              setSavedChats((prev) =>
                                prev.map((c) =>
                                  c._id === chat._id
                                    ? { ...c, title: renameValue.trim() }
                                    : c,
                                ),
                              );
                            }
                            setRenamingId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              (e.target as HTMLInputElement).blur();
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm font-medium text-slate-800 dark:text-slate-100 bg-transparent border-b border-blue-400 outline-none w-full"
                        />
                      ) : (
                        <p
                          className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            setRenamingId(chat._id);
                            setRenameValue(chat.title);
                          }}
                          title="Double-click to rename"
                        >
                          {chat.title}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(chat.createdAt).toLocaleDateString()} ·{" "}
                        {chat.messages.length} messages
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat._id);
                      }}
                      disabled={deletingId === chat._id}
                      className="text-slate-300 hover:text-red-400 dark:text-slate-600 dark:hover:text-red-400 transition shrink-0"
                    >
                      {deletingId === chat._id ? (
                        <span className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin block" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
