import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import { getAllCategories } from "@/lib/issues";

export default async function Home() {
  const categories = await getAllCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-morgan-blue dark:text-blue-200 mb-2">
          How can we help you today?
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Search for your issue or browse by category below.
        </p>
        <SearchBar />
      </div>

      <section>
        <h2 className="text-xl font-bold text-morgan-blue dark:text-blue-200 mb-4">Browse by Category</h2>
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
    </div>
  );
}
