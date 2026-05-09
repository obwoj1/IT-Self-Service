import { getIssuesByCategory } from "@/lib/issues";
import IssueCard from "@/components/IssueCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { categoryIconMap } from "@/lib/category-icons";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { category, issues } = await getIssuesByCategory(params.slug);
  if (!category) notFound();

  const Icon = categoryIconMap[params.slug] ?? BookOpen;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-morgan-orange text-sm font-medium hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        All categories
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-morgan-blue/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-7 h-7 text-morgan-blue" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-morgan-blue">{category.name}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{category.description}</p>
        </div>
      </div>

      {issues.length === 0 ? (
        <p className="text-gray-400">No guides in this category yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              title={issue.title}
              summary={issue.summary}
              categoryName={issue.category_name ?? ""}
              slug={issue.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
