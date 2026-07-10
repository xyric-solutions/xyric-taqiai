import { NextResponse } from "next/server";
import { getCurrentUser, isJwtConfigError, removeAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        barCouncilId: true,
        language: true,
      },
    });
    if (!user) {
      await removeAuthCookie();
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    if (isJwtConfigError(error)) {
      return NextResponse.json(
        { user: null, error: "Server auth is not configured." },
        { status: 500 }
      );
    }
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

export async function DELETE() {
  await removeAuthCookie();
  return NextResponse.json({ success: true });
}
