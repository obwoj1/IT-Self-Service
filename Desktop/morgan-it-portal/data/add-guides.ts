// Run this to add new guides to an existing DB without wiping any data.
// npx ts-node --project tsconfig.seed.json data/add-guides.ts
import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

interface NewIssue {
  category: string;
  title: string;
  slug: string;
  summary: string;
  keywords: string[];
  steps: { n: number; instruction: string; note: string | null }[];
}

const newGuides: NewIssue[] = [
  {
    category: "canvas-courses",
    title: "Access Panopto Lecture Recordings",
    slug: "access-panopto-recordings",
    summary: "Watch recorded lectures posted by your professor through Panopto on Canvas.",
    keywords: ["panopto", "lecture", "recording", "video", "watch", "canvas", "replay"],
    steps: [
      { n: 1, instruction: "Log into Canvas at morgan.instructure.com and open the course", note: null },
      { n: 2, instruction: "Look for a 'Panopto Recordings' or 'Lecture Recordings' link in the course navigation on the left sidebar", note: "If you don't see it, check under Modules — professors often post recordings there." },
      { n: 3, instruction: "Click the link — Panopto will load inside Canvas. Sign in with your Morgan credentials if prompted", note: null },
      { n: 4, instruction: "Find the recording you want and click the play button — videos stream directly in the browser", note: null },
      { n: 5, instruction: "If a video shows 'Access Denied', the professor may not have shared it yet — email them directly", note: null },
      { n: 6, instruction: "You can also go directly to morgan.hosted.panopto.com and sign in with your Morgan email to see all shared recordings", note: null },
    ],
  },
  {
    category: "duo-mfa",
    title: "Add a New Device to Duo",
    slug: "add-new-device-duo",
    summary: "Got a new phone or need to add a second device to Duo? Do it here.",
    keywords: ["duo", "new phone", "new device", "mfa", "2fa", "switch", "replace", "authentication"],
    steps: [
      { n: 1, instruction: "Log into morgan.edu — when Duo prompts you for authentication, look for 'Add a new device' or 'Manage devices' (the link may say 'Other options')", note: null },
      { n: 2, instruction: "If you still have your old phone, approve the Duo push on it first, then click 'Manage Devices' from inside the Duo prompt", note: "If you no longer have your old phone, call the IT Help Desk at (443) 885-4357 — they can reset your Duo enrollment." },
      { n: 3, instruction: "Click 'Add a device' and select 'Mobile phone'", note: null },
      { n: 4, instruction: "Enter your new phone number and confirm it", note: null },
      { n: 5, instruction: "Install the Duo Mobile app on your new phone from the App Store or Google Play", note: null },
      { n: 6, instruction: "Click 'I have Duo Mobile installed' and scan the QR code shown on screen", note: null },
      { n: 7, instruction: "Your new device is now enrolled. You can remove the old device from the 'My Settings & Devices' page in Duo", note: null },
    ],
  },
  {
    category: "banner-registration",
    title: "Check Financial Aid Status",
    slug: "check-financial-aid-status",
    summary: "How to view your financial aid awards, disbursements, and outstanding requirements.",
    keywords: ["financial aid", "fafsa", "aid", "scholarship", "award", "disbursement", "banner", "websis"],
    steps: [
      { n: 1, instruction: "Log into myMSU at morgan.edu with your Morgan credentials", note: null },
      { n: 2, instruction: "Navigate to WebSIS / Banner Self-Service from your dashboard", note: null },
      { n: 3, instruction: "Click 'Financial Aid' from the main menu", note: null },
      { n: 4, instruction: "Select the aid year you want to review and click Submit", note: null },
      { n: 5, instruction: "Click 'Award Overview' to see all grants, loans, and scholarships offered to you for that year", note: "Loans will not disburse until you accept them and complete entrance counseling and an MPN at studentaid.gov." },
      { n: 6, instruction: "Click 'Student Requirements' to see if any documents are still owed — unsatisfied requirements can hold your aid", note: null },
      { n: 7, instruction: "For questions about specific awards or missing aid, contact the Financial Aid Office at finaid@morgan.edu", note: null },
    ],
  },
  {
    category: "computer-labs",
    title: "Access Adobe Creative Cloud on Campus",
    slug: "access-adobe-creative-cloud",
    summary: "Use Photoshop, Illustrator, Premiere, and other Adobe apps on campus computers.",
    keywords: ["adobe", "photoshop", "illustrator", "premiere", "creative cloud", "design", "software", "lab"],
    steps: [
      { n: 1, instruction: "Morgan State has an Adobe Creative Cloud license for students through the MEEC agreement — you can use it on lab computers and install it on your personal device", note: null },
      { n: 2, instruction: "On a lab computer: open any Adobe app from the Start menu or Applications folder — it should open directly since lab machines are already licensed", note: null },
      { n: 3, instruction: "On your personal device: go to adobe.com and click 'Sign in' — use your Morgan email (username@morgan.edu) as the sign-in address", note: null },
      { n: 4, instruction: "You will be redirected to Morgan's SSO login page — enter your myMSU password and complete Duo MFA", note: null },
      { n: 5, instruction: "Once signed in, click your profile icon → 'Creative Cloud app' → Install the Creative Cloud desktop app", note: null },
      { n: 6, instruction: "From the Creative Cloud desktop app, install any Adobe apps you need (Photoshop, Illustrator, Premiere Pro, etc.)", note: "If you get an 'Not entitled' error, contact servicedesk@morgan.edu with your Morgan email and student ID." },
    ],
  },
];

async function addGuides() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let added = 0;
    for (const guide of newGuides) {
      const catRes = await client.query(`SELECT id FROM categories WHERE slug = $1`, [guide.category]);
      if (catRes.rows.length === 0) {
        console.warn(`Category not found: ${guide.category} — skipping ${guide.slug}`);
        continue;
      }
      const catId = catRes.rows[0].id;
      const existing = await client.query(`SELECT id FROM issues WHERE slug = $1`, [guide.slug]);
      if (existing.rows.length > 0) {
        console.log(`Already exists: ${guide.slug} — skipping`);
        continue;
      }
      const { rows } = await client.query(
        `INSERT INTO issues (category_id, title, slug, summary, keywords) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [catId, guide.title, guide.slug, guide.summary, guide.keywords]
      );
      const issueId = rows[0].id;
      for (const step of guide.steps) {
        await client.query(
          `INSERT INTO steps (issue_id, step_number, instruction, note) VALUES ($1,$2,$3,$4)`,
          [issueId, step.n, step.instruction, step.note]
        );
      }
      console.log(`✅ Added: ${guide.title}`);
      added++;
    }
    await client.query("COMMIT");
    console.log(`\nDone — ${added} guide(s) added.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

addGuides();
