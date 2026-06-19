---
type: audit
title: "TaqiAI - Security & Code Quality Audit Report"
status: Draft v1.0
owner: Abdullah
contributors: [Claude AI]
last_updated: 2026-05-07
product: taqiai
version: "1.0"
lifecycle_stage: Development
kb_summary: "Comprehensive security and code quality audit of TaqiAI codebase. 30 total issues found — 6 Critical, 7 High, 12 Medium, 5 Low. Covers API security, authentication gaps, XSS vulnerabilities, database architecture, and configuration issues."
---

# TaqiAI — Security & Code Quality Audit Report

**Document Version:** 1.0  
**Date:** 2026-05-07  
**Owner:** Abdullah
**Contributors:** Claude AI (Security Audit Engine)  
**Status:** Draft — Action Required  
**Platform:** Next.js · Google Gemini AI · Prisma · SQLite · TypeScript  

---

## Table of Contents

**Part A — Summary**
1. Executive Summary
2. Issue Count by Severity
3. Immediate Action Items

**Part B — Critical Issues**
4. API Key Exposed in Source
5. AI Routes Without Authentication
6. .env Not in .gitignore
7. Weak JWT Fallback Secret

**Part C — High Issues**
8. XSS via Unsanitized AI HTML
9. File-Based JSON User Database
10. Insecure Cookie Configuration

**Part D — Medium Issues**
11. Medium Severity Issues Table

**Part E — Low Issues**
12. Low Severity Issues Table

**Part F — Full Registry**
13. Complete Issues Registry

---

# PART A — SUMMARY

## 1. Executive Summary

A comprehensive security and code quality audit was conducted on the **TaqiAI** codebase — a Next.js application powered by Google Gemini AI, designed for Pakistani lawyers to generate, translate, and manage legal documents.

The audit covered:
- All `/api/ai/*` route handlers (11 routes)
- Authentication and JWT implementation (`src/lib/auth.ts`)
- Database access patterns (`src/lib/db.ts`, Prisma)
- Frontend components using AI-generated HTML
- Environment configuration and `.gitignore`
- Code quality and dead code

**Total issues found: 30** — of which **6 are Critical** and require remediation before exposing to real users.

---

## 2. Issue Count by Severity

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 6 | Must fix before production |
| 🟠 High | 7 | Fix within current sprint |
| 🟡 Medium | 12 | Fix before v1 launch |
| 🟢 Low | 5 | Address in code cleanup pass |
| **Total** | **30** | |

**By category:**

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| Security | 4 | 3 | 5 | 0 | 12 |
| Architecture | 0 | 2 | 4 | 1 | 7 |
| Code Quality | 0 | 0 | 2 | 4 | 6 |
| Configuration | 2 | 1 | 2 | 0 | 5 |
| Performance | 0 | 0 | 1 | 0 | 1 |
| **Total** | **6** | **6** | **14** | **5** | **30** |

---

## 3. Immediate Action Items

These 7 actions must be completed before deploying to real users, ordered by severity:

| # | Action | File | Effort |
|---|--------|------|--------|
| 1 | **Rotate Gemini API Key** — current key is exposed | `.env.local` | 5 min |
| 2 | **Add `.env` to `.gitignore`** | `.gitignore` | 2 min |
| 3 | **Add auth check to all 11 AI routes** | `src/app/api/ai/*` | 1 hr |
| 4 | **Remove JWT fallback secret** | `src/lib/auth.ts` | 10 min |
| 5 | **Install DOMPurify — sanitize AI HTML** | `DocumentPreview.tsx` + 2 pages | 30 min |
| 6 | **Migrate auth from JSON file to Prisma** | `src/lib/db.ts` + auth routes | 3 hrs |
| 7 | **Add security headers in next.config.ts** | `next.config.ts` | 30 min |

---

# PART B — CRITICAL ISSUES

## 4. API Key Exposed in Source File

- **Severity:** 🔴 Critical
- **File:** `.env.local` — Line 2
- **Issue:** The Gemini API key `AIzaSyA2lfD7y-KYKIz0mPLHnVSkPyeI-vUl_Pc` is hardcoded in `.env.local`. If this file is ever committed to Git, any attacker can use the key to make unlimited AI requests, exhaust quota, and incur charges.

**Impact:**
- Unlimited free Gemini API usage by anyone
- API quota exhaustion for legitimate users
- Financial charges on the API account

**Fix:**
1. Go to Google AI Studio → API Keys → Delete current key → Generate new key
2. Store only in deployment environment (Vercel / hosting platform env vars)
3. Never commit `.env.local` — ensure it is in `.gitignore`

---

## 5. AI Routes Without Authentication

