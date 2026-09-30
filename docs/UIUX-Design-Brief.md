# UI/UX Design Brief
**Product:** EventHub  |  **Audience:** students on mid-range phones, plus organisers on laptops

## 1. Principles
1. **Mobile-first.** Most participants register and check rankings on a phone, often on patchy campus Wi-Fi.
2. **Progressive disclosure.** Yes/No modules reveal fields only when needed; never show empty, irrelevant inputs.
3. **No surprises on money.** The fee summary is always visible and updates as choices change.
4. **Role clarity.** Each role lands on its own home; navigation only shows what that role can do.
5. **Trust cues.** Explain why we need the ID and who can see it.
6. **Calm at a busy event.** Big touch targets, high contrast, minimal chrome for volunteers and coordinators.

## 2. Visual language
- **Tone:** modern, energetic but professional (tech-event feel).
- **Colour tokens:** primary `indigo-600`; surface `white` / `slate-50`; text `slate-900` / `slate-600`; success `green-600`; warning `amber-500`; danger `red-600`. Rank medals: gold `#F5B301`, silver `#9CA3AF`, bronze `#B45309`.
- **Type:** Inter (system fallback). Scale 12/14/16/20/24/32; body 14-16 px; tabular numerals for scores and fees.
- **Spacing/shape:** 4 px grid, cards `rounded-xl`, 1 px `slate-200` borders, subtle shadow only on modals.
- **Dark mode:** v1.1; tokens defined via CSS variables to allow it.

## 3. Key screens

### Public / auth
- **Login, Sign up:** single column, inline errors, generic failure copy ("Invalid email or password"), 429 shows "Try again in N minutes".
- **Landing:** event info, dates, CTA "Register", link to public leaderboard.

### Registration (participant)
Single scrolling form with sticky fee summary on desktop (right column) and a collapsible bottom bar on mobile.
1. Your details (name, phone, email, university).
2. ID proof: drag-drop or tap-to-pick; shows file name, size, type errors; helper text "Stored privately; only event admins can view."
3. Transportation Yes/No → boarding point select showing charge inline (`Sector 17 Gate: ₹350`).
4. Accommodation Yes/No → days, check-in, check-out (native datetime pickers); inline validation "Days must cover your stay".
5. Food Yes/No → meals/day.
6. Fee summary: transport, accommodation, food, total; footnote "Final amount confirmed by server".
7. Submit: progress states "Uploading ID…", "Submitting…"; success → Participant dashboard.

### Participant dashboard
Cards: **Registration summary** (facilities chosen, boarding point, stay dates, meals), **Fees** (breakdown + status pill Unpaid / Pending / Paid), **Announcements** (latest first, unread dot), **Live leaderboard** tab. Read-only; a "Contact organisers" link instead of edit.

### Volunteer dashboard
Agenda list grouped by day: duty title, venue, time slot, status chip (Upcoming / Now / Done). Read-only. Optional "Add to calendar" later.

### Coordinator dashboard
- **Volunteers & duties:** table + "Assign duty" drawer (volunteer, title, venue, slot).
- **Attendance:** for the selected duty, one row per volunteer with a two-state toggle Present / Absent; on tap the row shows the server-recorded timestamp ("Marked present 10:42:07 by you"). Undo within 60 s writes a new log row (history is append-only).
- **Scores:** competition picker → editable table (team, time mm:ss.ms or points, extra metrics) with inline save and toast "Leaderboard updated".

### Super Admin dashboard
- **Coordinators & duties** (implemented in `DutyAssignmentPanel`): assign coordinator by college UID; allocate high-level duty; duties table.
- **Registrations:** filter by university, payment status, facility; open ID proof in a modal (60 s signed image, watermark "Admin view"); change payment status.
- **Announcements, Competitions, Audit log.**

### Leaderboard component
- Table on desktop, stacked cards on mobile. Columns: Rank (medal for top 3), Team/Participant, Score (or time formatted `mm:ss.SSS`), extra metrics (collapsible).
- Updated-at indicator ("Updated 3 s ago") and gentle row highlight when a value changes; `aria-live="polite"` region announces "Team X moved to rank 2".
- Empty state: "Results will appear here once the round starts."

## 4. States & feedback
Every data view has loading skeleton, empty, error-with-retry, and success states. Destructive/irreversible actions (role change, payment status) use a confirm dialog naming the target. Toasts for background saves; inline messages for validation.

## 5. Accessibility (WCAG 2.1 AA)
Labels tied to inputs; visible focus ring; colour never the only signal (icons/text on status pills); contrast ≥ 4.5:1; fieldset/legend on Yes/No groups; errors via `role="alert"`; keyboard-operable drawers/modals with focus trap; touch targets ≥ 44 px; respects `prefers-reduced-motion`.

## 6. Responsive rules
Breakpoints 360 / 640 / 1024 / 1280. Tables scroll horizontally in their own container on small screens; forms are single column < 640 px; dashboards use a top tab bar on mobile and a left sidebar ≥ 1024 px.

## 7. Content & copy
Plain language, INR with Indian grouping (₹1,25,000 not ₹125,000), 12-hour times with timezone note if event spans zones, gender-neutral wording. Privacy microcopy near ID upload and phone number.

## 8. Deliverables requested from design
Figma flows for the 4 roles, component library (form controls, status pill, data table, drawer, toast, leaderboard row), empty/error states, and a mobile prototype of registration.
