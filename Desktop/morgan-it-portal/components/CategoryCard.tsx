"use client";

import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import { categoryIconMap } from "@/lib/category-icons";

interface CategoryCardProps {
  name: string;
  description: string;
  issueCount: number;
  slug: string;
}

export default function CategoryCard({ name, description, issueCount, slug }: CategoryCardProps) {
  const Icon = categoryIconMap[slug] ?? BookOpen;

  return (
    <Link
      href={`/category/${slug}`}
      className="group flex items-start gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5
                 hover:shadow-md hover:border-morgan-orange/40 dark:hover:border-morgan-orange/60 transition-all duration-200"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 dark:bg-morgan-blue/20 flex items-center justify-center
                      group-hover:bg-morgan-orange/10 transition-colors duration-200">
        <Icon className="w-6 h-6 text-morgan-blue dark:text-blue-300 group-hover:text-morgan-orange transition-colors duration-200" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-morgan-blue dark:text-blue-200 text-base leading-tight group-hover:text-morgan-orange transition-colors duration-200">
          {name}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-snug">{description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">
            {issueCount} {issueCount === 1 ? "guide" : "guides"}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-morgan-orange group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </div>
    </Link>
  );
}
