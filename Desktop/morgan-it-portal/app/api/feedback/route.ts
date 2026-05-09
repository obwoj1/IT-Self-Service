import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      issue_slug TEXT NOT NULL,
      vote TEXT NOT NULL CHECK (vote IN ('yes', 'no')),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, vote } = body as { slug?: string; vote?: string };

  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }
  if (vote !== "yes" && vote !== "no") {
    return NextResponse.json({ error: "vote must be 'yes' or 'no'" }, { status: 400 });
  }

  try {
    await ensureTable();
    await pool.query(
      `INSERT INTO feedback (issue_slug, vote) VALUES ($1, $2)`,
      [slug.trim(), vote]
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[feedback] DB error:", err);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
