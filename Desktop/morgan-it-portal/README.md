# Morgan State University — IT Support Tool

A full-stack IT self-service web portal for Morgan State University. Students, staff, and faculty can search for common IT issues and get step-by-step resolution guides without visiting the IT Help Desk.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **Database:** PostgreSQL via `pg`
- **Deployment:** Vercel
- **DB Hosting:** Neon.tech (free tier)

## Local Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/obwoj1/morgan-it-portal.git
   cd morgan-it-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` and add your PostgreSQL connection string:
   ```
   DATABASE_URL=your_postgres_connection_string_here
   ```
   Get a free database at [neon.tech](https://neon.tech).

4. Seed the database:
   ```bash
   npx ts-node data/seed.ts
   ```

5. Run the dev server:
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

## Deployment

1. Push to GitHub (`obwoj1/morgan-it-portal`)
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Select `morgan-it-portal`
4. Add `DATABASE_URL` environment variable in Vercel project settings
5. Click Deploy

Live site: [morgan-it-portal.vercel.app](https://morgan-it-portal.vercel.app) *(update once deployed)*

## Screenshots

*(Add screenshots here)*
