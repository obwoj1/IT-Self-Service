import { getAllCategories, getIssueBySlug } from "@/lib/issues";
import IssueForm from "@/components/IssueForm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import pool from "@/lib/db";

export default async function EditIssuePage({ params }: { params: { id: string } }) {
  const categories = await getAllCategories();

  const { rows } = await pool.query(
    `SELECT i.*, c.slug AS category_slug FROM issues i JOIN categories c ON c.id=i.category_id WHERE i.id=$1`,
    [parseInt(params.id)]
  );
  if (rows.length === 0) notFound();

  const issue = rows[0];
  const full = await getIssueBySlug(issue.slug);
  if (!full) notFound();

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-morgan-orange text-sm font-medium hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-morgan-blue mb-6">Edit Guide</h1>
      <IssueForm
        categories={categories}
        initial={{
          id: full.id,
          categoryId: full.category_id,
          title: full.title,
          slug: full.slug,
          summary: full.summary,
          keywords: full.keywords.join(", "),
          steps: full.steps.map((s) => ({
            step_number: s.step_number,
            instruction: s.instruction,
            note: s.note ?? "",
          })),
        }}
      />
    </div>
  );
}
