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

export async function getAllCategories(): Promise<Category[]> {
  const { rows } = await pool.query<Category>(`
    SELECT c.*, COUNT(i.id)::int AS issue_count
    FROM categories c
    LEFT JOIN issues i ON i.category_id = c.id
    GROUP BY c.id
    ORDER BY c.name
  `);
  return rows;
}

export async function getAllIssues(): Promise<Issue[]> {
  const { rows } = await pool.query<Issue>(`
    SELECT i.*, c.name AS category_name, c.slug AS category_slug
    FROM issues i
    JOIN categories c ON c.id = i.category_id
    ORDER BY i.title
  `);
  return rows;
}

export async function searchIssues(query: string): Promise<Issue[]> {
  const q = `%${query.toLowerCase()}%`;
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
    [q]
  );
  return rows;
}

export async function getIssueBySlug(slug: string): Promise<(Issue & { steps: Step[] }) | null> {
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
}
