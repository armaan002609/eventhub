# Product Requirements Document (PRD)
**Product:** EventHub, Event & Hackathon Management Platform
**Status:** Draft v0.1  |  **Platform:** Web (mobile-first), deployed on Vercel

## 1. Problem
Multi-college events and hackathons are run on spreadsheets and chat groups: registrations arrive as messy forms, ID proofs sit in shared drives, transport/stay/food counts are tallied by hand, volunteer attendance is unrecorded, and results are announced verbally. Organisers lack one trusted system; participants lack a single place to see what they signed up for, what they owe, and how they ranked.

## 2. Goals
1. One registration flow that captures identity, verified ID, and optional transport / accommodation / food, with the fee computed automatically.
2. Clear, least-privilege dashboards for four roles.
3. A live leaderboard participants can watch during the event.
4. Personal data (ID proofs especially) handled defensively by default.

**Non-goals (v1):** online payment gateway (payment is tracked manually or via later webhook), team formation/matchmaking, project submission/judging rubrics, native mobile apps, multi-event tenancy.

## 3. Personas
| Persona | Description | Primary needs |
|---|---|---|
| **Super Admin** | Core organiser | Assign coordinators per college UID, allocate high-level duties, review ID proofs, oversee payments |
| **Coordinator** | College/zone lead | Assign duties to volunteers, track attendance with exact timestamps, update scores |
| **Volunteer / Student Coordinator** | On-ground helper | See own duties, venue, time slot (read-only) |
| **Participant** | Student attendee | Register, see facilities/boarding point/fees/payment status, announcements, live rankings |

## 4. Functional requirements

### FR-1 Registration
- FR-1.1 Capture student name, phone, email, university (from managed list).
- FR-1.2 Require ID proof upload (JPG/PNG/PDF, ≤ 5 MB), stored privately.
- FR-1.3 **Transport** (Yes/No). Yes → choose boarding point; charge shown immediately.
- FR-1.4 **Accommodation** (Yes/No). Yes → days (1-5), check-in and check-out datetimes; check-out must follow check-in and days must cover the stay.
- FR-1.5 **Food** (Yes/No). Yes → meals per day (1-4).
- FR-1.6 Total fee is computed server-side; UI shows a live estimate. Payment status: `UNPAID → PENDING_VERIFICATION → PAID` (or `WAIVED`), changeable only by Admin.
- FR-1.7 One registration per participant account.

### FR-2 Role dashboards
| Role | Can | Cannot |
|---|---|---|
| Super Admin | Assign coordinators by college UID; allocate high-level duties; view ID proofs (audited); update payment status; manage announcements & competitions | n/a |
| Coordinator | Assign duties to volunteers; mark PRESENT/ABSENT with server timestamp; update scores | Change roles; see ID proofs |
| Volunteer | Read own duties (title, venue, slot) | Any write |
| Participant | Read own registration summary, boarding point, fee & payment status, announcements, leaderboard | Any admin data; other users' data |

### FR-3 Live scoreboard
- Competitions with metric type `TIME_MS_ASC` (lower wins) or `POINTS_DESC` (higher wins), plus event-specific extra metrics.
- Ranks computed at read time with deterministic tie-breaks (ties share rank; secondary sort by earliest update).
- Coordinators/Admins add or edit entries; participants see updates within ~5 s (polling; SSE/Realtime later).
- Competitions can be unpublished until results are ready.

### FR-4 Security (product-level)
Deny-by-default access, validated inputs, rate-limited login/registration, revocable sessions, private ID proofs accessed only via short-lived signed URLs, audit trail for sensitive reads and role changes.

## 5. Acceptance criteria (samples)
- Choosing "No" for a module hides its fields and excludes them from the payload and fee.
- A participant hitting `/super-admin` or `/api/admin/*` gets redirect / 403 even with a hand-edited client.
- Submitting a tampered `totalFee` or unknown field returns 422.
- 6th login attempt for the same ip+email in 10 min returns 429 with `Retry-After`.
- An ID proof URL stops working ~60 s after it is issued and cannot be guessed from the DB path.
- Marking attendance stores the server time, not a client-supplied time.
- Leaderboard reflects a score edit within 5 s on an open participant page.

## 6. Success metrics
Registration completion rate > 85%; median registration time < 4 min; zero public ID proof exposures; attendance coverage of scheduled duties > 95%; leaderboard p95 latency < 500 ms.

## 7. Risks & open questions
- Exact fee rates, event days, refund policy (placeholders in code).
- Payment: manual verification vs gateway (Razorpay etc.) in v1.1?
- Data retention window for ID proofs (recommend delete 30 days post-event).
- Do universities self-register, or does Super Admin seed them?
- Compliance: India's DPDP Act consent/notice text needed on the form.

## 8. Milestones
M1 schema + auth + RBAC → M2 registration & upload → M3 dashboards → M4 leaderboard → M5 hardening, load test, pilot event.
