import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, sanitizeString, secureResponse } from "@/lib/security";
import ZAI from "z-ai-web-dev-sdk";

// In-memory ZAI instance (reuse across requests)
let zaiInstance: InstanceType<typeof ZAI> | null = null;

async function getZAI(): Promise<InstanceType<typeof ZAI>> {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Conversation store (sessionId → message history)
const conversationStore = new Map<string, Array<{ role: "system" | "user" | "assistant"; content: string }>>();

// Max messages per conversation (keep system + last N exchanges)
const MAX_MESSAGES = 20;

// Cleanup old conversations periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    if (conversationStore.size > 500) {
      const oldestKey = conversationStore.keys().next().value;
      if (oldestKey) conversationStore.delete(oldestKey);
    }
  }, 10 * 60 * 1000);
}

const SYSTEM_PROMPT = `Kamu adalah asisten AI yang membantu untuk Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil) Kabupaten Ngada, Provinsi Nusa Tenggara Timur (NTT).

TUGAS UTAMA:
- Menjawab pertanyaan tentang layanan kependudukan dan pencatatan sipil
- Memberikan informasi tentang persyaratan, prosedur, dan jadwal pelayanan
- Membantu warga memahami proses administrasi kependudukan

LAYANAN YANG DITANGANI:
1. KTP-el (Kartu Tanda Penduduk Elektronik) — pembuatan baru, perpanjangan, penggantian
2. KK (Kartu Keluarga) — pembuatan baru, perubahan, pemecahan, penggabungan
3. Akta Kelahiran — pembuatan, duplikat, koreksi
4. Akta Kematian — pelaporan dan pembuatan
5. Akta Perkawinan — pencatatan
6. Akta Perceraian — pencatatan
7. Pindah Domisili — dari/ke luar daerah
8. Legalisir Dokumen — pengesahan fotokopi
9. Surat Pindah — surat keterangan pindah
10. SKCK — surat keterangan catatan kepolisian (terkait identitas)

INFORMASI PENTING:
- Kantor: Jl. El Tari No. 1, Bajawa, Kabupaten Ngada, NTT
- Jam Pelayanan: Senin - Jumat, 08.00 - 16.00 WITA (istirahat 12.00 - 13.00)
- Sabtu, Minggu, dan Hari Libur Nasional: TUTUP
- Semua layanan kependudukan GRATIS (sesuai UU No. 24 Tahun 2013)
- Layanan online tersedia untuk KTP-el dan KK

ATURAN:
- Jawab dalam Bahasa Indonesia yang sopan, jelas, dan mudah dipahami
- Berikan informasi yang ringkas dan terstruktur (gunakan poin jika perlu)
- Jika ditanya tentang topik di luar layanan Disdukcapil, jelaskan dengan sopan bahwa kamu hanya bisa membantu terkait layanan kependudukan
- Jangan memberikan informasi pribadi warga
- Selalu sarankan untuk datang ke kantor Disdukcapil jika memerlukan informasi detail atau proses yang kompleks
- Jika tidak yakin tentang informasi, sarankan untuk menghubungi kantor Disdukcapil langsung di nomor (0383) 21789`;

// Quick response fallback knowledge base for common questions
const QUICK_RESPONSES: Record<string, string> = {
  ktp: `**Pembuatan KTP-el di Disdukcapil Ngada:**

📄 **Persyaratan:**
- Fotokopi Kartu Keluarga (KK)
- Surat Pengantar RT/RW
- Pas Foto 3x4 (2 lembar, latar merah)
- KTP lama (untuk perpanjangan/penggantian)
- Akta Kelahiran / Ijazah (untuk pembuatan pertama kali)

📍 **Tempat:** Kantor Disdukcapil Ngada, Jl. El Tari No. 1, Bajawa
🕒 **Jam:** Senin-Jumat, 08.00-16.00 WITA
💰 **Biaya:** GRATIS

💡 **Tips:** Bawa berkas asli dan fotokopi. Proses perekaman biometrik memerlukan kehadiran langsung.`,

  kk: `**Pembuatan/Pembaruan Kartu Keluarga (KK):**

📄 **Persyaratan:**
- Fotokopi KTP Kepala Keluarga
- Fotokopi Akta Nikah/Cerai (jika ada perubahan)
- Fotokopi Akta Kelahiran anggota keluarga
- Surat Pengantar RT/RW
- KK lama (untuk perubahan/pemecahan)

📍 **Tempat:** Kantor Disdukcapil Ngada, Jl. El Tari No. 1, Bajawa
🕒 **Jam:** Senin-Jumat, 08.00-16.00 WITA
💰 **Biaya:** GRATIS

💡 Jenis perubahan KK: penambahan anggota, pengurangan anggota, perubahan data, pemecahan, dan penggabungan.`,

  akta: `**Pembuatan Akta Kelahiran:**

📄 **Persyaratan:**
- Surat Keterangan Kelahiran dari RS/Bidan/Rumah Bersalin
- Fotokopi KTP kedua orang tua
- Fotokopi KK
- Fotokopi Buku Nikah/Akta Perkawinan
- Surat Pengantar RT/RW
- 2 saksi dengan fotokopi KTP

⏰ **Batas Waktu:** Maksimal 60 hari sejak kelahiran
📍 **Tempat:** Disdukcapil Ngada, Jl. El Tari No. 1, Bajawa
🕒 **Jam:** Senin-Jumat, 08.00-16.00 WITA
💰 **Biaya:** GRATIS

💡 **Catatan:** Untuk kelahiran > 60 hari diperlukan proses penetapan pengadilan.`,

  jam: `**Jam Pelayanan Disdukcapil Ngada:**

🗓️ **Senin - Jumat:** 08.00 - 16.00 WITA
⏸️ **Istirahat:** 12.00 - 13.00 WITA
🚫 **Sabtu, Minggu & Hari Libur Nasional:** TUTUP

📍 **Alamat:** Jl. El Tari No. 1, Bajawa, Kabupaten Ngada, NTT
📞 **Telepon:** (0383) 21789`,

  lokasi: `**Lokasi Kantor Disdukcapil Ngada:**

📍 **Alamat:** Jl. El Tari No. 1, Bajawa, Kabupaten Ngada, Provinsi NTT

📞 **Telepon:** (0383) 21789
🕒 **Jam Pelayanan:** Senin-Jumat, 08.00-16.00 WITA

💡 Anda bisa menggunakan Google Maps dan mencari "Disdukcapil Kabupaten Ngada" untuk petunjuk arah.`,

  biaya: `**Biaya Layanan Disdukcapil Ngada:**

✅ **SEMUA LAYANAN GRATIS!**

Sesuai dengan **UU No. 24 Tahun 2013** tentang Administrasi Kependudukan, seluruh layanan administrasi kependudukan tidak dipungut biaya (GRATIS), meliputi:
- Pembuatan KTP-el
- Pembuatan/Pembaruan KK
- Pembuatan Akta Kelahiran, Kematian, Perkawinan, Perceraian
- Pindah Domisili
- Legalisir Dokumen
- Dan layanan kependudukan lainnya

⚠️ Jika diminta biaya oleh oknum, silakan laporkan melalui pengaduan.`,
};

