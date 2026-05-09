import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import IssueCard from "@/components/IssueCard";
import { getAllCategories, getAllIssues } from "@/lib/issues";
import { ArrowLeft } from "lucide-react";

interface HomeProps {
  searchParams: { category?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const [categories, issues] = await Promise.all([getAllCategories(), getAllIssues()]);
  const activeCategory = searchParams.category ?? null;

  const filteredIssues = activeCategory
    ? issues.filter((i) => i.category_slug === activeCategory)
    : [];

  const activeCategoryObj = activeCategory
    ? categories.find((c) => c.slug === activeCategory)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-morgan-blue mb-2">
          How can we help you today?
        </h1>
        <p className="text-gray-500 mb-6">
          Search for your issue or browse by category below.
        </p>
        <SearchBar />

      </div>

      {activeCategory && filteredIssues.length > 0 ? (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <a
              href="/"
              className="flex items-center gap-1.5 text-morgan-orange text-sm font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              All categories
            </a>
            <span className="text-gray-200">|</span>
            <h2 className="text-xl font-bold text-morgan-blue">
              {activeCategoryObj?.name}
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {filteredIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                title={issue.title}
                summary={issue.summary}
                categoryName={issue.category_name ?? ""}
                slug={issue.slug}
              />
            ))}
          </div>
        </section>
      ) : (
        <section>
          <h2 className="text-xl font-bold text-morgan-blue mb-4">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                description={cat.description}
                issueCount={cat.issue_count ?? 0}
                slug={cat.slug}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
