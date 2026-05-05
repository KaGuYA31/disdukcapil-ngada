import { NextRequest } from "next/server";
import { secureResponse, checkRateLimit } from "@/lib/security";

// ============================================
// IN-MEMORY POLL DATA STORE
// ============================================

interface PollOption {
  text: string;
  votes: number;
}

interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: string;
}

// Default poll for Disdukcapil Ngada
const defaultPoll: PollData = {
  id: "poll-kepuasan-2024",
  question: "Bagaimana pengalaman Anda menggunakan layanan Disdukcapil Ngada?",
  options: [
    { text: "Sangat Puas", votes: 47 },
    { text: "Puas", votes: 63 },
    { text: "Cukup", votes: 22 },
    { text: "Kurang Puas", votes: 8 },
    { text: "Belum Pernah", votes: 14 },
  ],
  createdAt: new Date().toISOString(),
};

// In-memory store (persists while server is running)
let pollData: PollData = {
  ...defaultPoll,
  options: defaultPoll.options.map((o) => ({ ...o })),
};

// ============================================
// HELPERS
// ============================================

function getTotalVotes(): number {
  return pollData.options.reduce((sum, opt) => sum + opt.votes, 0);
}

function getPollWithPercentages() {
  const total = getTotalVotes();
  return {
    id: pollData.id,
    question: pollData.question,
    options: pollData.options.map((opt) => ({
      text: opt.text,
      votes: opt.votes,
      percentage: total > 0 ? Math.round((opt.votes / total) * 1000) / 10 : 0,
    })),
    totalVotes: total,
  };
}

// ============================================
// GET - Return current active poll with results
// ============================================

export async function GET() {
  try {
    const result = getPollWithPercentages();
    return secureResponse({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return secureResponse(
      { success: false, error: "Gagal mengambil data survei" },
      500
    );
  }
}

// ============================================
// POST - Submit a vote
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 votes per minute per IP
    const rateCheck = checkRateLimit(request, {
      windowMs: 60 * 1000,
      maxRequests: 5,
    });

    if (!rateCheck.allowed) {
      return secureResponse(
        {
          success: false,
          error: `Terlalu banyak permintaan. Silakan coba lagi dalam ${rateCheck.retryAfter} detik.`,
          retryAfter: rateCheck.retryAfter,
        },
        429
      );
    }

    const body = await request.json();
    const { pollId, optionIndex } = body;

    // Validate pollId
    if (!pollId || typeof pollId !== "string") {
      return secureResponse(
        { success: false, error: "ID survei tidak valid" },
        400
      );
    }

    // Validate optionIndex
    if (
      typeof optionIndex !== "number" ||
      optionIndex < 0 ||
      optionIndex >= pollData.options.length
    ) {
      return secureResponse(
        { success: false, error: "Pilihan tidak valid" },
        400
      );
    }

    // Validate pollId matches current poll
    if (pollId !== pollData.id) {
      return secureResponse(
        { success: false, error: "Survei tidak ditemukan atau sudah berakhir" },
        404
      );
    }

    // Record the vote
    pollData.options[optionIndex].votes += 1;

    const result = getPollWithPercentages();
    return secureResponse(
      {
        success: true,
        message: "Terima kasih! Suara Anda telah tercatat.",
        data: result,
      },
      200
    );
  } catch (error) {
    console.error("Error submitting vote:", error);
    return secureResponse(
      { success: false, error: "Gagal mengirim suara. Silakan coba lagi." },
      500
    );
  }
}
