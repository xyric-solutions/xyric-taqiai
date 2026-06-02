import { prisma } from "./prisma";
import { db } from "./db";

export async function ensurePrismaUser(userId: string, email: string) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (existing) return existing;

  const jsonUser = db.users.findById(userId) ?? db.users.findByEmail(email);
  if (!jsonUser) {
    throw new Error("User record not found");
  }

  return prisma.user.upsert({
    where: { id: jsonUser.id },
    create: {
      id: jsonUser.id,
      name: jsonUser.name,
      email: jsonUser.email,
      passwordHash: jsonUser.passwordHash,
      barCouncilId: jsonUser.barCouncilId ?? null,
      phone: jsonUser.phone ?? null,
      city: jsonUser.city ?? null,
      language: jsonUser.language ?? "en",
    },
    update: {
      email: jsonUser.email,
      name: jsonUser.name,
    },
  });
}
