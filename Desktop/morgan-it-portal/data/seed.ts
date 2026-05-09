import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
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
      { name: "Email & Google Workspace", slug: "email-google", icon: "📧", description: "Morgan Gmail and Google tools" },
      { name: "Duo & MFA", slug: "duo-mfa", icon: "📱", description: "Multi-factor authentication setup" },
      { name: "Printing", slug: "printing", icon: "🖨️", description: "Print on campus" },
      { name: "Canvas & Courses", slug: "canvas-courses", icon: "📚", description: "Canvas LMS and course access" },
      { name: "Banner & Registration", slug: "banner-registration", icon: "🎓", description: "WebSIS, registration, and grades" },
      { name: "VPN & Remote Access", slug: "vpn-remote", icon: "🔒", description: "Connect to Morgan networks off campus" },
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
          { n: 3, instruction: "If that fails, your lab password is tied to your myMSU password — reset it at mypassword.morgan.edu", note: null },
          { n: 4, instruction: "Wait 15 minutes after a password reset before trying to log into a lab computer (sync delay)", note: null },
          { n: 5, instruction: "If the computer is frozen or showing a black screen, hold the power button for 10 seconds to restart", note: null },
          { n: 6, instruction: "If you are still locked out, call the IT Help Desk: (443) 885-4357", note: null },
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
        category: "email-google",
        title: "Access Morgan Student Email",
        slug: "access-morgan-student-email",
        summary: "How to log into your Morgan State Google Workspace (Gmail) account.",
        keywords: ["email", "outlook", "microsoft", "office", "m365", "student email"],
        steps: [
          { n: 1, instruction: "Go to mail.google.com", note: null },
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
      {
        category: "canvas-courses",
        title: "Canvas Not Loading or Showing Wrong Courses",
        slug: "canvas-not-loading",
        summary: "Fix Canvas access issues, missing courses, and login problems.",
        keywords: ["canvas", "course", "class", "lms", "not loading", "missing", "blackboard"],
        steps: [
          { n: 1, instruction: "Go to morgan.instructure.com and log in with your Morgan email and myMSU password", note: null },
          { n: 2, instruction: "If you see a blank dashboard, click 'Courses' in the left sidebar, then 'All Courses' to see everything enrolled", note: null },
          { n: 3, instruction: "If a course is missing, confirm with your professor that they have published the course — unpublished courses are invisible to students", note: "Professors must manually publish each course before students can see it." },
          { n: 4, instruction: "If Canvas won't load at all, clear your browser cache: press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac), select 'All time', check Cached images and files, click Clear", note: null },
          { n: 5, instruction: "Try a different browser — Chrome is most compatible with Canvas", note: null },
          { n: 6, instruction: "If you still cannot access a course you are registered for, email your professor and CC servicedesk@morgan.edu", note: null },
        ],
      },
      {
        category: "canvas-courses",
        title: "Submit an Assignment on Canvas",
        slug: "submit-canvas-assignment",
        summary: "How to upload and submit assignments through Canvas.",
        keywords: ["canvas", "assignment", "submit", "upload", "turn in", "homework"],
        steps: [
          { n: 1, instruction: "Log into Canvas at morgan.instructure.com", note: null },
          { n: 2, instruction: "Click on your course from the dashboard", note: null },
          { n: 3, instruction: "Click 'Assignments' in the left sidebar and select the assignment you want to submit", note: null },
          { n: 4, instruction: "Click the 'Submit Assignment' button on the right side of the page", note: null },
          { n: 5, instruction: "Choose your submission type — File Upload is most common. Drag your file in or click 'Choose File'", note: "Accepted file types are listed on the assignment page. If your file type isn't accepted, save as PDF first." },
          { n: 6, instruction: "Click 'Submit Assignment' to confirm — you will see a green confirmation banner and receive an email receipt", note: null },
          { n: 7, instruction: "You can resubmit before the deadline if needed — Canvas keeps all versions but grades the latest", note: null },
        ],
      },
      {
        category: "banner-registration",
        title: "Register for Classes on Banner/WebSIS",
        slug: "register-for-classes",
        summary: "How to register for courses using Morgan State's Banner system.",
        keywords: ["banner", "websis", "registration", "enroll", "class", "schedule", "add", "drop"],
        steps: [
          { n: 1, instruction: "Log into myMSU at morgan.edu with your Morgan credentials", note: null },
          { n: 2, instruction: "Click on the 'WebSIS' or 'Banner Self-Service' link from your dashboard", note: null },
          { n: 3, instruction: "Click 'Registration' then 'Register for Classes'", note: null },
          { n: 4, instruction: "Select the term you want to register for and click Continue", note: null },
          { n: 5, instruction: "Search for a course by subject, course number, or instructor — click the checkbox next to the section you want", note: "Make sure the section does not have a time conflict with your other courses." },
          { n: 6, instruction: "Click 'Submit' to add the course to your schedule — a green checkmark means success", note: null },
          { n: 7, instruction: "If you get an error (hold, prerequisite, co-req), contact your academic advisor or the Registrar's Office", note: null },
        ],
      },
      {
        category: "banner-registration",
        title: "View Grades and Unofficial Transcript",
        slug: "view-grades-transcript",
        summary: "How to check your grades and download your unofficial transcript from Banner.",
        keywords: ["grades", "transcript", "gpa", "banner", "websis", "unofficial", "academic record"],
        steps: [
          { n: 1, instruction: "Log into myMSU at morgan.edu and navigate to WebSIS / Banner Self-Service", note: null },
          { n: 2, instruction: "Click 'Student Records'", note: null },
          { n: 3, instruction: "To view term grades: click 'View Grades', select the term, and click Submit", note: null },
          { n: 4, instruction: "To view your unofficial transcript: click 'Academic Transcript', choose 'Unofficial', and click Submit", note: "Unofficial transcripts are free. Official transcripts must be ordered through the Registrar's Office and may have a fee." },
          { n: 5, instruction: "To save or print: right-click the page and select Print, then choose 'Save as PDF' as the destination", note: null },
        ],
      },
      {
        category: "vpn-remote",
        title: "Set Up and Connect to Morgan State VPN",
        slug: "connect-to-vpn",
        summary: "Access Morgan State network resources from off campus using the VPN.",
        keywords: ["vpn", "cisco", "anyconnect", "remote", "off campus", "network", "globalprotect"],
        steps: [
          { n: 1, instruction: "Go to morgan.edu/information-technology and look for the VPN download link under Remote Access", note: null },
          { n: 2, instruction: "Download and install Cisco AnyConnect Secure Mobility Client for your operating system", note: null },
          { n: 3, instruction: "Open Cisco AnyConnect, enter the VPN server address provided on the IT page, and click Connect", note: null },
          { n: 4, instruction: "Log in with your Morgan State username (e.g. obwoj1) and your myMSU password", note: null },
          { n: 5, instruction: "Complete Duo MFA when prompted — approve the push notification on your phone", note: "You must have Duo set up before using the VPN. If not, set up Duo first." },
          { n: 6, instruction: "Once connected, you can access library databases, network drives, and other campus-only resources", note: null },
          { n: 7, instruction: "To disconnect, click the AnyConnect icon in your system tray and click Disconnect", note: null },
        ],
      },
      {
        category: "email-google",
        title: "Free Up Google Drive Storage",
        slug: "free-up-google-drive-storage",
        summary: "What to do when your Morgan Google Drive is full or nearly full.",
        keywords: ["google drive", "storage", "full", "quota", "space", "gmail", "drive"],
        steps: [
          { n: 1, instruction: "Go to drive.google.com and sign in with your Morgan email", note: null },
          { n: 2, instruction: "Click 'Storage' in the left sidebar to see what is using the most space", note: null },
          { n: 3, instruction: "To find large files: click the search bar, click the filter icon, set Type to 'Any', sort by Storage Used (largest first)", note: null },
          { n: 4, instruction: "Right-click files you no longer need and click 'Remove' — then go to Trash and click 'Empty Trash' to actually free the space", note: "Files in Trash still count toward your storage quota until the Trash is emptied." },
          { n: 5, instruction: "Check Gmail storage too — large attachments in old emails take up space. Search for 'has:attachment larger:10MB' in Gmail and delete old emails", note: null },
          { n: 6, instruction: "If your storage is still full after cleaning up, contact servicedesk@morgan.edu to request a quota review", note: null },
        ],
      },
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
