import Anthropic from "@anthropic-ai/sdk";
import pool from "./db";

export interface AiStep {
  step_number: number;
  instruction: string;
  note: string | null;
}

export interface AiResult {
  title: string;
  summary: string;
  steps: AiStep[];
  from_cache: boolean;
  hit_count: number;
}

function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, " ");
}

async function ensureTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_responses (
      id SERIAL PRIMARY KEY,
      query TEXT NOT NULL,
      normalized_query TEXT UNIQUE NOT NULL,
      response JSONB NOT NULL,
      hit_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      last_accessed TIMESTAMP DEFAULT NOW()
    )
  `);
}

const SYSTEM_PROMPT = `You are an IT support assistant for Morgan State University. Help students and staff solve tech problems with clear step-by-step guides.

Morgan State systems:
- Main portal: morgan.edu (students log in to myMSU with Morgan credentials)
- Password reset: mypassword.morgan.edu
- Email: Gmail via Google Workspace — NOT Microsoft 365 or Outlook
- IT Help Desk: (443) 885-4357, servicedesk@morgan.edu
- WiFi: Eduroam (full Morgan email + myMSU password) and MSU-Guest (visitors)
- MFA: Duo two-factor authentication
- Canvas for courses, Banner/WebSIS for registration and grades

Respond ONLY with valid JSON — no other text, no markdown fences:
{
  "title": "Short descriptive title",
  "summary": "One sentence description of the issue and fix",
  "steps": [
    {"step_number": 1, "instruction": "Clear actionable step", "note": null},
    {"step_number": 2, "instruction": "Another step", "note": "Optional tip or warning"}
  ]
}`;

export async function getAiAnswer(query: string): Promise<AiResult | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const nq = normalizeQuery(query);

  try {
    await ensureTable();

    // Check cache — increment hit_count atomically on match
    const cached = await pool.query<{ response: Omit<AiResult, "from_cache" | "hit_count">; hit_count: number }>(
      `UPDATE ai_responses
       SET hit_count = hit_count + 1, last_accessed = NOW()
       WHERE normalized_query = $1
       RETURNING response, hit_count`,
      [nq]
    );

    if (cached.rows.length > 0) {
      const { response, hit_count } = cached.rows[0];
      return { ...response, from_cache: true, hit_count };
    }

    // Cache miss — call Claude API
    const client = new Anthropic();

    const msg = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `How do I resolve this IT issue at Morgan State University: ${query}`,
        },
      ],
    });

    const raw = msg.content[0].type === "text" ? msg.content[0].text : "";
    const jsonText = raw.replace(/^```json\n?|\n?```$/g, "").trim();
    const parsed = JSON.parse(jsonText) as Omit<AiResult, "from_cache" | "hit_count">;

    // Store in cache; ON CONFLICT handles race conditions from concurrent requests
    await pool.query(
      `INSERT INTO ai_responses (query, normalized_query, response, hit_count)
       VALUES ($1, $2, $3, 0)
       ON CONFLICT (normalized_query) DO NOTHING`,
      [query, nq, JSON.stringify(parsed)]
    );

    return { ...parsed, from_cache: false, hit_count: 0 };
  } catch {
    return null;
  }
}
