import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing SOP ID" }, { status: 400 });
    }

    const sop = await prisma.sop.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
        creator: { select: { name: true } },
      },
    });

    if (!sop) {
      return NextResponse.json({ error: "SOP not found" }, { status: 404 });
    }

    return NextResponse.json(sop);
  } catch (error) {
    console.error("Failed to fetch SOP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { title, content, categoryId, version, isActive } =
      await request.json();

    // validate
    if (!title && !content && !categoryId) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    // check SOP exists
    const existingSop = await prisma.sop.findUnique({ where: { id } });
    if (!existingSop) {
      return NextResponse.json({ error: "SOP not found" }, { status: 404 });
    }

    const updatedSop = await prisma.sop.update({
      where: { id },
      data: {
        title: title ?? existingSop.title,
        content: content ?? existingSop.content,
        categoryId: categoryId ?? existingSop.categoryId,
        version: version ?? existingSop.version,
        isActive: isActive ?? existingSop.isActive,
      },
      include: {
        category: { select: { name: true } },
        creator: { select: { name: true } },
      },
    });

    return NextResponse.json(updatedSop);
  } catch (error) {
    console.error("Failed to update SOP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
