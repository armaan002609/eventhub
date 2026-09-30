# Technical Requirements Document (TRD)
**Version:** 0.1  |  Companion to PRD.md

## 1. Architecture
```
Browser ──HTTPS──▶ Vercel Edge (middleware: JWT verify, RBAC, origin check)
                       │
                       ▼
             Next.js App Router (RSC + Route Handlers, Node runtime)
              │        │            │               │
              ▼        ▼            ▼               ▼
        Supabase   Supabase     Upstash Redis   (later) payment
        Postgres   Storage      rate limiting    webhook
        via Prisma (private bucket, signed URLs)
```
Serverless-friendly: stateless handlers, pooled Postgres connections (pgbouncer), no in-memory state.

## 2. Stack
| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router, TypeScript | Vercel-native, server components |
| Styling | Tailwind CSS 3 | fast, consistent |
| DB | Supabase Postgres + Prisma | relational fits users/duties/scores; parameterised queries by default |
| Files | Supabase Storage (private bucket) | signed upload/read URLs |
| Auth | Custom JWT (jose, HS256) in httpOnly cookie + DB revocation | no third-party auth dependency; see §4 |
| Validation | Zod (`.strict()`) shared client/server | one schema, both sides |
| Rate limit | Upstash Redis sliding window | works on serverless |
| Forms | react-hook-form + zodResolver | |
| Live data | SWR polling (5 s) → Supabase Realtime later | simple first |

*Mongo alternative:* possible via Mongoose, but ranks/joins/attendance queries are cleaner in SQL; if used, add operator-stripping (`$`-keys) and keep `.strict()` schemas.

## 3. Data model (see `prisma/schema.prisma`)
`University(uid)` 1─* `User(role, tokenVersion)` 1─0..1 `Registration` ; `Duty(level, assignedTo, createdBy)` 1─* `AttendanceLog(status, markedAt, markedBy)` ; `Competition(metric)` 1─* `ScoreEntry` ; `BoardingPoint` ; `Announcement` ; `AuditLog`.
- Money is integer INR. Rank is **never stored**: computed with `ORDER BY` on `timeMs ASC` or `points DESC` plus `updatedAt ASC` tie-break, using `RANK()` window function via `$queryRaw` with tagged-template parameters.
- Indexes on `(assignedToId, startsAt)`, `(competitionId, points|timeMs)`, `(dutyId, volunteerId, markedAt)`.

## 4. Security requirements & how they are met
| Requirement | Implementation |
|---|---|
| Strict API protection, not client-only | `middleware.ts` deny-by-default on `/api/*` (unlisted prefix → 403) **and** `requireRole()` in every handler re-checks the DB (active, role, tokenVersion) |
| RBAC | Central `rbac.ts` prefix→roles map; DB role overrides token role; role change bumps `tokenVersion` (instant revoke) |
| Input validation / injection / XSS | Zod `.strict()` schemas (unknown keys rejected, forged `totalFee` impossible); Prisma parameterises SQL; `[<>]` rejected in free text; React escapes output; CSP header |
| Rate limiting | Upstash: login 5/10 min per ip+email and 30/10 min per ip; registration 5/h per user, 20/h per ip; uploads 10/h; fails closed in prod if Redis missing |
| JWT / sessions | HS256 pinned, `iss`/`aud` checked, 8 h expiry, `__Host-` httpOnly Secure SameSite=Lax cookie, no token in JS-readable storage; bcrypt cost 12; timing-safe login for unknown emails |
| CSRF | SameSite=Lax + Origin allow-list on mutating API calls |
| ID proof privacy | Private bucket, no public policies; server-generated path `id-proofs/{userId}/{uuid}.ext`; client uploads via one-time signed upload token; read only via 60 s signed URL for Super Admin; every read audit-logged; path ownership verified at registration |
| Headers | HSTS, nosniff, frame-deny, referrer-policy, permissions-policy, CSP (`next.config.mjs`) |
| Secrets | Server-only env vars; service-role key never `NEXT_PUBLIC` |

**Known gaps / next hardening:** magic-byte verification of uploaded files (post-upload check, delete on mismatch) and optional malware scan; account lockout & email verification; password reset flow; 2FA for Super Admin; nonce-based CSP; automated retention purge; dependency audit in CI.

## 5. API surface
| Method & path | Roles | Notes |
|---|---|---|
| POST `/api/auth/login` (+ signup, logout) | public | rate-limited |
| POST `/api/uploads/id-proof` | Participant | returns path + signed upload token |
| GET `/api/uploads/id-proof?registrationId=` | Super Admin | 60 s read URL, audited |
| POST `/api/registration` | Participant | server-side fee calc |
| POST `/api/admin/coordinators` | Super Admin | assign by university UID |
| POST `/api/admin/duties` | Super Admin | HIGH_LEVEL duty → Coordinator |
| POST `/api/coordinator/duties`, `/api/coordinator/attendance` | Coordinator+ | TASK duties; attendance uses server `now()` |
| PUT `/api/scores/[competitionId]` | Coordinator+ | upsert entries |
| GET `/api/public/leaderboard?competitionId=` | public | cached `s-maxage=3, stale-while-revalidate=10` |
| GET `/api/me/*` | any authenticated | own data only, always filtered by session `sub` |

Errors: JSON `{ error, issues? }`; 401/403/404/409/422/429; no stack traces.

## 6. Non-functional
Availability 99.9% (Vercel/Supabase SLAs); p95 API < 500 ms; supports ~2,000 registrations and 500 concurrent leaderboard viewers (CDN-cached reads); WCAG 2.1 AA; browsers: last 2 versions of Chrome/Safari/Firefox/Edge; observability via Vercel logs + audit table.

## 7. Deployment
Vercel project (region near Supabase, e.g. `bom1`/`sin1`); env vars per `.env.example`; `prisma migrate deploy` in CI; Supabase bucket `id-proofs` created private; seed script for Super Admin, universities, boarding points. Preview deployments use a separate Supabase project.

## 8. Testing
Unit (pricing, Zod schemas), integration (route handlers vs. test DB: role matrix table-driven), E2E Playwright (register happy path, conditional modules, RBAC redirects), security (IDOR on registration/upload, JWT tamper, rate-limit, oversized/wrong-MIME upload).
