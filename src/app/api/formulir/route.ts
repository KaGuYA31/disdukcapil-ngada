import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { FORMULIR_LIST } from "@/lib/formulir-data";

// GET - List all formulir, optionally filter by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    try {
      const formulir = await db.formulir.findMany({
        where: {
          isActive: true,
          ...(category ? { category } : {}),
        },
        orderBy: { order: "asc" },
      });

      // If database has forms, use them (they may have download counts etc.)
      if (formulir.length > 0) {
        return NextResponse.json({
          success: true,
          data: formulir,
          total: formulir.length,
          source: "database",
        });
      }
    } catch (dbError) {
      console.warn("Database query failed, using static fallback:", dbError);
    }

    // Fallback: use static data when database is empty or unreachable
    const filtered = category
      ? FORMULIR_LIST.filter(f => f.category === category)
      : FORMULIR_LIST;

    return NextResponse.json({
      success: true,
      data: filtered.map(f => ({
        id: `static-${f.code}`,
        code: f.code,
        name: f.name,
        description: f.description,
        category: f.category,
        fileName: f.fileName,
        fileSize: f.fileSize,
        downloadCount: 0,
        isActive: true,
        order: f.order,
      })),
      total: filtered.length,
      source: "static",
    });
  } catch (error) {
    console.error("Error fetching formulir:", error);

    // Last resort fallback
    return NextResponse.json({
      success: true,
      data: FORMULIR_LIST.map(f => ({
        id: `static-${f.code}`,
        code: f.code,
        name: f.name,
        description: f.description,
        category: f.category,
        fileName: f.fileName,
        fileSize: f.fileSize,
        downloadCount: 0,
        isActive: true,
        order: f.order,
      })),
      total: FORMULIR_LIST.length,
      source: "static",
    });
  }
}

// POST - Create new formulir
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { code, name, description, category, fileName, fileSize, isActive, order } = body;

    if (!code || !name || !category || !fileName) {
      return NextResponse.json(
        {
          success: false,
          error: "Field code, name, category, dan fileName wajib diisi",
        },
        { status: 400 }
      );
    }

    const formulir = await db.formulir.create({
      data: {
        code,
        name,
        description: description || null,
        category,
        fileName,
        fileSize: fileSize || null,
        isActive: isActive ?? true,
        order: order ?? 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Formulir berhasil dibuat",
        data: formulir,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating formulir:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: "Kode formulir sudah ada",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Gagal membuat formulir",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT - Update formulir by id
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Field id wajib diisi",
        },
        { status: 400 }
      );
    }

    const existing = await db.formulir.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Formulir tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const formulir = await db.formulir.update({
      where: { id },
      data: {
        ...(updateData.code !== undefined && { code: updateData.code }),
        ...(updateData.name !== undefined && { name: updateData.name }),
        ...(updateData.description !== undefined && { description: updateData.description }),
        ...(updateData.category !== undefined && { category: updateData.category }),
        ...(updateData.fileName !== undefined && { fileName: updateData.fileName }),
        ...(updateData.fileSize !== undefined && { fileSize: updateData.fileSize }),
        ...(updateData.isActive !== undefined && { isActive: updateData.isActive }),
        ...(updateData.order !== undefined && { order: updateData.order }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Formulir berhasil diperbarui",
      data: formulir,
    });
  } catch (error) {
    console.error("Error updating formulir:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: "Kode formulir sudah digunakan",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Gagal memperbarui formulir",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete formulir by id
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => null);
      const bodyId = body?.id;

      if (!bodyId) {
        return NextResponse.json(
          {
            success: false,
            error: "Parameter id wajib diisi",
          },
          { status: 400 }
        );
      }

      await db.formulir.delete({
        where: { id: bodyId },
      });

      return NextResponse.json({
        success: true,
        message: "Formulir berhasil dihapus",
      });
    }

    const existing = await db.formulir.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Formulir tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await db.formulir.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Formulir berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting formulir:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal menghapus formulir",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
