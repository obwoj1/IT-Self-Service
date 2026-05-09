"use client";

import { useState } from "react";

type State = "idle" | "loading" | "done";

export default function FeedbackButtons({ slug }: { slug: string }) {
  const [state, setState] = useState<State>("idle");
  const [voted, setVoted] = useState<"yes" | "no" | null>(null);

  async function handleVote(vote: "yes" | "no") {
    if (state !== "idle") return;
    setState("loading");
    setVoted(vote);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, vote }),
      });
    } catch {
      // silently ignore — feedback is non-critical
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 mb-6">
        <p className="font-semibold text-morgan-blue mb-1">Was this helpful?</p>
        <p className="text-sm text-gray-500">
          {voted === "yes"
            ? "👍 Glad it helped!"
            : "👎 Thanks for the feedback — we'll work on improving this guide."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 mb-6">
      <p className="font-semibold text-morgan-blue mb-3">Was this helpful?</p>
      <div className="flex gap-3">
        <button
          onClick={() => handleVote("yes")}
          disabled={state === "loading"}
          className="px-5 py-2 rounded-full border-2 border-morgan-blue text-morgan-blue text-sm font-semibold hover:bg-morgan-blue hover:text-white transition-colors disabled:opacity-50"
        >
          👍 Yes
        </button>
        <button
          onClick={() => handleVote("no")}
          disabled={state === "loading"}
          className="px-5 py-2 rounded-full border-2 border-gray-300 text-gray-500 text-sm font-semibold hover:border-morgan-orange hover:text-morgan-orange transition-colors disabled:opacity-50"
        >
          👎 No
        </button>
      </div>
    </div>
  );
}
