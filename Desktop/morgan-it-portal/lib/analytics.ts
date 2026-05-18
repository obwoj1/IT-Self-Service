import pool from "./db";

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics (
      id SERIAL PRIMARY KEY,
      event_type TEXT NOT NULL CHECK (event_type IN ('search', 'view')),
      value TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS analytics_event_value_idx ON analytics (event_type, value)
  `);
}

export async function recordSearch(query: string) {
  if (!query?.trim()) return;
  try {
    await ensureTable();
    await pool.query(
      `INSERT INTO analytics (event_type, value) VALUES ('search', $1)`,
      [query.trim().toLowerCase()]
    );
  } catch {
    // non-critical — never break the page
  }
}

export async function recordView(slug: string) {
  if (!slug?.trim()) return;
  try {
    await ensureTable();
    await pool.query(
      `INSERT INTO analytics (event_type, value) VALUES ('view', $1)`,
      [slug.trim()]
    );
  } catch {
    // non-critical — never break the page
  }
}

export interface FeedbackRow {
  issue_slug: string;
  yes_count: number;
  no_count: number;
}

export async function getFeedbackStats(): Promise<FeedbackRow[]> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        issue_slug TEXT NOT NULL,
        vote TEXT CHECK (vote IN ('yes','no')) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    const { rows } = await pool.query<FeedbackRow>(
      `SELECT
         issue_slug,
         COUNT(*) FILTER (WHERE vote = 'yes')::int AS yes_count,
         COUNT(*) FILTER (WHERE vote = 'no')::int  AS no_count
       FROM feedback
       GROUP BY issue_slug
       ORDER BY (yes_count + no_count) DESC`
    );
    return rows;
  } catch {
    return [];
  }
}

export interface StatRow {
  value: string;
  count: number;
}

export async function getTopSearches(limit = 10): Promise<StatRow[]> {
  try {
    await ensureTable();
    const { rows } = await pool.query<StatRow>(
      `SELECT value, COUNT(*)::int AS count
       FROM analytics
       WHERE event_type = 'search'
       GROUP BY value
       ORDER BY count DESC
       LIMIT $1`,
      [limit]
    );
    return rows;
  } catch {
    return [];
  }
}

export async function getTopViews(limit = 10): Promise<StatRow[]> {
  try {
    await ensureTable();
    const { rows } = await pool.query<StatRow>(
      `SELECT value, COUNT(*)::int AS count
       FROM analytics
       WHERE event_type = 'view'
       GROUP BY value
       ORDER BY count DESC
       LIMIT $1`,
      [limit]
    );
    return rows;
  } catch {
    return [];
  }
}

export interface RecentSearchRow {
  value: string;
  created_at: string;
}

export async function getRecentSearches(limit = 20): Promise<RecentSearchRow[]> {
  try {
    await ensureTable();
    const { rows } = await pool.query<RecentSearchRow>(
      `SELECT value, created_at
       FROM analytics
       WHERE event_type = 'search'
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    return rows;
  } catch {
    return [];
  }
}

export async function getTotalCounts(): Promise<{ searches: number; views: number }> {
  try {
    await ensureTable();
    const { rows } = await pool.query<{ event_type: string; count: number }>(
      `SELECT event_type, COUNT(*)::int AS count FROM analytics GROUP BY event_type`
    );
    const searches = rows.find((r) => r.event_type === "search")?.count ?? 0;
    const views = rows.find((r) => r.event_type === "view")?.count ?? 0;
    return { searches, views };
  } catch {
    return { searches: 0, views: 0 };
  }
}
