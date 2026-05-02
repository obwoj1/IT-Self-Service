"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your issue..."
          className="flex-1 px-5 py-3 rounded-full border-2 border-gray-200 text-base
                     focus:outline-none focus:border-morgan-orange transition-colors shadow-sm"
        />
        <button
          type="submit"
          className="bg-morgan-orange text-white px-6 py-3 rounded-full font-semibold
                     hover:bg-orange-700 transition-colors shadow-sm"
        >
          Search
        </button>
      </div>
    </form>
  );
}
