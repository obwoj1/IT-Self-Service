import { getAllCategories, getAllIssues } from "@/lib/issues";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2, BookOpen } from "lucide-react";
import DeleteIssueButton from "@/components/DeleteIssueButton";

export default async function AdminDashboard() {
  const [categories, issues] = await Promise.all([getAllCategories(), getAllIssues()]);

  const byCategory = categories.map((cat) => ({
    ...cat,
    issues: issues.filter((i) => i.category_slug === cat.slug),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-morgan-blue">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">{issues.length} guides across {categories.length} categories</p>
        </div>
        <Link
          href="/admin/issues/new"
          className="flex items-center gap-2 bg-morgan-orange hover:bg-orange-600 transition-colors text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
        >
          <PlusCircle className="w-4 h-4" />
          New Guide
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {byCategory.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
              <BookOpen className="w-4 h-4 text-morgan-blue" />
              <h2 className="font-semibold text-morgan-blue text-sm">{cat.name}</h2>
              <span className="ml-auto text-xs text-gray-400">{cat.issues.length} guides</span>
            </div>

            {cat.issues.length === 0 ? (
              <p className="text-gray-400 text-sm px-5 py-4">No guides yet.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {cat.issues.map((issue) => (
                  <li key={issue.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{issue.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{issue.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <Link
                        href={`/admin/issues/${issue.id}/edit`}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-morgan-blue border border-gray-200 hover:border-morgan-blue transition-colors px-3 py-1.5 rounded-lg"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <DeleteIssueButton id={issue.id} title={issue.title} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
