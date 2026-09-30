# EventHub: Event & Hackathon Management (Next.js + Prisma + Supabase)

## Project structure
```
eventhub/
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   ├── UIUX-Design-Brief.md
│   └── APP-FLOW.md
├── prisma/schema.prisma
├── next.config.mjs                  # security headers + CSP
├── package.json
├── .env.example
└── src/
    ├── middleware.ts                # RBAC + origin check (edge)
    ├── lib/
    │   ├── rbac.ts                  # role/route rules (deny by default)
    │   ├── jwt.ts                   # edge-safe sign/verify (jose)
    │   ├── auth.ts                  # requireRole, cookies, error wrapper
    │   ├── db.ts                    # Prisma singleton
    │   ├── ratelimit.ts             # Upstash limiters
    │   ├── validation.ts            # Zod schemas (shared client/server)
    │   ├── pricing.ts               # fee calculation (shared)
    │   ├── storage.ts               # signed upload/read URLs (server)
    │   └── supabase-browser.ts
    ├── components/
    │   ├── registration/RegistrationForm.tsx
    │   └── admin/DutyAssignmentPanel.tsx
    └── app/
        ├── (dashboard)/super-admin/duties/page.tsx
        └── api/
            ├── auth/login/route.ts
            ├── registration/route.ts
            ├── uploads/id-proof/route.ts
            └── admin/{coordinators,duties}/route.ts
```

## Setup
1. `npm install`, then copy `.env.example` to `.env.local` and fill it in.
2. Supabase: create a **private** bucket named `id-proofs` (no public policies).
3. `npx prisma db push` (or `migrate dev`), then seed a Super Admin, universities (with `uid`) and boarding points.
4. `npm run dev`.

Package versions were written from memory and not resolved against the registry (no network here); run `npm install` and adjust if any range fails.
