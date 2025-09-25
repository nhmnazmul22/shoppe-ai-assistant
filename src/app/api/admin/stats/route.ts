import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get stats from database
    const [totalSops, totalCategories, totalChats, activeUsers] = await Promise.all([
      prisma.sop.count({ where: { isActive: true } }),
      prisma.sopCategory.count(),
      prisma.chatSession.count(),
      prisma.user.count()
    ])

    return NextResponse.json({
      totalSops,
      totalCategories,
      totalChats,
      activeUsers
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

