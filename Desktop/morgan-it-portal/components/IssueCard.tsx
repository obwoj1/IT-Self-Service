import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface IssueCardProps {
  title: string;
  summary: string;
  categoryName: string;
  slug: string;
}

export default function IssueCard({ title, summary, categoryName, slug }: IssueCardProps) {
  return (
    <Link
      href={`/issue/${slug}`}
      className="group flex items-center justify-between bg-white rounded-xl border border-gray-100
                 shadow-sm p-4 hover:shadow-md hover:border-l-4 hover:border-l-morgan-orange transition-all duration-150"
    >
      <div className="min-w-0 flex-1">
        <span className="inline-block bg-morgan-blue/10 text-morgan-blue text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1.5">
          {categoryName}
        </span>
        <h3 className="font-semibold text-gray-900 group-hover:text-morgan-blue transition-colors leading-snug">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mt-0.5 leading-snug">{summary}</p>
      </div>
      <ChevronRight className="flex-shrink-0 w-5 h-5 text-morgan-orange ml-4 group-hover:translate-x-0.5 transition-transform duration-150" />
    </Link>
  );
}
