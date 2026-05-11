"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

interface PollOption {
  text: string;
  votes: number;
  percentage: number;
}

interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

// ============================================
// LOCAL STORAGE KEYS
// ============================================

const STORAGE_KEY_VOTE = "disdukcapil-poll-vote";
const STORAGE_KEY_POLL_ID = "disdukcapil-poll-id";

// ============================================
// GREEN COLOR PALETTE for poll bars
// ============================================

const barColors = [
  "from-emerald-500 to-emerald-400",
  "from-green-500 to-green-400",
  "from-teal-500 to-teal-400",
  "from-green-600 to-green-500",
  "from-emerald-600 to-emerald-500",
];

const barBgColors = [
  "bg-emerald-100 dark:bg-emerald-900/30",
  "bg-green-100 dark:bg-green-900/30",
  "bg-teal-100 dark:bg-teal-900/30",
  "bg-green-100 dark:bg-green-900/30",
  "bg-emerald-100 dark:bg-emerald-900/30",
];

const barBorderColors = [
  "border-emerald-200 dark:border-emerald-700/50",
  "border-green-200 dark:border-green-700/50",
  "border-teal-200 dark:border-teal-700/50",
  "border-green-200 dark:border-green-700/50",
  "border-emerald-200 dark:border-emerald-700/50",
];

// ============================================
// CONFETTI PARTICLES
// ============================================

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
}

const confettiColors = [
  "#10b981", "#059669", "#14b8a6", "#22c55e",
  "#34d399", "#6ee7b7", "#a7f3d0", "#fbbf24",
  "#f59e0b", "#ecfdf5",
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 40,
    y: 50,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    size: 4 + Math.random() * 6,
    angle: Math.random() * Math.PI * 2,
    speed: 1.5 + Math.random() * 3,
    rotation: 0,
    rotationSpeed: (Math.random() - 0.5) * 360,
  }));
}

// ============================================
// COMPONENT
// ============================================

