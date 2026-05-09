# Morgan State University — IT Support Tool

A full-stack web portal that lets Morgan State students, staff, and faculty resolve common IT issues on their own — no commute to the IT desk required. Users search for their problem and get clear, step-by-step resolution guides built specifically for Morgan State's systems.

---

## Why This Exists

Morgan State's IT Help Desk handles hundreds of repeat questions every semester — password resets, WiFi setup, Duo MFA enrollment, lab computer issues. Most of these have a fixed answer. This portal puts those answers online, available 24/7, searchable, and written in plain language. The long-term vision is to also handle unknown issues by connecting to an AI that searches the web in real time and generates a solution.

---

## Live Demo

> Deployment coming — see setup instructions below to run locally.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Full-stack in one repo, server components, file-based routing |
| Styling | Tailwind CSS | Utility-first, fast to build, easy to maintain |
| Database | PostgreSQL via Supabase | Free tier, real-time dashboard, IPv4-compatible pooler |
| DB Client | `pg` (node-postgres) | Lightweight, works with any Postgres host |
| Deployment | Vercel (planned) | Zero-config Next.js deployment, pairs with Supabase |

---

## Features Built

- **Search** — full-text search across issue titles, summaries, and keywords
- **Category browsing** — 6 categories with issue counts, clickable to filter
- **Step-by-step guides** — 7 complete issue guides with numbered steps and tip boxes
- **AI search fallback** — when no DB result is found, Claude (`claude-opus-4-7`) generates a step-by-step guide on the fly; response is cached in PostgreSQL so repeat queries return instantly
- **"Still need help?" CTA** — IT Help Desk number on every issue page
- **"Was this helpful?" UI** — feedback buttons on every issue page
- **Morgan State branding** — official blue (`#003366`) and orange (`#FF6600`), Google Fonts
- **Fully responsive** — mobile-first layout, works on all screen sizes
- **Mock data fallback** — app shows content even without a database connection (dev-friendly)
- **Real database** — PostgreSQL on Supabase, seeded with all 7 guides
- **Security hardened** — HTTP security headers, rate limiting on the AI route, input validation on all search queries

---

## Current Issue Categories & Guides

| Category | Guides |
|---|---|
| Passwords & Login | Reset myMSU Password |
| Computer Labs | Can't Log Into a Lab Computer |
| Campus WiFi | Connect to Eduroam, Connect to MSU-Guest |
| Email & Google Workspace | Access Morgan Student Email (Gmail) |
| Duo & MFA | Set Up Duo MFA |
| Printing | Print on Campus |

---

## Security

| Layer | Implementation | Why |
|---|---|---|
| HTTP headers | `next.config.mjs` — applied to every route | Blocks clickjacking (`X-Frame-Options: DENY`), MIME sniffing, enforces HTTPS, restricts what the browser can load via CSP |
| Rate limiting | `lib/rate-limit.ts` — 10 AI requests/IP/minute on `/api/ai-search` | Prevents API credit abuse; returns `429` with `Retry-After: 60` |
| Input validation | `app/search/page.tsx` + AI route — queries capped at 200 chars | Prevents oversized prompts from reaching Claude or the database |
| Parameterized queries | All DB queries use `$1, $2` placeholders | SQL injection is structurally impossible |
| `.env.local` gitignored | `DATABASE_URL` and `ANTHROPIC_API_KEY` never leave the machine | Secrets never touch the repo |

---

## What's Missing (Next Steps)

### High Priority
- **AI web search fallback** — when a user searches something not in the database, call the Claude API (or Tavily) to search the web and generate a real-time answer specific to Morgan State
- **Admin panel** — a password-protected page to add, edit, and delete issue guides without touching code
- **Vercel deployment** — get the site live at a public URL

### Medium Priority
- **More guides** — VPN setup, Banner/WebSIS navigation, Canvas troubleshooting, software installs, Panopto, Google Drive storage
- **Feedback backend** — actually store "Was this helpful?" Yes/No votes in the database so IT staff can see which guides need improvement
- **Category pages** — dedicated URLs like `/category/campus-wifi` instead of query params

### Nice to Have
- **Analytics** — track which issues are searched most (helps IT prioritize what to document)
- **Related guides** — show 2-3 related issues at the bottom of each guide page
- **Dark mode**
- **Morgan State logo** in the header

---

## Local Setup

### 1. Clone and install
```bash
git clone https://github.com/obwoj1/IT-Self-Service.git
cd morgan-it-portal
npm install
```

### 2. Set up database (Supabase)
1. Go to [supabase.com](https://supabase.com) and create a free project
2. Go to **Settings → Database → Connection String → Session Pooler**
3. Copy the connection string (use Session Pooler for IPv4 compatibility)
4. Create `.env.local`:
```
DATABASE_URL=postgresql://postgres.YOURREF:YOURPASSWORD@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

### 3. Seed the database
```bash
npx ts-node --project tsconfig.seed.json data/seed.ts
```
You should see: `✅ Database seeded successfully.`

### 4. Run the dev server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

1. Push to GitHub (`obwoj1/IT-Self-Service`)
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Select the repo
4. Add environment variable: `DATABASE_URL` = your Supabase Session Pooler string
5. Click Deploy

---

## IT Help Desk

**Phone:** (443) 885-4357 (443-885-HELP)
**Email:** servicedesk@morgan.edu
**Hours:** Monday–Friday, 8AM–5PM
**Portal:** morgan.edu/servicedesk
