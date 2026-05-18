import { getTopSearches, getTopViews, getTotalCounts, getFeedbackStats, getRecentSearches } from "@/lib/analytics";
import { Search, Eye, TrendingUp, ThumbsUp, ThumbsDown, Clock } from "lucide-react";

export default async function AnalyticsPage() {
  const [searches, views, totals, feedback, recent] = await Promise.all([
    getTopSearches(10),
    getTopViews(10),
    getTotalCounts(),
    getFeedbackStats(),
    getRecentSearches(20),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-morgan-blue">Analytics</h1>
        <p className="text-gray-400 text-sm mt-0.5">What students are searching and viewing</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-morgan-blue/10 flex items-center justify-center flex-shrink-0">
            <Search className="w-5 h-5 text-morgan-blue" />
          </div>
          <div>
            <p className="text-2xl font-bold text-morgan-blue">{totals.searches.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Total searches</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-morgan-orange/10 flex items-center justify-center flex-shrink-0">
            <Eye className="w-5 h-5 text-morgan-orange" />
          </div>
          <div>
            <p className="text-2xl font-bold text-morgan-blue">{totals.views.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Total guide views</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
            <TrendingUp className="w-4 h-4 text-morgan-blue" />
            <h2 className="font-semibold text-morgan-blue text-sm">Top Searches</h2>
          </div>
          {searches.length === 0 ? (
            <p className="text-gray-400 text-sm px-5 py-6 text-center">No search data yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {searches.map((row, i) => (
                <li key={row.value} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                    <span className="text-sm text-gray-700">{row.value}</span>
                  </div>
                  <span className="text-xs font-semibold text-morgan-blue bg-morgan-blue/10 px-2 py-0.5 rounded-full">
                    {row.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
            <Eye className="w-4 h-4 text-morgan-orange" />
            <h2 className="font-semibold text-morgan-blue text-sm">Most Viewed Guides</h2>
          </div>
          {views.length === 0 ? (
            <p className="text-gray-400 text-sm px-5 py-6 text-center">No view data yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {views.map((row, i) => (
                <li key={row.value} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                    <span className="text-sm text-gray-700 font-mono">{row.value}</span>
                  </div>
                  <span className="text-xs font-semibold text-morgan-orange bg-morgan-orange/10 px-2 py-0.5 rounded-full">
                    {row.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
          <Clock className="w-4 h-4 text-morgan-blue" />
          <h2 className="font-semibold text-morgan-blue text-sm">Recent Searches</h2>
          <span className="ml-auto text-xs text-gray-400">latest 20, newest first</span>
        </div>
        {recent.length === 0 ? (
          <p className="text-gray-400 text-sm px-5 py-6 text-center">No searches recorded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recent.map((row, i) => (
              <li key={i} className="flex items-center justify-between px-5 py-2.5">
                <span className="text-sm text-gray-700">{row.value}</span>
                <span className="text-xs text-gray-400">
                  {new Date(row.created_at).toLocaleString("en-US", {
                    month: "short", day: "numeric",
                    hour: "numeric", minute: "2-digit", hour12: true,
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
          <ThumbsUp className="w-4 h-4 text-green-500" />
          <h2 className="font-semibold text-morgan-blue text-sm">Guide Feedback</h2>
          <span className="ml-auto text-xs text-gray-400">Was this helpful? votes</span>
        </div>
        {feedback.length === 0 ? (
          <p className="text-gray-400 text-sm px-5 py-6 text-center">No feedback yet.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {feedback.map((row) => {
              const total = row.yes_count + row.no_count;
              const pct = total > 0 ? Math.round((row.yes_count / total) * 100) : 0;
              return (
                <li key={row.issue_slug} className="flex items-center justify-between px-5 py-3 gap-4">
                  <span className="text-sm text-gray-700 font-mono flex-1 truncate">{row.issue_slug}</span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {row.yes_count}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      {row.no_count}
                    </span>
                    <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
