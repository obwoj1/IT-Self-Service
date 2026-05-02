import IssueCard from "@/components/IssueCard";
import SearchBar from "@/components/SearchBar";
import { searchIssues } from "@/lib/issues";
import Link from "next/link";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q ?? "";
  const results = q ? await searchIssues(q) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-morgan-orange text-sm hover:underline block mb-6">
        ← Back to Home
      </Link>

      <div className="mb-8">
        <SearchBar defaultValue={q} />
      </div>

      <h2 className="text-xl font-bold text-morgan-blue mb-4">
        {q ? `Results for "${q}"` : "Search for an issue"}
      </h2>

      {results.length > 0 ? (
        <div className="flex flex-col gap-3">
          {results.map((issue) => (
            <IssueCard
              key={issue.id}
              title={issue.title}
              summary={issue.summary}
              categoryName={issue.category_name ?? ""}
              slug={issue.slug}
            />
          ))}
        </div>
      ) : q ? (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-gray-500 mb-2">No results found for &quot;{q}&quot;.</p>
          <p className="text-gray-400 text-sm">
            Need more help? Call the IT Help Desk:{" "}
            <a href="tel:4438853838" className="text-morgan-orange font-semibold">
              (443) 885-3838
            </a>
          </p>
        </div>
      ) : null}
    </div>
  );
}
