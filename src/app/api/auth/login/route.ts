import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
import { withDbRetry } from "@/lib/db-retry";

export async function POST(request: NextRequest) {
  try {
    let body;
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const user = await withDbRetry(() => prisma.user.findUnique({ where: { email } }));
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    const msg = (error instanceof Error ? error.message : "").toLowerCase();
    const isDbConnIssue =
      msg.includes("reach database") || msg.includes("p1001") || msg.includes("p1017") ||
      msg.includes("econnreset") || msg.includes("connection") || msg.includes("timeout");
    if (isDbConnIssue) {
      return NextResponse.json(
        { error: "Could not reach the server. Please check your connection and try again." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
