# Morgan State University — IT Self-Service Portal

A full-stack web portal that lets Morgan State students, staff, and faculty resolve common IT issues on their own — 24/7, no wait, no commute to the IT desk.

**Live:** [it-self-service.vercel.app](https://it-self-service.vercel.app)

---

## What It Does

Students type their IT problem into a search bar. If a guide exists in the database, they get it instantly. If nothing matches, Claude AI generates a step-by-step solution on the fly and caches it so the next person with the same question gets an instant answer.

---

## Key Features

- **Smart search** — full-text search across all guides by title, summary, and keywords
- **AI fallback** — when no guide matches, Claude (`claude-opus-4-7`) generates one in real time; response is cached in PostgreSQL so repeat queries are instant
- **18 step-by-step guides** across 9 categories (WiFi, Canvas, Banner, Duo MFA, Printing, VPN, Adobe CC, and more)
- **Category pages** — dedicated URLs for every category (e.g. `/category/campus-wifi`)
- **Related guides** — each issue page surfaces 2–3 related guides automatically
- **Dark mode** — system preference detection + toggle in the header, persisted to localStorage
- **Feedback** — "Was this helpful?" Yes/No on every guide, votes stored in PostgreSQL
- **Admin panel** — password-protected dashboard at `/admin` to add, edit, and delete guides without touching code
- **Analytics** — admin can see top searches, most viewed guides, and feedback scores per guide
- **Morgan State branding** — official blue (`#003366`) and orange (`#FF6600`) throughout
- **Fully responsive** — works on mobile, tablet, and desktop
- **Security hardened** — HTTP headers, rate limiting on the AI route, input validation, parameterized queries

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend / Backend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Supabase |
| AI | Claude API (`claude-opus-4-7`) via Anthropic SDK |
| Deployment | Vercel |

---

## IT Help Desk

**Phone:** (443) 885-4357  
**Email:** servicedesk@morgan.edu  
**Hours:** Monday–Friday, 8AM–5PM
