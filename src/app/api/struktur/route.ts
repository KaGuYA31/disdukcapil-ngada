import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all struktur organisasi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const item = await db.strukturOrganisasi.findUnique({
        where: { id },
        include: {
          children: true,
        },
      });

      if (!item) {
        return NextResponse.json(
          { success: false, error: "Data tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: item });
    }

    // Fetch all with hierarchy
    const allItems = await db.strukturOrganisasi.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    // Build tree structure
    const buildTree = (items: typeof allItems, parentId: string | null = null) => {
      return items
        .filter((item) => item.parentId === parentId)
        .map((item) => ({
          ...item,
          children: buildTree(items, item.id),
        }));
    };

    const tree = buildTree(allItems);

    return NextResponse.json({
      success: true,
      data: allItems,
      tree,
    });
  } catch (error) {
    console.error("Error fetching struktur:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data struktur organisasi" },
      { status: 500 }
    );
  }
}

// POST - Create new struktur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, photo, description, parentId, order } = body;

    if (!name || !position) {
      return NextResponse.json(
        { success: false, error: "Nama dan jabatan harus diisi" },
        { status: 400 }
      );
    }

    const item = await db.strukturOrganisasi.create({
      data: {
        name,
        position,
        photo: photo || null,
        description: description || null,
        parentId: parentId || null,
        order: order || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: item,
      message: "Data berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error creating struktur:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan data" },
      { status: 500 }
    );
  }
}

// PUT - Update struktur
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, position, photo, description, parentId, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID tidak diberikan" },
        { status: 400 }
      );
    }

    const existingItem = await db.strukturOrganisasi.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    const item = await db.strukturOrganisasi.update({
      where: { id },
      data: {
        name: name || existingItem.name,
        position: position || existingItem.position,
        photo: photo !== undefined ? photo : existingItem.photo,
        description: description !== undefined ? description : existingItem.description,
        parentId: parentId !== undefined ? parentId : existingItem.parentId,
        order: order !== undefined ? order : existingItem.order,
      },
    });

    return NextResponse.json({
      success: true,
      data: item,
      message: "Data berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating struktur:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data" },
      { status: 500 }
    );
  }
}

// DELETE - Delete struktur
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

    // Check if item exists
    const existingItem = await db.strukturOrganisasi.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete children first (cascade)
    if (existingItem.children.length > 0) {
      await Promise.all(
        existingItem.children.map((child) =>
          db.strukturOrganisasi.delete({ where: { id: child.id } })
        )
      );
    }

    // Delete the item
    await db.strukturOrganisasi.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting struktur:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data" },
      { status: 500 }
    );
  }
}
