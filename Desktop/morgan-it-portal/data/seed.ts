import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        icon VARCHAR(50),
        description TEXT
      );
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES categories(id),
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        summary TEXT,
        keywords TEXT[],
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS steps (
        id SERIAL PRIMARY KEY,
        issue_id INTEGER REFERENCES issues(id),
        step_number INTEGER NOT NULL,
        instruction TEXT NOT NULL,
        note TEXT
      );
    `);

    await client.query(`TRUNCATE steps, issues, categories RESTART IDENTITY CASCADE`);

    const categories = [
      { name: "Passwords & Login", slug: "passwords-login", icon: "🔐", description: "Reset passwords and fix login issues" },
      { name: "Computer Labs", slug: "computer-labs", icon: "🖥️", description: "Lab computer access and problems" },
      { name: "Campus WiFi", slug: "campus-wifi", icon: "📶", description: "Connect to MSU networks" },
      { name: "Email & Microsoft 365", slug: "email-m365", icon: "📧", description: "Morgan email and Office apps" },
      { name: "Duo & MFA", slug: "duo-mfa", icon: "📱", description: "Multi-factor authentication setup" },
      { name: "Printing", slug: "printing", icon: "🖨️", description: "Print on campus" },
    ];

    const catIds: Record<string, number> = {};
    for (const cat of categories) {
      const { rows } = await client.query(
        `INSERT INTO categories (name, slug, icon, description) VALUES ($1,$2,$3,$4) RETURNING id`,
        [cat.name, cat.slug, cat.icon, cat.description]
      );
      catIds[cat.slug] = rows[0].id;
    }

    const issues = [
      {
        category: "passwords-login",
        title: "Reset myMSU Password",
        slug: "reset-mymsu-password",
        summary: "Can't log into myMSU? Reset your password here.",
        keywords: ["password", "mymsu", "login", "forgot", "reset", "portal"],
        steps: [
          { n: 1, instruction: "Go to morgan.edu", note: null },
          { n: 2, instruction: 'Click "Forgot Password?" below the login form', note: null },
          { n: 3, instruction: "Enter your Morgan State email address (e.g. obwoj1@morgan.edu)", note: null },
          { n: 4, instruction: "Check your personal (non-Morgan) email for a reset link — check spam if not found", note: "The reset email may take up to 5 minutes to arrive." },
          { n: 5, instruction: "Click the link and create a new password (min 8 characters, 1 uppercase, 1 number)", note: null },
          { n: 6, instruction: "Return to myMSU and log in with your new password", note: null },
        ],
      },
      {
        category: "computer-labs",
        title: "Can't Log Into a Lab Computer",
        slug: "cant-log-into-lab-computer",
        summary: "Locked out of a campus computer lab machine?",
        keywords: ["lab", "computer", "login", "locked", "workstation", "sign in"],
        steps: [
          { n: 1, instruction: "Make sure you are using your Morgan State username (not your full email) — e.g. obwoj1", note: null },
          { n: 2, instruction: "Your default password is your student ID number if you have never changed it", note: null },
          { n: 3, instruction: "If that fails, your lab password is tied to your myMSU password — reset it at morgan.edu", note: null },
          { n: 4, instruction: "Wait 15 minutes after a password reset before trying to log into a lab computer (sync delay)", note: null },
          { n: 5, instruction: "If the computer is frozen or showing a black screen, hold the power button for 10 seconds to restart", note: null },
          { n: 6, instruction: "If you are still locked out, call the IT Help Desk: (443) 885-3838", note: null },
        ],
      },
      {
        category: "campus-wifi",
        title: "Connect to MSU WiFi (Eduroam)",
        slug: "connect-to-eduroam",
        summary: "How to connect to Eduroam, the main campus WiFi network.",
        keywords: ["wifi", "eduroam", "wireless", "internet", "network", "connect"],
        steps: [
          { n: 1, instruction: "On your device, open WiFi settings and select Eduroam", note: null },
          { n: 2, instruction: "When prompted for credentials, enter your full Morgan email (e.g. obwoj1@morgan.edu) as the username", note: null },
          { n: 3, instruction: "Enter your myMSU password as the password", note: null },
          { n: 4, instruction: "If prompted for a certificate or identity, accept/trust the Morgan State certificate", note: "On Android, set EAP method to PEAP and Phase 2 to MSCHAPV2 if prompted." },
          { n: 5, instruction: "You should now be connected — open a browser and verify", note: null },
        ],
      },
      {
        category: "campus-wifi",
        title: "Connect to MSU-Guest WiFi",
        slug: "connect-to-msu-guest",
        summary: "Temporary WiFi access for visitors or when Eduroam isn't working.",
        keywords: ["wifi", "guest", "visitor", "wireless", "msu-guest", "temporary"],
        steps: [
          { n: 1, instruction: "Select MSU-Guest from the available WiFi networks", note: null },
          { n: 2, instruction: "Open a browser — you will be redirected to a sign-in page automatically", note: "MSU-Guest has limited bandwidth and is intended for light browsing only." },
          { n: 3, instruction: "Enter your Morgan State email and click Connect", note: null },
          { n: 4, instruction: "Check your Morgan email for a one-time access code", note: null },
          { n: 5, instruction: "Enter the code on the sign-in page", note: null },
        ],
      },
      {
        category: "duo-mfa",
        title: "Set Up Duo MFA",
        slug: "setup-duo-mfa",
        summary: "First-time setup for Duo two-factor authentication.",
        keywords: ["duo", "mfa", "2fa", "two factor", "authentication", "phone", "setup"],
        steps: [
          { n: 1, instruction: "Go to morgan.edu and log in", note: null },
          { n: 2, instruction: "You will be prompted to enroll in Duo — click Start Setup", note: null },
          { n: 3, instruction: "Select Mobile Phone as your device type", note: null },
          { n: 4, instruction: "Enter your phone number and confirm it", note: null },
          { n: 5, instruction: "Download the Duo Mobile app from the App Store or Google Play", note: null },
          { n: 6, instruction: "On the website, click I have Duo Mobile installed", note: null },
          { n: 7, instruction: "Scan the QR code shown on screen with the Duo Mobile app", note: "Keep your phone nearby every time you log into Morgan systems." },
          { n: 8, instruction: "Click Continue — Duo is now active on your account", note: null },
        ],
      },
      {
        category: "email-m365",
        title: "Access Morgan Student Email",
        slug: "access-morgan-student-email",
        summary: "How to log into your Morgan State Microsoft 365 email account.",
        keywords: ["email", "outlook", "microsoft", "office", "m365", "student email"],
        steps: [
          { n: 1, instruction: "Go to outlook.office.com", note: null },
          { n: 2, instruction: "Enter your full Morgan email (e.g. obwoj1@morgan.edu)", note: null },
          { n: 3, instruction: "You will be redirected to Morgan's login page — enter your myMSU password", note: null },
          { n: 4, instruction: "Complete Duo MFA if prompted", note: null },
          { n: 5, instruction: "Your inbox will load — bookmark this page for easy access", note: null },
          { n: 6, instruction: "To install Office apps (Word, Excel, etc.), click your profile icon → My Account → Apps & devices", note: null },
        ],
      },
      {
        category: "printing",
        title: "Print on Campus",
        slug: "print-on-campus",
        summary: "How to print from your laptop or a lab computer on campus.",
        keywords: ["print", "printing", "printer", "papercut", "library", "copy"],
        steps: [
          { n: 1, instruction: "Make sure you have PaperCut print credit — check your balance at the library front desk", note: "Each student receives a free print credit allocation per semester." },
          { n: 2, instruction: "From a lab computer: open your document, press Ctrl+P, select the nearest printer, and click Print", note: null },
          { n: 3, instruction: "Walk to the printer and swipe your Morgan ID card to release your print job", note: null },
          { n: 4, instruction: "From your personal laptop: connect to Eduroam WiFi first, then go to the IT portal for the printer driver download link", note: null },
          { n: 5, instruction: "Install the driver, add the campus printer, and print as normal — then release with your ID at the machine", note: null },
        ],
      },
    ];

    for (const issue of issues) {
      const { rows } = await client.query(
        `INSERT INTO issues (category_id, title, slug, summary, keywords)
         VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [catIds[issue.category], issue.title, issue.slug, issue.summary, issue.keywords]
      );
      const issueId = rows[0].id;
      for (const step of issue.steps) {
        await client.query(
          `INSERT INTO steps (issue_id, step_number, instruction, note) VALUES ($1,$2,$3,$4)`,
          [issueId, step.n, step.instruction, step.note]
        );
      }
    }

    await client.query("COMMIT");
    console.log("✅ Database seeded successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