export function QuickPollWidget() {
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedIndex, setVotedIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showParticles, setShowParticles] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check localStorage for previous vote
  useEffect(() => {
    try {
      const storedVote = localStorage.getItem(STORAGE_KEY_VOTE);
      const storedPollId = localStorage.getItem(STORAGE_KEY_POLL_ID);
      if (storedVote !== null && storedPollId !== null) {
        setHasVoted(true);
        setVotedIndex(parseInt(storedVote, 10));
      }
    } catch {
      // localStorage not available
    }
  }, []);

  // Fetch poll data
  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch("/api/poll");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json.success && json.data) {
        setPollData(json.data);
        // If user already voted on this poll, show results
        const storedPollId = localStorage.getItem(STORAGE_KEY_POLL_ID);
        if (storedPollId === json.data.id) {
          setShowResults(true);
        }
      }
    } catch {
      setError("Gagal memuat survei");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  // Submit vote
  const handleVote = async (optionIndex: number) => {
    if (!pollData || submitting || hasVoted) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pollId: pollData.id,
          optionIndex,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit vote");

      const json = await res.json();
      if (json.success && json.data) {
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY_VOTE, optionIndex.toString());
        localStorage.setItem(STORAGE_KEY_POLL_ID, pollData.id);

        setPollData(json.data);
        setHasVoted(true);
        setVotedIndex(optionIndex);
        setShowResults(true);

        // Trigger confetti
        const newParticles = generateParticles(30);
        setParticles(newParticles);
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 2000);
      }
    } catch {
      setError("Gagal mengirim suara. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Dismiss handler
  const handleDismiss = () => {
    setDismissed(true);
    // Don't clear localStorage so user still sees results next time
  };

  if (dismissed || loading) return null;

  if (!pollData) return null;

  return (
    <div className="fixed bottom-32 left-4 z-50 sm:bottom-8 sm:left-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.8,
          }}
          className="relative"
        >
          {/* Confetti particles */}
          <AnimatePresence>
            {showParticles && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      scale: 1,
                      opacity: 1,
                      rotate: 0,
                    }}
                    animate={{
                      y: [0, -(80 + Math.random() * 120)],
                      x: [0, (Math.random() - 0.5) * 100],
                      opacity: [1, 1, 0],
                      rotate: [0, p.rotationSpeed],
                      scale: [1, 0.5],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.5 + Math.random() * 0.5,
                      ease: "easeOut",
                    }}
                    className="absolute rounded-sm"
                    style={{
                      width: p.size,
                      height: p.size * 0.6,
                      backgroundColor: p.color,
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Main Card */}
            <div className="relative w-[320px] sm:w-[360px] rounded-2xl shadow-xl shadow-green-600/10 border border-green-200/60 dark:border-green-700/40 overflow-hidden">
              {/* Glass-morphism background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/70 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-emerald-950/60 backdrop-blur-xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent dark:from-emerald-400/5" />

              {/* Green gradient accent bar at top */}
              <div className="relative h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />

              <div className="relative p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <ThumbsUp className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        Survei Kepuasan
                      </h3>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        Layanan Disdukcapil Ngada
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                    aria-label="Tutup survei"
                  >
                    <X className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                  </button>
                </div>

                {/* Question */}
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-4 font-medium">
                  {pollData.question}
                </p>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-red-500 dark:text-red-400 mb-3 bg-red-50 dark:bg-red-900/20 px-2.5 py-1.5 rounded-lg"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Vote Options or Results */}
                {!showResults ? (
                  /* VOTE BUTTONS */
                  <div className="space-y-2">
                    {pollData.options.map((option, index) => (
                      <motion.div
                        key={option.text}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.05 * index,
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                      >
                        <Button
                          variant="outline"
                          disabled={submitting}
                          onClick={() => handleVote(index)}
                          className={cn(
                            "w-full justify-start text-left h-auto py-2.5 px-3",
                            "text-xs font-medium transition-all duration-200",
                            "border-gray-200 dark:border-gray-600",
                            "hover:border-emerald-300 hover:bg-emerald-50 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/20",
                            "hover:text-emerald-700 dark:hover:text-emerald-300",
                            "hover:shadow-sm hover:shadow-emerald-500/10",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                          )}
                        >
                          {submitting ? (
                            <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin text-emerald-500" />
                          ) : (
                            <span className="flex items-center gap-2 w-full">
                              <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-400 shrink-0">
                                {index + 1}
                              </span>
                              <span className="truncate">{option.text}</span>
                            </span>
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* RESULTS VIEW */
                  <div className="space-y-2.5">
                    {pollData.options.map((option, index) => {
                      const isVoted = votedIndex === index;
                      return (
                        <motion.div
                          key={option.text}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.08 * index,
                            duration: 0.4,
                            ease: "easeOut",
                          }}
                          className={cn(
                            "relative rounded-xl px-3 py-2 border overflow-hidden",
                            barBgColors[index],
                            barBorderColors[index],
                            isVoted && "ring-2 ring-emerald-400/40 dark:ring-emerald-500/30"
                          )}
                        >
                          {/* Animated progress bar */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${option.percentage}%`,
                            }}
                            transition={{
                              delay: 0.15 + 0.08 * index,
                              duration: 0.8,
                              ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                            className={cn(
                              "absolute inset-y-0 left-0 rounded-xl",
                              "bg-gradient-to-r opacity-15 dark:opacity-20",
                              barColors[index]
                            )}
                          />

                          <div className="relative flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {isVoted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15,
                                    delay: 0.2,
                                  }}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                </motion.div>
                              )}
                              <span
                                className={cn(
                                  "text-[11px] font-medium truncate",
                                  isVoted
                                    ? "text-emerald-800 dark:text-emerald-300"
                                    : "text-gray-700 dark:text-gray-300"
                                )}
                              >
                                {option.text}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={cn(
                                  "text-[11px] font-bold tabular-nums",
                                  isVoted
                                    ? "text-emerald-700 dark:text-emerald-300"
                                    : "text-gray-600 dark:text-gray-400"
                                )}
                              >
                                {option.percentage}%
                              </span>
                              <span className="text-[9px] text-gray-400 dark:text-gray-500 tabular-nums">
                                ({option.votes})
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Footer: Total votes */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      Total respons:
                    </p>
                    <div className="flex items-center gap-1">
                      <motion.span
                        key={pollData.totalVotes}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums"
                      >
                        {pollData.totalVotes.toLocaleString("id-ID")}
                      </motion.span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">suara</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connector arrow */}
            <div className="absolute -bottom-2 left-8 w-4 h-4 rotate-45 bg-white dark:bg-gray-900 border-r border-b border-green-200/60 dark:border-green-700/40" />
          </motion.div>
      </AnimatePresence>
    </div>
  );
}
