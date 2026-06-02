import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      barCouncilId: user.barCouncilId ?? "",
      phone: user.phone ?? "",
      city: user.city ?? "",
      language: user.language,
    },
  });
}

export async function PUT(req: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    name?: string;
    barCouncilId?: string;
    phone?: string;
    city?: string;
    language?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updateData: {
    name?: string;
    barCouncilId?: string | null;
    phone?: string | null;
    city?: string | null;
    language?: string;
  } = {};
  if (body.name !== undefined) updateData.name = body.name.trim();
  if (body.barCouncilId !== undefined) updateData.barCouncilId = body.barCouncilId.trim() || null;
  if (body.phone !== undefined) updateData.phone = body.phone.trim() || null;
  if (body.city !== undefined) updateData.city = body.city.trim() || null;
  if (body.language !== undefined && (body.language === "en" || body.language === "ur")) {
    updateData.language = body.language;
  }

  if (updateData.name !== undefined && updateData.name.length === 0) {
    return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: updateData,
  }).catch(() => null);

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    profile: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      barCouncilId: updated.barCouncilId ?? "",
      phone: updated.phone ?? "",
      city: updated.city ?? "",
      language: updated.language,
    },
  });
}
