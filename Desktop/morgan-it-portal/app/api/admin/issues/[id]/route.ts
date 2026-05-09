import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { categoryId, title, slug, summary, keywords, steps } = await request.json();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE issues SET category_id=$1, title=$2, slug=$3, summary=$4, keywords=$5 WHERE id=$6`,
      [categoryId, title, slug, summary, keywords ?? [], id]
    );

    await client.query(`DELETE FROM steps WHERE issue_id=$1`, [id]);

    for (const step of steps ?? []) {
      await client.query(
        `INSERT INTO steps (issue_id, step_number, instruction, note) VALUES ($1,$2,$3,$4)`,
        [id, step.step_number, step.instruction, step.note ?? null]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[admin] update issue error:", err);
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM steps WHERE issue_id=$1`, [id]);
    await client.query(`DELETE FROM issues WHERE id=$1`, [id]);
    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[admin] delete issue error:", err);
    return NextResponse.json({ error: "Failed to delete issue" }, { status: 500 });
  } finally {
    client.release();
  }
}
