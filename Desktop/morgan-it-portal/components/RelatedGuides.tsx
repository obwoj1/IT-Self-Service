import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Issue } from "@/lib/issues";

export default function RelatedGuides({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) return null;
  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Related Guides</h2>
      <div className="flex flex-col gap-2">
        {issues.map((issue) => (
          <Link
            key={issue.slug}
            href={`/issue/${issue.slug}`}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-morgan-orange hover:shadow-sm transition-all group"
          >
            <div>
              <p className="text-sm font-medium text-morgan-blue group-hover:text-morgan-orange transition-colors">
                {issue.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{issue.category_name}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-morgan-orange transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
