import { getIssueBySlug, getRelatedIssues } from "@/lib/issues";
import FeedbackButtons from "@/components/FeedbackButtons";
import RelatedGuides from "@/components/RelatedGuides";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lightbulb, Phone } from "lucide-react";

interface IssuePageProps {
  params: { slug: string };
}

export default async function IssuePage({ params }: IssuePageProps) {
  const issue = await getIssueBySlug(params.slug);
  if (!issue) notFound();
  const related = await getRelatedIssues(params.slug, issue.category_id, issue.keywords);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-morgan-orange text-sm font-medium hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="mb-2">
        <span className="inline-block bg-morgan-blue/10 text-morgan-blue text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {issue.category_name}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-morgan-blue mb-2">{issue.title}</h1>
      <p className="text-gray-500 mb-8">{issue.summary}</p>

      <ol className="flex flex-col gap-4 mb-10">
        {issue.steps.map((step) => (
          <li key={step.id} className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-morgan-blue text-white text-sm font-bold flex items-center justify-center shadow-sm">
              {step.step_number}
            </span>
            <div className="pt-1 flex-1">
              <p className="text-gray-800 leading-relaxed">{step.instruction}</p>
              {step.note && (
                <div className="mt-2 flex gap-2 bg-orange-50 border border-orange-100 px-3 py-2.5 rounded-xl text-sm text-orange-800">
                  <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-morgan-orange" />
                  <span>{step.note}</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <FeedbackButtons slug={params.slug} />

      <RelatedGuides issues={related} />

      <div className="bg-morgan-blue rounded-2xl p-6 text-white text-center mt-10">
        <p className="font-bold text-lg mb-1">Still need help?</p>
        <p className="text-sm text-blue-200 mb-4">Our IT Help Desk is here for you.</p>
        <a
          href="tel:4438854357"
          className="inline-flex items-center gap-2 bg-morgan-orange hover:bg-orange-600 transition-colors text-white px-6 py-2.5 rounded-xl font-semibold"
        >
          <Phone className="w-4 h-4" />
          Call (443) 885-4357
        </a>
      </div>
    </div>
  );
}
