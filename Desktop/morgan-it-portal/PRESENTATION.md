# Morgan State IT Portal — Full Project Walkthrough

Built by Obaloluwa Wojuade (obwoj1), Spring 2026.  
Live at: https://it-self-service.vercel.app  
Repo: https://github.com/obwoj1/IT-Self-Service

---

## The Problem

Morgan State's IT Help Desk handles hundreds of repeat questions every semester — password resets, WiFi setup, Duo MFA enrollment, lab computer issues. Most of these have a fixed answer. Students have to physically go to the desk or call during business hours to get information that could be online. This portal fixes that.

---

## Technology Stack — Every Choice Explained

### Next.js 14 (App Router)
Full-stack framework that handles both the frontend and backend in a single repository. Using the App Router means pages are server components by default — data is fetched on the server at request time, no loading spinners, no client-side data fetching for things that don't need it. Only components that require browser APIs (search input, dark mode toggle, feedback buttons) are marked `"use client"`.

### Tailwind CSS
Utility-first CSS. No separate stylesheet to maintain. Every design decision lives directly on the element. Custom colors `morgan-blue` (#003366) and `morgan-orange` (#FF6600) are defined in `tailwind.config.ts` and used as first-class tokens throughout.

### PostgreSQL via Supabase
Relational database hosted on Supabase's free tier. Using the `pg` (node-postgres) package directly rather than the Supabase JS client — this was a course requirement and also keeps the database layer simple and portable. Connection goes through Supabase's Session Pooler (not the direct connection) because the free tier's direct connection is IPv6-only and most home/campus networks are IPv4.

### Anthropic SDK — Claude claude-opus-4-7
When a user searches for something not in the database, the app calls Claude via the official `@anthropic-ai/sdk` package. The system prompt is cached using `cache_control: { type: "ephemeral" }` — this tells Anthropic's servers to cache the large Morgan State context block so repeated calls don't re-process it, reducing API cost. Claude returns structured JSON (title, summary, steps array) which is parsed and stored in PostgreSQL.

### Vercel
Zero-config deployment for Next.js. Connected to the GitHub repo — every push to `main` triggers an automatic redeploy. Environment variables (database URL, API key, admin credentials) are set in the Vercel dashboard, never in the code.

---

## Architecture

```
Browser request
     ↓
Vercel Edge (middleware.ts runs here — checks admin auth before any page renders)
     ↓
Next.js App Router (server components by default)
     ↓
lib/issues.ts  →  lib/db.ts (pg Pool → Supabase PostgreSQL)
lib/ai-cache.ts  →  Anthropic SDK → Claude claude-opus-4-7
lib/analytics.ts  →  analytics table in PostgreSQL
```

Server components fetch data directly — no REST API round-trips for the browser. API routes (`/api/...`) exist only for client components that need to POST data (feedback votes, admin login/logout, admin CRUD) and for external consumers.

---

## Database Schema

```sql
categories (id, name, slug, icon, description)
issues     (id, category_id→categories, title, slug, summary, keywords TEXT[], created_at)
steps      (id, issue_id→issues, step_number, instruction, note)
feedback   (id, issue_slug TEXT, vote TEXT CHECK('yes','no'), created_at)
ai_responses (id, query, normalized_query UNIQUE, response JSONB, hit_count, created_at, last_accessed)
analytics  (id, event_type TEXT CHECK('search','view'), value TEXT, created_at)
```

`keywords` is a native PostgreSQL `TEXT[]` array — searched using `unnest()` in a subquery so the LIKE check runs against each keyword individually. `feedback` and `ai_responses` and `analytics` are created automatically with `CREATE TABLE IF NOT EXISTS` inside their respective lib functions — no manual migration needed.

---

## Features — In Depth

### Search
`lib/issues.ts → searchIssues(query)` runs a LIKE query against `title`, `summary`, and each element of the `keywords` array. Query is capped at 200 characters before it touches the database. Results render as `IssueCard` components.

### AI Search Fallback
`lib/ai-cache.ts → getAiAnswer(query)` is the full flow:
1. Query is normalized (lowercase, trimmed, whitespace collapsed)
2. Check `ai_responses` table — if a match exists, atomically increment `hit_count` with a single `UPDATE ... RETURNING` statement and return the cached result instantly
3. On cache miss, call `claude-opus-4-7` with a Morgan State system prompt (cached at Anthropic's end via `cache_control`)
4. Claude returns JSON — parse it, store in `ai_responses`, return with `from_cache: false`
5. If the API key is missing or malformed (not starting with `sk-ant-`), the function fast-fails and returns `null` — the page falls through to the "no results" state gracefully

The `AiResultCard` component shows purple styling to visually distinguish AI results from database results, and displays a "Cached · N lookups" badge when the result came from the cache.

### Category Pages
Dedicated URL per category: `/category/campus-wifi`, `/category/duo-mfa`, etc. `lib/issues.ts → getIssuesByCategory(slug)` fetches the category metadata and all its issues. `CategoryCard` links to these dedicated URLs instead of using query params.

### Related Guides
At the bottom of every issue page. `getRelatedIssues(slug, categoryId, keywords)` queries for other issues from the same category OR with overlapping keywords, ordered so same-category results appear first. Limited to 3.

### Dark Mode
Tailwind's `class` strategy — toggling the `dark` class on `<html>` activates all `dark:` variants across every component. `ThemeProvider` (client component wrapping the entire app) reads `localStorage` on mount, falls back to `prefers-color-scheme`, and applies the class. The toggle button in the header uses a `Moon`/`Sun` icon from lucide-react.

### Feedback
`FeedbackButtons` (client component) POSTs `{ slug, vote }` to `/api/feedback`. The API validates both fields, then inserts into the `feedback` table (auto-created on first use). Three UI states: idle (buttons), loading (disabled), done (confirmation message). Failure is silently swallowed — feedback is non-critical.

### Analytics
Every search query is recorded by `recordSearch(q)` in `app/search/page.tsx`. Every issue page view is recorded by `recordView(slug)` in `app/issue/[slug]/page.tsx`. Both write to the `analytics` table. The admin Analytics page queries top 10 searches, top 10 viewed guides, and all feedback votes per guide.

### Admin Panel
Cookie-based authentication — no external auth library. Two environment variables: `ADMIN_PASSWORD` (the password) and `ADMIN_SECRET` (a random string stored in the cookie). `middleware.ts` runs at the Edge before any `/admin/**` page renders and compares the `admin_session` cookie value to `ADMIN_SECRET`. Login sets the cookie; logout clears it.

The admin dashboard shows all guides grouped by category. Each guide has Edit and Delete buttons. `IssueForm` is a shared client component used for both New and Edit — it auto-generates the slug from the title on new guides and manages a dynamic step list.

---

## Security — Every Layer

| Layer | What it does |
|---|---|
| HTTP headers (`next.config.mjs`) | `X-Frame-Options: DENY` (clickjacking), `X-Content-Type-Options: nosniff` (MIME attacks), `Strict-Transport-Security` (HTTPS enforcement), CSP (whitelists Google Fonts, blocks inline scripts) |
| Rate limiting (`lib/rate-limit.ts`) | Module-level `Map` tracking IP → request count. 10 AI requests/IP/minute on `/api/ai-search`. Returns `429` with `Retry-After: 60` on breach. In-memory only — resets on cold start, sufficient for this use case |
| Input validation | Search queries capped at 200 chars before DB or Claude. Admin API routes validate required fields. `vote` field in feedback checked against an allowlist |
| Parameterized queries | Every single DB query uses `$1, $2` placeholders — SQL injection is structurally impossible |
| Secret management | `DATABASE_URL`, `ANTHROPIC_API_KEY`, `ADMIN_PASSWORD`, `ADMIN_SECRET` all live in `.env.local` (gitignored locally) and Vercel environment variables (never in code) |
| Admin auth | httpOnly cookie (not readable by JavaScript), `secure` flag in production (HTTPS only), 7-day expiry, Edge middleware validates on every request before any page renders |

---

## Bugs and Issues Faced — Every One

### 1. AI search silently failing (placeholder API key)
**Problem:** `.env.local` had `your_api_key_here` as the `ANTHROPIC_API_KEY` value. The check `if (!process.env.ANTHROPIC_API_KEY)` passed because the string was truthy. The Anthropic SDK then threw an authentication error which got swallowed by the catch block. AI search returned `null` with no indication of why.

**Fix:** Added `!apiKey.startsWith("sk-ant-")` to the validation check. Added `console.error("[ai-cache] Error:", err)` in the catch so future failures surface in Vercel logs.

**Lesson:** Truthy checks on env vars aren't enough when a placeholder value is valid as a string.

---

### 2. Vercel deploying from the wrong directory
**Problem:** The git repository is rooted at `/Users/obaw` (the home folder), not inside `morgan-it-portal`. All committed files appear in git as `Desktop/morgan-it-portal/package.json`, `Desktop/morgan-it-portal/app/...` etc. Vercel defaulted to building from the repo root — it found no `package.json` there and either failed or served nothing.

**Fix:** In Vercel → Project Settings → General → Root Directory, set it to `Desktop/morgan-it-portal`. This tells Vercel to treat that subdirectory as the project root.

**Lesson:** When your git repo root doesn't match your project root, every deployment platform needs to be told where to look.

---

### 3. `git add -A` sweeping the entire home folder
**Problem:** Because the git repo is at `/Users/obaw`, running `git add -A` from inside the project folder tried to stage everything in the home directory — `.ssh`, system files, other projects, downloads. This was dangerous and also produced a massive index.

**Fix:** Always specify exact file paths when staging: `git add Desktop/morgan-it-portal/components/Header.tsx`. Never use `-A` or `.` in this repo.

---

### 4. `.git/index.lock` left by a failed `git add`
**Problem:** A failed `git add -A` attempt left a lock file at `/Users/obaw/.git/index.lock`. Subsequent git commands failed with "Another git process seems to be running."

**Fix:** `rm /Users/obaw/.git/index.lock`. Safe to do once you confirm no git process is actually running.

---

### 5. Stale webpack chunk after adding new files
**Problem:** After adding several new files, the dev server threw `Cannot find module './948.js'`. The `.next` build cache had chunk references from before the new files were added, and the chunk numbering shifted.

**Fix:** `pkill -f "next dev"` to kill the server, then `rm -rf .next && npm run dev` to rebuild from scratch.

---

### 6. `tsconfig.seed.json` needed for the seed script
**Problem:** The main `tsconfig.json` uses `"module": "esnext"` for Next.js, which is incompatible with ts-node's CommonJS require system. Running `npx ts-node data/seed.ts` failed with module-related errors.

**Fix:** Created a separate `tsconfig.seed.json` with `"module": "commonjs"` used only by the seed script. The seed command becomes: `npx ts-node --project tsconfig.seed.json data/seed.ts`.

---

### 7. File paths with `[slug]` breaking bash glob expansion
**Problem:** Running `git add Desktop/morgan-it-portal/app/issue/[slug]/page.tsx` failed because bash interpreted `[slug]` as a character class glob and found no match.

**Fix:** Quote the path: `git add "Desktop/morgan-it-portal/app/issue/[slug]/page.tsx"`. Same applies to any directory containing brackets.

---

### 8. Dark mode flash on page load
**Problem:** ThemeProvider reads `localStorage` inside a `useEffect` — on the first render (before the effect runs) the page always shows in light mode, even if the user had dark mode saved. This causes a visible flash.

**Fix:** Added `suppressHydrationWarning` to `<html>` in `app/layout.tsx`. This tells React not to warn about the mismatch between server-rendered HTML (always light) and the client after the effect applies the dark class.

---

### 9. `git add` on `Desktop/morgan-it-portal/app/category/[slug]/page.tsx` failing
**Problem:** Same bracket-glob issue as #7, but for the category route added later.

**Fix:** Same solution — quote the path in the git command.

---

## Every File — What It Does

| File | Purpose |
|---|---|
| `lib/db.ts` | Single shared `pg.Pool` instance. SSL always on (Supabase requires it). Pool reuses connections across serverless invocations. |
| `lib/issues.ts` | All DB queries: `getAllCategories`, `getAllIssues`, `searchIssues`, `getIssueBySlug`, `getIssuesByCategory`, `getRelatedIssues`. Full mock data fallback when DB is not configured. |
| `lib/ai-cache.ts` | AI fallback: normalize query → check cache → call Claude → store result. Prompt caching via `cache_control`. |
| `lib/rate-limit.ts` | In-memory Map rate limiter. `rateLimit(ip, max, windowMs)` returns bool. `getClientIp` reads `x-forwarded-for` first. |
| `lib/analytics.ts` | `recordSearch`, `recordView`, `getTopSearches`, `getTopViews`, `getTotalCounts`, `getFeedbackStats`. All tables auto-created. |
| `lib/category-icons.ts` | Maps category slugs to lucide-react icon components. Keeps icon logic out of the DB. |
| `middleware.ts` | Edge middleware — runs before every `/admin/**` request. Compares cookie to `ADMIN_SECRET`. Redirects to login if missing or wrong. |
| `data/seed.ts` | Standalone script — creates tables, truncates, reinserts all categories, issues, and steps in a transaction. For fresh installs. |
| `data/add-guides.ts` | Additive insert script — adds new guides to an existing DB using `ON CONFLICT DO NOTHING`. Safe to run without wiping data. |
| `app/layout.tsx` | Root layout. Wraps everything in `ThemeProvider`. Renders `Header` and `Footer`. |
| `app/page.tsx` | Home page. Fetches categories. Renders search bar + category grid. |
| `app/search/page.tsx` | Search results. Reads `?q=`, runs DB search, falls back to AI, records the search query in analytics. |
| `app/issue/[slug]/page.tsx` | Individual guide. Fetches issue + steps + related guides. Records view in analytics. |
| `app/category/[slug]/page.tsx` | Category page. Fetches category metadata + all its issues. |
| `app/admin/page.tsx` | Admin dashboard. Lists all guides grouped by category with Edit/Delete. |
| `app/admin/analytics/page.tsx` | Admin analytics. Top searches, top views, feedback scores per guide. |
| `app/admin/issues/new/page.tsx` | Create guide page. Renders `IssueForm` with no initial data. |
| `app/admin/issues/[id]/edit/page.tsx` | Edit guide page. Fetches issue by numeric ID, pre-fills `IssueForm`. |
| `app/admin/login/page.tsx` | Login page. Posts to `/api/admin/login`. |
| `components/ThemeProvider.tsx` | Client component. Reads `localStorage` + `prefers-color-scheme`, applies `dark` class to `<html>`, provides toggle. |
| `components/DarkModeToggle.tsx` | Moon/Sun icon button. Uses `useTheme()` from ThemeProvider. |
| `components/Header.tsx` | Sticky morgan-blue header. Contains brand name + phone number + dark mode toggle. |
| `components/Footer.tsx` | Minimal footer. IT Help Desk number + subtle Admin link. |
| `components/SearchBar.tsx` | Client component (needs router). Orange "Search" button inside input. AI-powered label underneath. |
| `components/CategoryCard.tsx` | Links to `/category/[slug]`. Icon from `categoryIconMap`. |
| `components/IssueCard.tsx` | Links to `/issue/[slug]`. Category badge, title, summary, chevron. |
| `components/AiResultCard.tsx` | Purple styling for AI results. "Cached · N lookups" badge. |
| `components/RelatedGuides.tsx` | 2–3 related issue links. Shown between feedback buttons and help CTA. |
| `components/FeedbackButtons.tsx` | Three states: idle / loading / done. Posts to `/api/feedback`. |
| `components/IssueForm.tsx` | Shared form for new and edit. Auto-generates slug. Dynamic step list. |
| `components/DeleteIssueButton.tsx` | Two-stage delete. Confirm then execute. Calls `router.refresh()`. |
| `components/AdminNav.tsx` | Admin-only nav bar. Dashboard + Analytics + New Guide + Logout. |

---

## What I Would Add Next

- **Morgan State logo** in the header — replace the text wordmark with the official image
- **Open Graph tags** per guide — so sharing a link in Discord/iMessage previews the guide title and summary
- **Upstash Redis rate limiting** — replaces the in-memory Map so rate limits persist across serverless cold starts
- **Email alerts** — notify `servicedesk@morgan.edu` when a new AI result gets cached (so IT staff can review and turn it into a proper guide)
- **More guides** — VPN troubleshooting, Banner holds, library database access, software downloads
