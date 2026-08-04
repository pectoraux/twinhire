"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  ChevronRight,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopilotMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What should I prioritize first?",
  "What does this artifact contain?",
  "What's the biggest risk here?",
  "How should I frame the tradeoff?",
];

/**
 * AICopilot — a chat panel candidates can use during a simulation.
 *
 * The vision: "AI usage" and "AI leverage" are measured dimensions.
 * This co-pilot lets candidates query for guidance while working —
 * and the platform records the interaction for evaluation.
 *
 * The co-pilot helps candidates think, NOT do the work for them.
 */
export function AICopilot({
  sessionId,
  open,
  onToggle,
}: {
  sessionId: string | null;
  open: boolean;
  onToggle: () => void;
}) {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      role: "assistant",
      content:
        "I'm your AI co-pilot. Ask me about the task, artifacts, or constraints — I'll help you think through the problem. I won't write your answer for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const question = text ?? input;
    if (!question.trim() || !sessionId || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/twinhire/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, question }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "I couldn't process that." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble responding right now. Try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button (always visible) */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={onToggle}
            className="fixed right-6 top-24 z-30 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-transform hover:scale-105"
          >
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI Co-pilot</span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-full max-w-sm flex-col border-l border-border/60 bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold">AI Co-pilot</div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Sparkles className="h-2.5 w-2.5" /> Helps you think — won't do the work for you
                  </div>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 scroll-slim">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {msg.role === "assistant" && (
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Bot className="h-3.5 w-3.5" />
                    </span>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground",
                    )}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                  )}
                </motion.div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                  <div className="rounded-2xl bg-secondary px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}

              {/* Suggested questions (only on first interaction) */}
              {messages.length === 1 && !loading && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Try asking
                  </div>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="flex w-full items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/[0.04] hover:text-foreground"
                    >
                      <ChevronRight className="h-3 w-3 shrink-0 text-primary" />
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border/60 p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about the task…"
                  className="h-10 flex-1 rounded-xl border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  disabled={loading}
                />
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="h-10 w-10 rounded-xl"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Your AI usage is recorded and assessed — leverage is rewarded, not penalized.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