function getQuickResponse(message: string): string | null {
  const lower = message.toLowerCase().trim();

  if (lower.includes("ktp") || lower.includes("kartu tanda penduduk")) return QUICK_RESPONSES.ktp;
  if (lower.includes("kk") || lower.includes("kartu keluarga")) return QUICK_RESPONSES.kk;
  if (lower.includes("akta") || lower.includes("kelahiran")) return QUICK_RESPONSES.akta;
  if (lower.includes("jam") || lower.includes("pelayanan") || lower.includes("buka") || lower.includes("tutup")) return QUICK_RESPONSES.jam;
  if (lower.includes("lokasi") || lower.includes("alamat") || lower.includes("kantor") || lower.includes("dimana") || lower.includes("mana")) return QUICK_RESPONSES.lokasi;
  if (lower.includes("biaya") || lower.includes("gratis") || lower.includes("tarif") || lower.includes("bayar")) return QUICK_RESPONSES.biaya;

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 20 requests per minute per IP
    const rateCheck = checkRateLimit(request, {
      windowMs: 60 * 1000,
      maxRequests: 20,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.",
          retryAfter: rateCheck.retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfter) },
        }
      );
    }

    const body = await request.json();
    const { message, sessionId } = body;

    // Validate message
    if (!message || typeof message !== "string") {
      return secureResponse({ error: "Pesan diperlukan" }, 400);
    }

    const sanitizedMessage = sanitizeString(message);
    if (sanitizedMessage.length === 0) {
      return secureResponse({ error: "Pesan tidak valid" }, 400);
    }

    if (sanitizedMessage.length > 500) {
      return secureResponse({ error: "Pesan terlalu panjang (maks 500 karakter)" }, 400);
    }

    const sid = (typeof sessionId === "string" && sessionId.length > 0) ? sessionId : `default-${Date.now()}`;

    // Try quick response first for common questions
    const quickReply = getQuickResponse(sanitizedMessage);
    if (quickReply) {
      const history = conversationStore.get(sid) || [
        { role: "system" as const, content: SYSTEM_PROMPT },
      ];
      history.push({ role: "user", content: sanitizedMessage });
      history.push({ role: "assistant", content: quickReply });
      if (history.length > MAX_MESSAGES) {
        conversationStore.set(sid, [history[0], ...history.slice(-(MAX_MESSAGES - 1))]);
      } else {
        conversationStore.set(sid, history);
      }
      return secureResponse({ reply: quickReply, from: "quick" });
    }

    // Get or create conversation history
    let history = conversationStore.get(sid) || [
      { role: "system" as const, content: SYSTEM_PROMPT },
    ];

    // Add user message
    history.push({ role: "user", content: sanitizedMessage });

    // Trim old messages if exceeding limit
    if (history.length > MAX_MESSAGES) {
      history = [history[0], ...history.slice(-(MAX_MESSAGES - 1))];
    }

    try {
      // Use AI for response
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({
        messages: history,
        thinking: { type: "disabled" },
      });

      const aiReply = completion.choices?.[0]?.message?.content;

      if (!aiReply || aiReply.trim().length === 0) {
        throw new Error("Empty AI response");
      }

      // Store AI response in history
      history.push({ role: "assistant", content: aiReply });
      conversationStore.set(sid, history);

      return secureResponse({ reply: aiReply, from: "ai" });
    } catch (aiError) {
      console.error("[Chatbot] AI error:", aiError);

      // Fallback response when AI fails
      const fallbackReply = `Maaf, saya sedang mengalami gangguan teknis. 🙏

Untuk informasi lebih lanjut, silakan:
- Hubungi kami di **(0383) 21789**
- Datang langsung ke **Kantor Disdukcapil Ngada**, Jl. El Tari No. 1, Bajawa
- Jam pelayanan: **Senin-Jumat, 08.00-16.00 WITA**

Terima kasih atas pengertiannya!`;

      return secureResponse({ reply: fallbackReply, from: "fallback" });
    }
  } catch (error) {
    console.error("[Chatbot] Error:", error);
    return secureResponse(
      { error: "Terjadi kesalahan internal. Silakan coba lagi." },
      500
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return secureResponse({ error: "Method not allowed. Use POST." }, 405);
}