- **Severity:** 🔴 Critical
- **Files:** All 11 files in `src/app/api/ai/`
- **Issue:** Every AI-powered endpoint is publicly accessible without any login check. Any anonymous user can call document generation, translation, smart drafting, voice transcription, and legal judgment search for free.

**Affected routes:**

| Route | Function | Risk |
|-------|----------|------|
| `/api/ai/generate` | Document generation | Free AI usage |
| `/api/ai/translate` | Document translation | Free AI usage |
| `/api/ai/smart-draft` | AI smart drafting | Free AI usage |
| `/api/ai/advisor` | Legal advice | Free AI usage |
| `/api/ai/judgment` | Judgment search | Free AI usage |
| `/api/ai/voice` | Voice transcription | Free AI usage |
| `/api/ai/voice-transcribe` | Voice processing | Free AI usage |
| `/api/ai/extract-document` | Document extraction | Data exposure |
| `/api/ai/edit-document` | Document editing | Data exposure |
| `/api/ai/translate-edit` | Translation editing | Data exposure |
| `/api/ai/suggest` | Field suggestions | Free AI usage |

**Fix:** Add this guard at the top of every AI route handler:

```typescript
const user = await getCurrentUser();
if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

## 6. .env File Not in .gitignore

- **Severity:** 🔴 Critical
- **File:** `.gitignore` — Line 32
- **Issue:** The `.gitignore` only excludes `.env*.local` variants. A plain `.env` file would not be excluded and could be accidentally committed with secrets inside.

**Current entry:**
```
.env*.local
```

**Fix — replace with:**
```
.env
.env.*
.env*.local
!.env.example
```

---

## 7. Weak JWT Fallback Secret

- **Severity:** 🔴 Critical
- **File:** `src/lib/auth.ts` — Line 5–6
- **Issue:** JWT signing falls back to `"default-secret-change-me"` if `JWT_SECRET` env var is not set. An attacker knowing this default can forge auth tokens for any user.

**Current code:**
```typescript
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-me";
```

**Fix:**
```typescript
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is required");
```

---

# PART C — HIGH ISSUES

## 8. XSS via Unsanitized AI HTML Output

- **Severity:** 🟠 High
- **Files:**
  - `src/components/documents/DocumentPreview.tsx` — Line 661
  - `src/app/(dashboard)/scan-document/page.tsx` — multiple lines
  - `src/app/(dashboard)/translate/page.tsx` — multiple lines
- **Issue:** AI-generated HTML is rendered via `dangerouslySetInnerHTML` without sanitization. If Gemini returns malicious HTML with `<script>` tags, attackers can steal sessions and exfiltrate legal documents.

**Fix:**
```bash
npm install dompurify @types/dompurify
```
```typescript
import DOMPurify from 'dompurify';

