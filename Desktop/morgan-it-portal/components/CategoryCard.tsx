"use client";

import Link from "next/link";

interface CategoryCardProps {
  icon: string;
  name: string;
  description: string;
  issueCount: number;
  slug: string;
}

export default function CategoryCard({ icon, name, description, issueCount, slug }: CategoryCardProps) {
  return (
    <Link
      href={`/?category=${slug}`}
      className="group block bg-white rounded-lg shadow-sm border border-gray-100 p-5
                 hover:border-l-4 hover:border-l-morgan-orange hover:shadow-md transition-all duration-150"
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="font-bold text-morgan-blue text-base group-hover:text-morgan-orange transition-colors">
            {name}
          </h3>
          <p className="text-gray-500 text-sm mt-0.5">{description}</p>
          <p className="text-xs text-gray-400 mt-2">
            {issueCount} {issueCount === 1 ? "guide" : "guides"}
          </p>
        </div>
      </div>
    </Link>
  );
}
