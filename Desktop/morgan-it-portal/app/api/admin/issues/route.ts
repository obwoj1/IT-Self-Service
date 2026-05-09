import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  const { categoryId, title, slug, summary, keywords, steps } = await request.json();

  if (!title || !slug || !categoryId) {
    return NextResponse.json({ error: "title, slug, and categoryId are required" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO issues (category_id, title, slug, summary, keywords)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [categoryId, title, slug, summary, keywords ?? []]
    );
    const issueId = rows[0].id;

    for (const step of steps ?? []) {
      await client.query(
        `INSERT INTO steps (issue_id, step_number, instruction, note) VALUES ($1,$2,$3,$4)`,
        [issueId, step.step_number, step.instruction, step.note ?? null]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ id: issueId, slug }, { status: 201 });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[admin] create issue error:", err);
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
  } finally {
    client.release();
  }
}