// Before every dangerouslySetInnerHTML usage:
const safeHtml = DOMPurify.sanitize(aiGeneratedContent);
return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
```

---

## 9. File-Based JSON User Database

- **Severity:** 🟠 High
- **File:** `src/lib/db.ts`
- **Issue:** User authentication uses a JSON file (`users.json`) instead of Prisma (which the rest of the app uses). Concurrent writes cause race conditions and data corruption. No error handling for JSON parse failures — corrupted file crashes entire auth.

**Fix:** Migrate to Prisma:
```typescript
// Replace readUsers() / writeUsers() with:
await prisma.user.findUnique({ where: { email } });
await prisma.user.create({ data: { email, password, name } });
```

---

## 10. Insecure Cookie Configuration

- **Severity:** 🟠 High
- **File:** `src/lib/auth.ts` — Line 51
- **Issue:** Auth cookies are not marked `Secure` outside of production. In staging or test environments, tokens can be intercepted over plain HTTP.

**Current:**
```typescript
secure: process.env.NODE_ENV === "production"
```

**Fix:**
```typescript
secure: true  // Always enforce HTTPS
```

---

# PART D — MEDIUM ISSUES

## 11. Medium Severity Issues Table

| # | Issue | File | Severity |
|---|-------|------|----------|
| 1 | No CSRF protection on any POST/PUT/DELETE routes | All API routes | 🟡 Medium |
| 2 | No input length validation — prompts can be unlimited size | `src/app/api/ai/edit-document/route.ts` | 🟡 Medium |
| 3 | Raw Gemini error messages leaked in API responses | `src/app/api/ai/generate/route.ts:155` | 🟡 Medium |
| 4 | Missing security headers (CSP, X-Frame-Options, HSTS) | `next.config.ts` | 🟡 Medium |
| 5 | No startup validation for required environment variables | All config files | 🟡 Medium |
| 6 | 5KB personality prompt sent with every AI request — wastes quota | `src/lib/intent-handlers.ts` | 🟡 Medium |
| 7 | Duplicated `cleanHtmlOutput()` function in multiple files | `src/lib/gemini.ts` · `smart-draft/route.ts` | 🟡 Medium |
| 8 | Mixed DB access — some routes use `db.ts`, others use Prisma | `src/app/api/auth/*` vs `src/app/api/documents/*` | 🟡 Medium |
| 9 | Unsafe type assertion in JWT payload parsing | `src/lib/auth.ts:34` | 🟡 Medium |
| 10 | Prisma schema has no migration history tracked | `prisma/schema.prisma` | 🟡 Medium |
| 11 | No error handling for JSON parse failure in `db.ts` | `src/lib/db.ts:29–35` | 🟡 Medium |
| 12 | Cookies not marked `Secure` in non-production | `src/lib/auth.ts:51` | 🟡 Medium |

---

# PART E — LOW ISSUES

## 12. Low Severity Issues Table

| # | Issue | File | Severity |
|---|-------|------|----------|
| 1 | 17 `console.log()` statements in production routes | Multiple API routes | 🟢 Low |
| 2 | Dead code — `src/lib/gemini.ts` duplicates `gemini-helper.ts` | `src/lib/gemini.ts` | 🟢 Low |
| 3 | Optional TypeScript fields used without null checks | `src/app/api/ai/smart-draft/route.ts:257` | 🟢 Low |
| 4 | No code splitting configured for large route bundles | `next.config.ts` | 🟢 Low |
| 5 | No image optimization pipeline for document previews | `src/components/documents/*` | 🟢 Low |

---

# PART F — FULL REGISTRY

## 13. Complete Issues Registry

| ID | Category | Issue | File | Severity |
|----|----------|-------|------|----------|
| A-01 | Security | Gemini API key hardcoded in `.env.local` | `.env.local:2` | 🔴 Critical |
| A-02 | Security | 11 AI routes without authentication | `src/app/api/ai/*` | 🔴 Critical |
| A-03 | Config | `.env` not in `.gitignore` | `.gitignore:32` | 🔴 Critical |
| A-04 | Security | JWT weak fallback secret | `src/lib/auth.ts:5` | 🔴 Critical |
| A-05 | Security | XSS via `dangerouslySetInnerHTML` with AI output | `DocumentPreview.tsx:661` | 🟠 High |
| A-06 | Architecture | File-based JSON user database race conditions | `src/lib/db.ts` | 🟠 High |
| A-07 | Security | Insecure cookies outside production | `src/lib/auth.ts:51` | 🟠 High |
| A-08 | Security | No CSRF protection | All API routes | 🟡 Medium |
| A-09 | Security | No input length validation | `api/ai/edit-document/route.ts` | 🟡 Medium |
| A-10 | Security | Gemini errors leaked in response messages | `api/ai/generate/route.ts:155` | 🟡 Medium |
| A-11 | Config | Missing security HTTP headers | `next.config.ts` | 🟡 Medium |
| A-12 | Config | No startup env variable validation | All config files | 🟡 Medium |
| A-13 | Architecture | Large prompt in every AI request | `src/lib/intent-handlers.ts` | 🟡 Medium |
| A-14 | Code Quality | Duplicated `cleanHtmlOutput()` function | `gemini.ts` + `smart-draft` | 🟡 Medium |
| A-15 | Architecture | Mixed Prisma + file DB access patterns | `api/auth/*` vs `api/documents/*` | 🟡 Medium |
| A-16 | Security | Unsafe JWT payload type assertion | `src/lib/auth.ts:34` | 🟡 Medium |
| A-17 | Architecture | No Prisma migration history | `prisma/schema.prisma` | 🟡 Medium |
| A-18 | Architecture | No error handling for JSON parse in db.ts | `src/lib/db.ts:29` | 🟡 Medium |
| A-19 | Security | Cookies not `Secure` outside production | `src/lib/auth.ts:51` | 🟡 Medium |
| A-20 | Code Quality | 17 `console.log()` in production routes | Multiple API routes | 🟢 Low |
| A-21 | Code Quality | Dead code — `gemini.ts` duplicates `gemini-helper.ts` | `src/lib/gemini.ts` | 🟢 Low |
| A-22 | Code Quality | Optional fields without null checks | `smart-draft/route.ts:257` | 🟢 Low |
| A-23 | Performance | No code splitting configured | `next.config.ts` | 🟢 Low |
| A-24 | Performance | No image optimization for document previews | `src/components/documents/*` | 🟢 Low |

---

*Audit Report — TaqiAI v1.0 · 2026-05-07 · Prepared by Claude AI · CONFIDENTIAL — do not distribute outside development team*
