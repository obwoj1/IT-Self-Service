import pool from "./db";

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  issue_count?: number;
}

export interface Step {
  id: number;
  issue_id: number;
  step_number: number;
  instruction: string;
  note: string | null;
}

export interface Issue {
  id: number;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  title: string;
  slug: string;
  summary: string;
  keywords: string[];
  created_at: string;
  steps?: Step[];
}

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Passwords & Login", slug: "passwords-login", icon: "🔐", description: "Reset passwords and fix login issues", issue_count: 1 },
  { id: 2, name: "Computer Labs", slug: "computer-labs", icon: "🖥️", description: "Lab computer access and problems", issue_count: 1 },
  { id: 3, name: "Campus WiFi", slug: "campus-wifi", icon: "📶", description: "Connect to MSU networks", issue_count: 2 },
  { id: 4, name: "Email & Google Workspace", slug: "email-google", icon: "📧", description: "Morgan Gmail and Google tools", issue_count: 1 },
  { id: 5, name: "Duo & MFA", slug: "duo-mfa", icon: "📱", description: "Multi-factor authentication setup", issue_count: 1 },
  { id: 6, name: "Printing", slug: "printing", icon: "🖨️", description: "Print on campus", issue_count: 1 },
];

const MOCK_ISSUES: Issue[] = [
  { id: 1, category_id: 1, category_name: "Passwords & Login", category_slug: "passwords-login", title: "Reset myMSU Password", slug: "reset-mymsu-password", summary: "Can't log into myMSU? Reset your password here.", keywords: ["password", "mymsu", "login", "forgot", "reset"], created_at: "" },
  { id: 2, category_id: 2, category_name: "Computer Labs", category_slug: "computer-labs", title: "Can't Log Into a Lab Computer", slug: "cant-log-into-lab-computer", summary: "Locked out of a campus computer lab machine?", keywords: ["lab", "computer", "login", "locked"], created_at: "" },
  { id: 3, category_id: 3, category_name: "Campus WiFi", category_slug: "campus-wifi", title: "Connect to MSU WiFi (Eduroam)", slug: "connect-to-eduroam", summary: "How to connect to Eduroam, the main campus WiFi network.", keywords: ["wifi", "eduroam", "wireless"], created_at: "" },
  { id: 4, category_id: 3, category_name: "Campus WiFi", category_slug: "campus-wifi", title: "Connect to MSU-Guest WiFi", slug: "connect-to-msu-guest", summary: "Temporary WiFi access for visitors or when Eduroam isn't working.", keywords: ["wifi", "guest", "visitor"], created_at: "" },
  { id: 5, category_id: 5, category_name: "Duo & MFA", category_slug: "duo-mfa", title: "Set Up Duo MFA", slug: "setup-duo-mfa", summary: "First-time setup for Duo two-factor authentication.", keywords: ["duo", "mfa", "2fa", "authentication"], created_at: "" },
  { id: 6, category_id: 4, category_name: "Email & Google Workspace", category_slug: "email-google", title: "Access Morgan Student Email", slug: "access-morgan-student-email", summary: "How to log into your Morgan State Gmail (Google Workspace) account.", keywords: ["email", "gmail", "google", "student email", "google workspace"], created_at: "" },
  { id: 7, category_id: 6, category_name: "Printing", category_slug: "printing", title: "Print on Campus", slug: "print-on-campus", summary: "How to print from your laptop or a lab computer on campus.", keywords: ["print", "printing", "papercut"], created_at: "" },
];

