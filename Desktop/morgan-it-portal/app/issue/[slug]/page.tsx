import { getIssueBySlug } from "@/lib/issues";
import Link from "next/link";
import { notFound } from "next/navigation";

interface IssuePageProps {
  params: { slug: string };
}

export default async function IssuePage({ params }: IssuePageProps) {
  const issue = await getIssueBySlug(params.slug);
  if (!issue) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="text-morgan-orange text-sm hover:underline block mb-6">
        ← Back to Home
      </Link>

      <div className="mb-2">
        <span className="inline-block bg-morgan-blue text-white text-xs px-2 py-0.5 rounded-full">
          {issue.category_name}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-morgan-blue mb-2">{issue.title}</h1>
      <p className="text-gray-500 mb-8">{issue.summary}</p>

      <ol className="flex flex-col gap-4 mb-10">
        {issue.steps.map((step) => (
          <li key={step.id} className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-morgan-blue text-white text-sm font-bold flex items-center justify-center">
              {step.step_number}
            </span>
            <div>
              <p className="text-gray-800">{step.instruction}</p>
              {step.note && (
                <div className="mt-2 bg-orange-50 border-l-4 border-morgan-orange px-3 py-2 rounded text-sm text-orange-800">
                  💡 {step.note}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 mb-6">
        <p className="font-semibold text-morgan-blue mb-3">Was this helpful?</p>
        <div className="flex gap-3">
          <button className="px-5 py-2 rounded-full border-2 border-morgan-blue text-morgan-blue text-sm font-semibold hover:bg-morgan-blue hover:text-white transition-colors">
            👍 Yes
          </button>
          <button className="px-5 py-2 rounded-full border-2 border-gray-300 text-gray-500 text-sm font-semibold hover:border-morgan-orange hover:text-morgan-orange transition-colors">
            👎 No
          </button>
        </div>
      </div>

      <div className="bg-morgan-blue rounded-lg p-5 text-white text-center">
        <p className="font-semibold mb-1">Still need help?</p>
        <p className="text-sm text-blue-200 mb-3">Our IT Help Desk is here for you.</p>
        <a
          href="tel:4438853838"
          className="inline-block bg-morgan-orange text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-700 transition-colors"
        >
          Call (443) 885-3838
        </a>
      </div>
    </div>
  );
}
