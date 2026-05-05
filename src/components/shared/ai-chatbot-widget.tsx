"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, MessageCircle, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ============================================
// Types
// ============================================

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "Bagaimana cara buat KTP?",
  "Persyaratan KK?",
  "Jam pelayanan?",
  "Lokasi kantor?",
  "Biaya layanan?",
];

// ============================================
// Animation Variants
// ============================================

const chatWindowVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    originX: 1,
    originY: 1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 28,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    },
  },
};

const messageVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
      mass: 0.6,
    },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.1 + i * 0.06,
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  }),
};

const fabVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 20,
      delay: 1,
    },
  },
};

// ============================================
// Typing Indicator Component
// ============================================

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-green-500/70"
          animate={{
            y: [0, -6, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut" as const,
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// Markdown-like Renderer (simple)
// ============================================

function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Bold text
        const rendered = line.replace(
          /\*\*(.+?)\*\*/g,
          '<strong class="font-semibold">$1</strong>'
        );
        // Headers
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p
              key={i}
              className="font-semibold text-sm"
              dangerouslySetInnerHTML={{ __html: rendered }}
            />
          );
        }
        // Empty lines
        if (line.trim() === "") {
          return <div key={i} className="h-1.5" />;
        }
        // List items
        if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
          const content = line.trim().replace(/^[-•]\s*/, "");
          const safeContent = content.replace(
            /\*\*(.+?)\*\*/g,
            '<strong class="font-semibold">$1</strong>'
          );
          return (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-green-500 shrink-0 mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: safeContent }} />
            </div>
          );
        }
        // Regular text
        return (
          <p
            key={i}
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        );
      })}
    </div>
  );
}

// ============================================
// Main Widget Component
// ============================================

export function AICHatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [sessionInit, setSessionInit] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize session
  useEffect(() => {
    if (!sessionInit) {
      sessionIdRef.current = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setSessionInit(true);
    }
  }, [sessionInit]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (messageText: string) => {
      const trimmed = messageText.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);
      setHasInteracted(true);

      try {
        const res = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            sessionId: sessionIdRef.current,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Terjadi kesalahan");
        }

        const botMsg: ChatMessage = {
          id: `msg-${Date.now()}-bot`,
          role: "bot",
          content: data.reply || "Maaf, saya tidak dapat memproses permintaan Anda.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch {
        const errorMsg: ChatMessage = {
          id: `msg-${Date.now()}-error`,
          role: "bot",
          content:
            "Maaf, terjadi kesalahan koneksi. Silakan coba lagi dalam beberapa saat. 🙏",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  const handleQuickQuestion = useCallback(
    (question: string) => {
      sendMessage(question);
    },
    [sendMessage]
  );

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="fixed z-50" style={{ bottom: "5.5rem", right: "1.5rem" }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={containerRef}
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-0 right-0 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] h-[520px] rounded-2xl overflow-hidden shadow-2xl border border-green-200/40 dark:border-green-700/30 flex flex-col"
            style={{
              background:
                "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Dark mode overlay for glass */}
            <div className="absolute inset-0 rounded-2xl dark:bg-gray-900/90 -z-10" />

            {/* ===== Header ===== */}
            <div className="relative shrink-0">
              {/* Green gradient top bar */}
              <div className="h-1 bg-gradient-to-r from-green-600 via-teal-500 to-emerald-500" />

              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-700 to-teal-700">
                <div className="flex items-center gap-3">
                  {/* Bot avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    {/* Online indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-green-300 ring-2 ring-green-700" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white leading-tight">
                      Asisten AI Disdukcapil
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
                      <span className="text-[11px] text-green-100">
                        Online • Siap membantu
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleChat}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  aria-label="Tutup chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ===== Messages Area ===== */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {/* Welcome message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center py-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mb-3 shadow-lg shadow-green-500/20">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    Halo! 👋
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[280px] leading-relaxed">
                    Saya asisten AI Disdukcapil Ngada. Tanyakan tentang layanan
                    kependudukan dan saya akan membantu Anda!
                  </p>

                  {/* Quick Question Chips */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4 px-2">
                    {QUICK_QUESTIONS.map((q, i) => (
                      <motion.button
                        key={q}
                        custom={i}
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={() => handleQuickQuestion(q)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200/60 dark:border-green-700/40 hover:bg-green-100 dark:hover:bg-green-800/40 hover:border-green-300/80 dark:hover:border-green-600/50 transition-all cursor-pointer whitespace-nowrap"
                      >
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message list */}
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                    className={`flex gap-2 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "bot" && (
                      <div className="shrink-0 mt-1">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-green-600 to-green-700 text-white rounded-br-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-md border border-gray-200/60 dark:border-gray-700/50"
                      }`}
                    >
                      {msg.role === "bot" ? (
                        <SimpleMarkdown text={msg.content} />
                      ) : (
                        <p className="text-sm leading-relaxed">
                          {msg.content}
                        </p>
                      )}
                      <p
                        className={`text-[10px] mt-1.5 ${
                          msg.role === "user"
                            ? "text-green-200"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {msg.role === "user" && (
                      <div className="shrink-0 mt-1">
                        <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex gap-2 items-start"
                >
                  <div className="shrink-0 mt-1">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md border border-gray-200/60 dark:border-gray-700/50">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ===== Quick Questions (after first interaction) ===== */}
            {hasInteracted && messages.length > 0 && !isLoading && (
              <div className="shrink-0 px-4 pb-1">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {QUICK_QUESTIONS.slice(0, 4).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickQuestion(q)}
                      className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200/50 dark:border-green-800/30 hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ===== Input Area ===== */}
            <div className="shrink-0 border-t border-gray-200/60 dark:border-gray-700/50 p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pertanyaan Anda..."
                  disabled={isLoading}
                  className="flex-1 h-10 text-sm rounded-xl border-green-200/60 dark:border-green-700/40 bg-white/60 dark:bg-gray-800/60 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-green-400/50 focus-visible:border-green-400/60"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-md shadow-green-500/20 disabled:opacity-40 shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
                Asisten AI • Dapat membuat kesalahan • Hubungi kantor untuk info resmi
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Floating Action Button ===== */}
      <motion.div
        variants={fabVariants}
        initial="initial"
        animate="animate"
      >
        <motion.button
          onClick={toggleChat}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
            isOpen
              ? "bg-gray-600 hover:bg-gray-700 shadow-gray-500/25"
              : "bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-green-500/30"
          }`}
          aria-label={isOpen ? "Tutup chatbot" : "Buka chatbot AI"}
        >
          {/* Ping animation when closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-20" />
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MessageCircle className="w-6 h-6 text-white fill-white/20" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification badge when closed and no interaction */}
          {!isOpen && !hasInteracted && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 500 }}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-amber-900 ring-2 ring-white dark:ring-gray-900 shadow-sm"
            >
              AI
            </motion.span>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
