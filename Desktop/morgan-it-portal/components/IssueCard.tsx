import Link from "next/link";

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
      className="group flex items-center justify-between bg-white rounded-lg border border-gray-100
                 shadow-sm p-4 hover:shadow-md hover:border-l-4 hover:border-l-morgan-orange transition-all duration-150"
    >
      <div>
        <span className="inline-block bg-morgan-blue text-white text-xs px-2 py-0.5 rounded-full mb-1">
          {categoryName}
        </span>
        <h3 className="font-semibold text-gray-800 group-hover:text-morgan-blue transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mt-0.5">{summary}</p>
      </div>
      <span className="text-morgan-orange ml-4 text-xl">→</span>
    </Link>
  );
}