const MOCK_STEPS: Record<string, Step[]> = {
  "reset-mymsu-password": [
    { id: 1, issue_id: 1, step_number: 1, instruction: "Go to mypassword.morgan.edu", note: null },
    { id: 2, issue_id: 1, step_number: 2, instruction: "Click \"Forgot Password?\" or \"Reset Password\" on the page", note: null },
    { id: 3, issue_id: 1, step_number: 3, instruction: "Enter your Morgan State email address (e.g. obwoj1@morgan.edu)", note: null },
    { id: 4, issue_id: 1, step_number: 4, instruction: "Check your personal (non-Morgan) email for a reset link — check spam if not found", note: "The reset email may take up to 5 minutes to arrive." },
    { id: 5, issue_id: 1, step_number: 5, instruction: "Click the link and create a new password (min 8 characters, 1 uppercase, 1 number)", note: null },
    { id: 6, issue_id: 1, step_number: 6, instruction: "Return to myMSU and log in with your new password", note: null },
  ],
  "cant-log-into-lab-computer": [
    { id: 7, issue_id: 2, step_number: 1, instruction: "Make sure you are using your Morgan State username (not your full email) — e.g. obwoj1", note: null },
    { id: 8, issue_id: 2, step_number: 2, instruction: "Your default password is your student ID number if you have never changed it", note: null },
    { id: 9, issue_id: 2, step_number: 3, instruction: "If that fails, your lab password is tied to your myMSU password — reset it at mypassword.morgan.edu", note: null },
    { id: 10, issue_id: 2, step_number: 4, instruction: "Wait 15 minutes after a password reset before trying to log into a lab computer (sync delay)", note: null },
    { id: 11, issue_id: 2, step_number: 5, instruction: "If the computer is frozen or showing a black screen, hold the power button for 10 seconds to restart", note: null },
    { id: 12, issue_id: 2, step_number: 6, instruction: "If you are still locked out, call the IT Help Desk: (443) 885-4357", note: null },
  ],
  "connect-to-eduroam": [
    { id: 13, issue_id: 3, step_number: 1, instruction: "On your device, open WiFi settings and select Eduroam", note: null },
    { id: 14, issue_id: 3, step_number: 2, instruction: "Enter your full Morgan email (e.g. obwoj1@morgan.edu) as the username", note: null },
    { id: 15, issue_id: 3, step_number: 3, instruction: "Enter your myMSU password as the password", note: null },
    { id: 16, issue_id: 3, step_number: 4, instruction: "If prompted for a certificate or identity, accept/trust the Morgan State certificate", note: "On Android, set EAP method to PEAP and Phase 2 to MSCHAPV2 if prompted." },
    { id: 17, issue_id: 3, step_number: 5, instruction: "You should now be connected — open a browser and verify", note: null },
  ],
  "connect-to-msu-guest": [
    { id: 18, issue_id: 4, step_number: 1, instruction: "Select MSU-Guest from the available WiFi networks", note: null },
    { id: 19, issue_id: 4, step_number: 2, instruction: "Open a browser — you will be redirected to a sign-in page automatically", note: "MSU-Guest has limited bandwidth and is intended for light browsing only." },
    { id: 20, issue_id: 4, step_number: 3, instruction: "Enter your Morgan State email and click Connect", note: null },
    { id: 21, issue_id: 4, step_number: 4, instruction: "Check your Morgan email for a one-time access code", note: null },
    { id: 22, issue_id: 4, step_number: 5, instruction: "Enter the code on the sign-in page", note: null },
  ],
  "setup-duo-mfa": [
    { id: 23, issue_id: 5, step_number: 1, instruction: "Go to morgan.edu and log in", note: null },
    { id: 24, issue_id: 5, step_number: 2, instruction: "You will be prompted to enroll in Duo — click Start Setup", note: null },
    { id: 25, issue_id: 5, step_number: 3, instruction: "Select Mobile Phone as your device type", note: null },
    { id: 26, issue_id: 5, step_number: 4, instruction: "Enter your phone number and confirm it", note: null },
    { id: 27, issue_id: 5, step_number: 5, instruction: "Download the Duo Mobile app from the App Store or Google Play", note: null },
    { id: 28, issue_id: 5, step_number: 6, instruction: "On the website, click I have Duo Mobile installed", note: null },
    { id: 29, issue_id: 5, step_number: 7, instruction: "Scan the QR code shown on screen with the Duo Mobile app", note: "Keep your phone nearby every time you log into Morgan systems." },
    { id: 30, issue_id: 5, step_number: 8, instruction: "Click Continue — Duo is now active on your account", note: null },
  ],
  "access-morgan-student-email": [
    { id: 31, issue_id: 6, step_number: 1, instruction: "Go to morgan.edu and click myMSU to log in", note: null },
    { id: 32, issue_id: 6, step_number: 2, instruction: "Once logged in, find the Gmail icon in your myMSU dashboard and click it", note: null },
    { id: 33, issue_id: 6, step_number: 3, instruction: "Your Morgan Gmail inbox will open — your address is username@morgan.edu (e.g. obwoj1@morgan.edu)", note: null },
    { id: 34, issue_id: 6, step_number: 4, instruction: "You can also go directly to mail.google.com and sign in with your Morgan email and myMSU password", note: null },
    { id: 35, issue_id: 6, step_number: 5, instruction: "Complete Duo MFA if prompted", note: null },
    { id: 36, issue_id: 6, step_number: 6, instruction: "Bookmark mail.google.com for quick access — Google Drive, Docs, and Meet are also available from your Google account", note: null },
  ],
  "print-on-campus": [
    { id: 37, issue_id: 7, step_number: 1, instruction: "Make sure you have PaperCut print credit — check your balance at the library front desk", note: "Each student receives a free print credit allocation per semester." },
    { id: 38, issue_id: 7, step_number: 2, instruction: "From a lab computer: open your document, press Ctrl+P, select the nearest printer, and click Print", note: null },
    { id: 39, issue_id: 7, step_number: 3, instruction: "Walk to the printer and swipe your Morgan ID card to release your print job", note: null },
    { id: 40, issue_id: 7, step_number: 4, instruction: "From your personal laptop: connect to Eduroam WiFi first, then go to the IT portal for the printer driver download link", note: null },
    { id: 41, issue_id: 7, step_number: 5, instruction: "Install the driver, add the campus printer, and print as normal — then release with your ID at the machine", note: null },
  ],
};

