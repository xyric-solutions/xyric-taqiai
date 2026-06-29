// Quick read-only check that data really landed in Postgres.
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const users = await p.user.findMany({ select: { name: true, email: true, city: true } });
console.log("=== Users now in Railway Postgres ===");
for (const u of users) console.log(" -", u.name, "|", u.email, "|", u.city || "");
console.log("Documents:", await p.document.count(), "| Matters:", await p.matter.count(), "| ChatMessages:", await p.chatMessage.count());
await p.$disconnect();
