# dev.db (SQLite) → Railway Postgres migration

Only the **Prisma** data (`prisma/dev.db` — users, documents, chat, matters, etc.)
moves to Postgres. The raw reference DBs (`judgments.db`, `statutes.db`,
`semantic.db`, `citations.db`) are read via `node:sqlite` and are **unaffected**
by this step — they are handled separately later.

## Backups (already done — 2026-06-24)
- `data/_backup_2026-06-24/` — all live DBs copied + `PRAGMA integrity_check = ok`
- Original SQLite files are never modified by the migration (read-only).

## Steps (run once the Railway Postgres URL is ready)

1. **Get the Railway Postgres URL**
   Railway → project → Add PostgreSQL → service → Variables/Connect →
   copy the **public** `DATABASE_URL` (`postgresql://...@...railway.app:PORT/railway`).

2. **Point env at Postgres** (`.env` and `.env.local`):
   ```
   DATABASE_URL="postgresql://...@...railway.app:PORT/railway"
   ```
   (Old SQLite value is saved in `.env.sqlite.bak`.)

3. **Switch the Prisma provider** in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

4. **Create the schema in Postgres** (tables + indexes):
   ```
   npx prisma db push
   ```

5. **Regenerate the Prisma client for Postgres**:
   ```
   npx prisma generate
   ```

6. **Copy the data across + verify counts**:
   ```
   node --experimental-sqlite scripts/pg-migrate/migrate-devdb-to-postgres.mjs
   ```
   Expected (from the local snapshot): User=4, Document=18, ChatSession=28,
   ChatMessage=116, Matter=2 — all other tables 0. The script prints OK/MISMATCH
   per table and exits non-zero if anything fails.

## Rollback (if anything looks wrong)
- Restore `.env` from `.env.sqlite.bak`
- Set `provider = "sqlite"` back in `schema.prisma`
- `npx prisma generate`
- Local data is untouched in `prisma/dev.db` (+ verified backup).
