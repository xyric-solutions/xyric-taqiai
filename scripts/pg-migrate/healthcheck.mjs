/**
 * End-to-end health check: signs in as a real user (mints the auth-token JWT the
 * same way the app does), then GETs the main pages + DB-backed APIs and reports
 * status / timing. Read-only — does not POST to AI endpoints. Needs env:
 *   JWT_SECRET   (same as the server's, from .env.local)
 *   DATABASE_URL (Railway Postgres, to look up a real userId)
 */
import { SignJWT } from "jose";
import { PrismaClient } from "@prisma/client";

const BASE = "http://localhost:3000";
const prisma = new PrismaClient();

const user = await prisma.user.findFirst({ select: { id: true, email: true } });
if (!user) { console.error("No user in DB"); process.exit(1); }
await prisma.$disconnect();

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const token = await new SignJWT({ userId: user.id, email: user.email })
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("7d")
  .setIssuedAt()
  .sign(secret);
const headers = { Cookie: `auth-token=${token}` };
console.log(`Signed in as ${user.email}\n`);

const PAGES = [
  "/dashboard", "/case-law", "/statute-search", "/ai-advisor", "/chamber",
  "/lawyer-diary", "/documents", "/translate", "/property-transfer/tax-calculator",
  "/copy-from-photo", "/voice-case", "/case-builder", "/settings", "/cases",
  "/affidavits", "/agreements", "/family-law", "/criminal-law", "/civil-law",
  "/property-law", "/tax-law", "/property-transfer",
];
const APIS = [
  "/api/auth/session", "/api/matters", "/api/diary", "/api/documents",
  "/api/cases", "/api/chat/sessions",
  "/api/judgments/local?q=bail%20cancellation&page=1",
  "/api/judgments/local?q=murder&page=1",
];

let pass = 0, fail = 0;
const problems = [];

async function hit(pathname, kind) {
  const t = process.hrtime.bigint();
  try {
    const res = await fetch(BASE + pathname, { headers, redirect: "manual" });
    const ms = (Number(process.hrtime.bigint() - t) / 1e6).toFixed(0);
    const loc = res.headers.get("location") || "";
    const redirectedToLogin = (res.status === 307 || res.status === 302) && loc.includes("/login");
    let extra = "";
    if (kind === "api" && pathname.includes("/judgments/local") && res.status === 200) {
      const j = await res.json().catch(() => null);
      const n = j?.results?.length ?? j?.judgments?.length ?? "?";
      extra = ` (${n} results)`;
    }
    const ok = res.status === 200;
    if (ok) pass++; else { fail++; problems.push(`${pathname} -> ${res.status}${redirectedToLogin ? " (login redirect = auth fail)" : ""}`); }
    console.log(`${ok ? "OK " : "XX "} ${String(res.status).padEnd(4)} ${String(ms).padStart(6)}ms  ${pathname}${extra}`);
  } catch (e) {
    fail++; problems.push(`${pathname} -> ERROR ${e.message}`);
    console.log(`XX  ERR        ${pathname}  (${e.message})`);
  }
}

console.log("──── PAGES ────");
for (const p of PAGES) await hit(p, "page");
console.log("\n──── APIS ────");
for (const a of APIS) await hit(a, "api");

console.log(`\n==== SUMMARY:  ${pass} OK / ${fail} FAIL ====`);
if (problems.length) { console.log("Problems:"); for (const p of problems) console.log("  - " + p); }
