# CONTEXT — Morgan State IT Self-Service Portal

**Purpose of this file:** the project timeline, current status, and open threads — the things
that used to live only in Claude Code session transcripts. Those transcripts were auto-deleted
by the 30-day cleanup (recovered summary written 2026-08-04), so this file is now the record.

**Read order:** `README.md` (what it does) → this file (where it stands) →
`DEVNOTES.md` (architecture, file-by-file, security, bug post-mortems).

---

## Status as of 2026-08-04

**Live:** https://it-self-service.vercel.app — deployed and working.
**Repo:** personal GitHub (`obwoj1`). Push to `main` auto-deploys via Vercel.
**State:** feature-complete for the original spec. No known broken functionality.
**Not a course project** — this is personal/portfolio work. (MarketMind was the COSC 459 project.)

### Last work done (most recent commits, newest first)
1. `2d19613` Update README to reflect analytics recent searches and search loading state
2. `1953ee9` Add Recent Searches feed to analytics page with timestamps
3. `e8e86c8` Add loading state to search bar while results load
4. `9524ee6` Fix analytics not storing: `await` `recordSearch` and `recordView` calls
5. `f148251` Fix admin login: use full navigation to bypass Next.js router cache

---

## Timeline (reconstructed from prompt history)

### 2026-05-02 — Project start
Built from `morgan-it-portal-spec.md`. Next.js 14 App Router scaffold, git initialized,
pushed same day. Product name settled as a generic "IT Support Tool" rather than
Morgan-State-branded in the description.

### 2026-05-04 — Content correctness pass
Corrected the domain (`morgan.edu`, **not** `my.morgan.edu`) and modeled the real student
entry point: **MyMSU**, reached from morgan.edu, which fronts email, Canvas, and
Banner/WebSIS. Database platform evaluated (Firebase vs Postgres vs AWS) → chose Postgres.

### 2026-05-06 — Database + AI search
Supabase Postgres wired up. Hit the **IPv4/connection-pooling issue** — the direct
`db.<ref>.supabase.co` connection string doesn't work from IPv4-only environments; the
**pooler string** (`aws-1-us-east-1.pooler.supabase.com`) is the one that works. Use the
pooler string.

Shipped the headline feature: **AI search fallback** — when no guide matches the query,
Claude generates one live and the result is **cached in Postgres**, so the next person asking
the same question gets an instant DB hit instead of an API call. (This is the feature worth
leading with when presenting the project: it's a real latency + cost reduction, not a gimmick.)

Docs convention set here: a public `README.md` plus a detailed developer doc for AI/human
pickup.

### 2026-05-09 — Deploy + UI + admin
Deployed to Vercel (initial 404 resolved; env vars must be set in the Vercel dashboard, not
just `.env.local`). UI modernized — kept the Morgan color scheme, replaced emoji with real
icons. **"AI-powered search" label placed under the search bar, orange icon** (explicitly not
purple — this was corrected twice; keep it). Removed the "9 categories / 13 guides" counter
from the homepage. Admin panel added (password via env var).

### 2026-05-09 → 05-10 — The login bugs
Two separate bugs, both now documented in `DEVNOTES.md` (Issues 2 and 3):
- Login hung on "Signing in…" — `handleSubmit` had no try/catch, so a network error never
  cleared the loading state.
- Login worked **only with DevTools open** — the Next.js App Router had prefetched and cached
  the middleware redirect from `/admin` → `/admin/login`. Fixed by using
  `window.location.href` for a full navigation instead of `router.push`.

### 2026-05-17 → 05-18 — Analytics
Admin-only analytics: what people are actually searching for. Initially **searches weren't
being stored** — the `recordSearch` / `recordView` calls weren't awaited. Fixed. Verified the
analytics numbers are real DB data, not placeholder content.

### Later — polish
Recent Searches feed with timestamps; search bar loading state; README updated to match.

---

## Open threads / what's left

- **Morgan State logo** — still text-only in the header; deliberately deferred ("don't add
  the Morgan logo just yet"). Never revisited.
- **`DEVNOTES.md` "What's Left to Build" is stale** — it lists *Related guides* and
  *Analytics* as pending, but both shipped. Only the logo item is still real. Fix that list
  when next in the file.
- **Repo hygiene** — the portal has no CHANGELOG; this file now covers that role.

## Conventions (from how this was actually built)

- **Commit small and often**, push after each minor change — this was a standing instruction
  throughout the project.
- **Never add Claude as a co-author** on commits without being asked.
- Secrets (`ANTHROPIC_API_KEY`, `ADMIN_PASSWORD`, database URL) live in `.env.local` and the
  Vercel dashboard — never committed.
- Use the Supabase **pooler** connection string.
