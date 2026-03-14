import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all layanan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const layanan = await db.layanan.findUnique({
        where: { slug },
      });

      if (!layanan) {
        return NextResponse.json(
          { success: false, error: "Layanan tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: layanan });
    }

    const layanan = await db.layanan.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ success: true, data: layanan });
  } catch (error) {
    console.error("Error fetching layanan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data layanan" },
      { status: 500 }
    );
  }
}

// POST - Create new layanan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      icon,
      requirements,
      procedures,
      forms,
      faq,
      processingTime,
      fee,
      isActive,
      isOnline,
      order,
    } = body;

    if (!name || !slug || !description) {
      return NextResponse.json(
        { success: false, error: "Nama, slug, dan deskripsi harus diisi" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await db.layanan.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Slug sudah digunakan" },
        { status: 400 }
      );
    }

    const layanan = await db.layanan.create({
      data: {
        name,
        slug,
        description,
        icon: icon || null,
        requirements: requirements || "[]",
        procedures: procedures || "[]",
        forms: forms || null,
        faq: faq || null,
        processingTime: processingTime || "Selesai di Tempat",
        fee: fee || "GRATIS",
        isActive: isActive ?? true,
        isOnline: isOnline ?? false,
        order: order || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: layanan,
      message: "Layanan berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error creating layanan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan layanan" },
      { status: 500 }
    );
  }
}

// PUT - Update layanan
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      slug,
      description,
      icon,
      requirements,
      procedures,
      forms,
      faq,
      processingTime,
      fee,
      isActive,
      isOnline,
      order,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID tidak diberikan" },
        { status: 400 }
      );
    }

    const existingLayanan = await db.layanan.findUnique({
      where: { id },
    });

    if (!existingLayanan) {
      return NextResponse.json(
        { success: false, error: "Layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if new slug conflicts with another layanan
    if (slug && slug !== existingLayanan.slug) {
      const slugExists = await db.layanan.findUnique({
        where: { slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "Slug sudah digunakan" },
          { status: 400 }
        );
      }
    }

    const layanan = await db.layanan.update({
      where: { id },
      data: {
        name: name || existingLayanan.name,
        slug: slug || existingLayanan.slug,
        description: description || existingLayanan.description,
        icon: icon !== undefined ? icon : existingLayanan.icon,
        requirements: requirements || existingLayanan.requirements,
        procedures: procedures || existingLayanan.procedures,
        forms: forms !== undefined ? forms : existingLayanan.forms,
        faq: faq !== undefined ? faq : existingLayanan.faq,
        processingTime: processingTime || existingLayanan.processingTime,
        fee: fee || existingLayanan.fee,
        isActive: isActive !== undefined ? isActive : existingLayanan.isActive,
        isOnline: isOnline !== undefined ? isOnline : existingLayanan.isOnline,
        order: order !== undefined ? order : existingLayanan.order,
      },
    });

    return NextResponse.json({
      success: true,
      data: layanan,
      message: "Layanan berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating layanan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui layanan" },
      { status: 500 }
    );
  }
}

// DELETE - Delete layanan
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID tidak diberikan" },
        { status: 400 }
      );
    }

    const existingLayanan = await db.layanan.findUnique({
      where: { id },
    });

    if (!existingLayanan) {
      return NextResponse.json(
        { success: false, error: "Layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.layanan.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Layanan berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting layanan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus layanan" },
      { status: 500 }
    );
  }
}
