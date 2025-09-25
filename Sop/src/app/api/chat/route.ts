// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(request: NextRequest) {
  const shouldDisconnect = process.env.NODE_ENV === "development";

  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // **Hubungkan dulu (biar error cepat ketangkep)**
    await prisma.$connect();

    const { message, imageUrl, history, sessionId } = await request.json();

    // --- ambil SOP ---
    const sops = await prisma.sop.findMany({
      where: { isActive: true },
      include: { category: true, evidenceTemplates: true },
    });

    const sopContext = sops
      .map(
        (s: any) => `Category: ${s.category.name}
Title: ${s.title}
Content: ${s.content}
Evidence Requirements: ${s.evidenceTemplates
          .map((e: any) => e.description)
          .join(", ")}
---`
      )
      .join("\n");

    const systemPrompt = `You are a Shopee Return & Refund SOP Assistant.
You can analyze text AND screenshots (images). 
When screenshots are provided, extract the visible text, identify the key issue (order ID, return status, refund info, etc.), 
and map it against the SOPs below. Always provide clear, step-by-step advice.

Available SOPs:
${sopContext}
---`;

    type AnyMsg =
      | { role: "system" | "user" | "assistant"; content: string }
      | {
          role: "user";
          content: Array<
            | { type: "text"; text: string }
            | { type: "image_url"; image_url: { url: string } }
          >;
        };

    const messages: AnyMsg[] = [{ role: "system", content: systemPrompt }];

    // history (skip welcome)
    if (Array.isArray(history)) {
      for (const m of history) {
        if (m.role !== "assistant" || m.id !== "welcome") {
          messages.push({ role: m.role, content: m.content } as AnyMsg);
        }
      }
    }

    // current turn (text / image)
    if (imageUrl) {
      const fs = await import("fs/promises");
      const path = await import("path");
      const p = path.join(process.cwd(), "public", imageUrl);
      const buf = await fs.readFile(p);
      const b64 = buf.toString("base64");
      const ext = (await import("path")).extname(imageUrl).toLowerCase();
      const mime =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
          ? "image/webp"
          : "image/jpeg";
      const dataUrl = `data:${mime};base64,${b64}`;
      messages.push({
        role: "user",
        content: [
          { type: "text", text: message || "Please analyze this screenshot." },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      });
    } else {
      messages.push({ role: "user", content: message || "" });
    }

    // ==== OPENAI: pilih model sesuai input ====
    const model = imageUrl ? "gpt-4o" : "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model,
      messages: messages as any,
      temperature: 0.3,
      max_tokens: 1000,
    });

    const aiText =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a response.";

    // --- pastikan user ada ---
    const userId = (session as any).user.id;
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!userExists) {
      return NextResponse.json(
        {
          response: "Auth issue. Please sign out then sign in.",
          sessionId: null,
        },
        { status: 200 }
      );
    }

    // --- session chat ---
    let chatSession =
      (sessionId &&
        (await prisma.chatSession.findFirst({
          where: { id: sessionId, userId },
        }))) ||
      (await prisma.chatSession.create({
        data: {
          userId,
          title:
            message && message.length > 50
              ? message.slice(0, 50) + "..."
              : message || "Image Analysis Session",
        },
      }));

    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "user",
        content: message || "Image uploaded",
        imageUrl: imageUrl || null,
      },
    });
    await prisma.chatMessage.create({
      data: { sessionId: chatSession.id, role: "assistant", content: aiText },
    });
    await prisma.chatSession.update({
      where: { id: chatSession.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ response: aiText, sessionId: chatSession.id });
  } catch (err: any) {
    console.error("Chat API error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  } finally {
    // **LEPAS koneksi di DEV** untuk menghindari pool habis
    if (shouldDisconnect) {
      try {
        await prisma.$disconnect();
      } catch {}
    }
  }
}
