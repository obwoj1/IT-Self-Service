import { Sparkles, Zap, Lightbulb, Phone } from "lucide-react";
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
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-400" />

      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            AI Generated
          </span>
          {fromCache && (
            <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
              <Zap className="w-3 h-3" />
              Cached · {hitCount} {hitCount === 1 ? "lookup" : "lookups"}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-morgan-blue mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-5">{summary}</p>

        <ol className="flex flex-col gap-4">
          {steps.map((step) => (
            <li key={step.step_number} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500 text-white text-sm font-bold flex items-center justify-center">
                {step.step_number}
              </span>
              <div className="pt-0.5 flex-1">
                <p className="text-gray-800 text-sm leading-relaxed">{step.instruction}</p>
                {step.note && (
                  <div className="mt-2 flex gap-2 bg-orange-50 border border-orange-100 px-3 py-2 rounded-xl text-xs text-orange-800">
                    <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-morgan-orange" />
                    <span>{step.note}</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-400">
            AI-generated — verify with IT Help Desk if unsure
          </p>
          <a
            href="tel:4438854357"
            className="inline-flex items-center gap-1.5 text-xs text-morgan-orange font-semibold hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            (443) 885-4357
          </a>
        </div>
      </div>
    </div>
  );
}