function isDbConfigured(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  return url.length > 0 && !url.includes("your_postgres");
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isDbConfigured()) return MOCK_CATEGORIES;
  try {
    const { rows } = await pool.query<Category>(`
      SELECT c.*, COUNT(i.id)::int AS issue_count
      FROM categories c
      LEFT JOIN issues i ON i.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name
    `);
    return rows;
  } catch {
    return MOCK_CATEGORIES;
  }
}

export async function getAllIssues(): Promise<Issue[]> {
  if (!isDbConfigured()) return MOCK_ISSUES;
  try {
    const { rows } = await pool.query<Issue>(`
      SELECT i.*, c.name AS category_name, c.slug AS category_slug
      FROM issues i
      JOIN categories c ON c.id = i.category_id
      ORDER BY i.title
    `);
    return rows;
  } catch {
    return MOCK_ISSUES;
  }
}

export async function searchIssues(query: string): Promise<Issue[]> {
  const q = query.toLowerCase();
  if (!isDbConfigured()) {
    return MOCK_ISSUES.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q) ||
        i.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }
  try {
    const like = `%${q}%`;
    const { rows } = await pool.query<Issue>(
      `SELECT i.*, c.name AS category_name, c.slug AS category_slug
       FROM issues i
       JOIN categories c ON c.id = i.category_id
       WHERE LOWER(i.title) LIKE $1
          OR LOWER(i.summary) LIKE $1
          OR EXISTS (
            SELECT 1 FROM unnest(i.keywords) kw WHERE LOWER(kw) LIKE $1
          )
       ORDER BY i.title`,
      [like]
    );
    return rows;
  } catch {
    const qLower = query.toLowerCase();
    return MOCK_ISSUES.filter(
      (i) =>
        i.title.toLowerCase().includes(qLower) ||
        i.summary.toLowerCase().includes(qLower) ||
        i.keywords.some((k) => k.toLowerCase().includes(qLower))
    );
  }
}

export async function getIssueBySlug(slug: string): Promise<(Issue & { steps: Step[] }) | null> {
  if (!isDbConfigured()) {
    const issue = MOCK_ISSUES.find((i) => i.slug === slug) ?? null;
    if (!issue) return null;
    return { ...issue, steps: MOCK_STEPS[slug] ?? [] };
  }
  try {
    const issueRes = await pool.query<Issue>(
      `SELECT i.*, c.name AS category_name, c.slug AS category_slug
       FROM issues i
       JOIN categories c ON c.id = i.category_id
       WHERE i.slug = $1`,
      [slug]
    );
    if (issueRes.rows.length === 0) return null;
    const issue = issueRes.rows[0];
    const stepsRes = await pool.query<Step>(
      `SELECT * FROM steps WHERE issue_id = $1 ORDER BY step_number`,
      [issue.id]
    );
    return { ...issue, steps: stepsRes.rows };
  } catch {
    const issue = MOCK_ISSUES.find((i) => i.slug === slug) ?? null;
    if (!issue) return null;
    return { ...issue, steps: MOCK_STEPS[slug] ?? [] };
  }
}
