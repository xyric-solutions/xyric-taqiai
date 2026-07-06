import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string; hid: string }> };

// DELETE a single hearing — used by the adjourn-rollback flow on the diary page.
export async function DELETE(_req: Request, ctx: RouteContext) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, hid } = await ctx.params;

  // Verify the matter belongs to the user before touching its hearings.
  const matter = await prisma.matter.findFirst({
    where: { id, userId: session.userId },
  });
  if (!matter) {
    return NextResponse.json({ error: "Matter not found" }, { status: 404 });
  }

  const hearing = await prisma.matterHearing.findFirst({
    where: { id: hid, matterId: id },
  });
  if (!hearing) {
    return NextResponse.json({ error: "Hearing not found" }, { status: 404 });
  }

  await prisma.matterHearing.delete({ where: { id: hid } });

  return NextResponse.json({ success: true });
}
