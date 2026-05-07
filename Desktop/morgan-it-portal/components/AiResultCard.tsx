import { AiStep } from "@/lib/ai-cache";

interface AiResultCardProps {
  title: string;
  summary: string;
  steps: AiStep[];
  fromCache: boolean;
  hitCount: number;
}

export default function AiResultCard({
  title,
  summary,
  steps,
  fromCache,
  hitCount,
}: AiResultCardProps) {
  return (
    <div className="bg-white rounded-lg border border-purple-200 border-l-4 border-l-purple-500 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          ✨ AI Generated
        </span>
        {fromCache && (
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
            Cached · {hitCount} {hitCount === 1 ? "lookup" : "lookups"}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-morgan-blue mb-1">{title}</h3>
      <p className="text-gray-500 text-sm mb-5">{summary}</p>

      <ol className="space-y-4">
        {steps.map((step) => (
          <li key={step.step_number} className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500 text-white text-sm font-bold flex items-center justify-center">
              {step.step_number}
            </span>
            <div className="pt-0.5">
              <p className="text-gray-800 text-sm leading-relaxed">{step.instruction}</p>
              {step.note && (
                <p className="mt-2 text-xs text-orange-700 bg-orange-50 border-l-2 border-morgan-orange px-3 py-1.5 rounded">
                  {step.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-5 text-xs text-gray-400 border-t border-gray-100 pt-4">
        AI-generated answer — verify steps with the IT Help Desk if something doesn&apos;t work:{" "}
        <a href="tel:4438854357" className="text-morgan-orange font-semibold">
          (443) 885-4357
        </a>
      </p>
    </div>
  );
}
