"use client";

import { Search, Sparkles } from "lucide-react";
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
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your IT issue..."
          className="w-full pl-12 pr-32 py-4 rounded-2xl border-2 border-gray-200 bg-white text-base
                     focus:outline-none focus:border-morgan-orange transition-colors shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2 bg-morgan-orange hover:bg-orange-600 transition-colors
                     text-white px-5 py-2.5 rounded-xl font-semibold text-sm"
        >
          Search
        </button>
      </div>
      <p className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-gray-400">
        <Sparkles className="w-3.5 h-3.5 text-morgan-orange" />
        AI-powered help for unique problems
      </p>
    </form>
  );
}
