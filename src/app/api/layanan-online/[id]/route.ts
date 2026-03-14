import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { decrypt, maskNIK } from "@/lib/security";

/**
 * Helper function to safely decrypt NIK
 */
function safeDecryptNIK(encryptedNik: string | null): string {
  if (!encryptedNik) return "";
  try {
    if (encryptedNik.includes(":")) {
      return decrypt(encryptedNik);
    }
    return encryptedNik;
  } catch {
    return encryptedNik;
  }
}

// GET - Get specific submission by ID or nomorPengajuan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const submission = await db.pengajuanOnline.findFirst({
      where: {
        OR: [{ id }, { nomorPengajuan: id }],
      },
      include: {
        layanan: true,
        dokumen: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: "Pengajuan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Decrypt NIK for admin view
    const decryptedNik = safeDecryptNIK(submission.nik);

    return NextResponse.json({
      success: true,
      data: {
        ...submission,
        nik: decryptedNik, // Return decrypted NIK for admin
        nikMasked: maskNIK(decryptedNik), // Also provide masked version
      },
    });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data pengajuan" },
      { status: 500 }
    );
  }
}

// PUT - Update submission status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, catatan } = body;

    // Validate status
    const validStatuses = ["Baru", "Diverifikasi", "Diproses", "Selesai", "Ditolak"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status tidak valid" },
        { status: 400 }
      );
    }

    // Check if submission exists
    const existing = await db.pengajuanOnline.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Pengajuan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      status: status || existing.status,
      catatan: catatan !== undefined ? catatan : existing.catatan,
    };

    // Update timestamps based on status
    if (status === "Diproses" && existing.status === "Baru") {
      updateData.tanggalProses = new Date();
    }
    if (status === "Diproses" && existing.status === "Diverifikasi") {
      updateData.tanggalProses = updateData.tanggalProses || existing.tanggalProses;
    }
    if (status === "Selesai") {
      updateData.tanggalSelesai = new Date();
    }

    // Update submission
    const submission = await db.pengajuanOnline.update({
      where: { id },
      data: updateData,
      include: {
        layanan: true,
        dokumen: true,
      },
    });

    // Decrypt NIK for admin view
    const decryptedNik = safeDecryptNIK(submission.nik);

    return NextResponse.json({
      success: true,
      data: {
        ...submission,
        nik: decryptedNik,
        nikMasked: maskNIK(decryptedNik),
      },
      message: "Status pengajuan berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui pengajuan" },
      { status: 500 }
    );
  }
}

// DELETE - Delete submission (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if submission exists
    const existing = await db.pengajuanOnline.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Pengajuan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete submission (cascade will delete documents)
    await db.pengajuanOnline.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Pengajuan berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus pengajuan" },
      { status: 500 }
    );
  }
}
