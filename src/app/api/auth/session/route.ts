import { NextResponse } from "next/server";
import { getCurrentUser, removeAuthCookie } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = db.users.findById(session.userId);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, barCouncilId: user.barCouncilId, language: user.language },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

export async function DELETE() {
  await removeAuthCookie();
  return NextResponse.json({ success: true });
}
