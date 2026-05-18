"use client";

import { Search, Sparkles, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      });
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
          disabled={isPending}
          className="w-full pl-12 pr-36 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 text-base
                     focus:outline-none focus:border-morgan-orange transition-colors shadow-sm disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isPending}
          className="absolute right-2 bg-morgan-orange hover:bg-orange-600 transition-colors
                     text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5
                     disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching…
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>
      <p className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-gray-400 dark:text-gray-500">
        <Sparkles className="w-3.5 h-3.5 text-morgan-orange" />
        AI-powered help for unique problems
      </p>
    </form>
  );
}
