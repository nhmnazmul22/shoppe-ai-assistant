import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sops = await prisma.sop.findMany({
      include: {
        category: {
          select: { name: true },
        },
        creator: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sops);
  } catch (error) {
    console.error("Failed to fetch SOPs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, categoryId } = await request.json();

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const sop = await prisma.sop.create({
      data: {
        title,
        content,
        categoryId,
        createdBy: session.user.id,
      },
      include: {
        category: {
          select: { name: true },
        },
        creator: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(sop);
  } catch (error) {
    console.error("Failed to create SOP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing SOP ID" }, { status: 400 });
    }

    // Check if SOP exists
    const existingSop = await prisma.sop.findUnique({
      where: { id },
    });

    if (!existingSop) {
      return NextResponse.json({ error: "SOP not found" }, { status: 404 });
    }

    // Delete SOP
    await prisma.sop.delete({
      where: { id },
    });

    return NextResponse.json({ message: "SOP deleted successfully" });
  } catch (error) {
    console.error("Failed to delete SOP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
