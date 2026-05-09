"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteIssueButton({ id, title }: { id: number; title: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/admin/issues/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-red-500 font-medium">Delete &quot;{title.slice(0, 20)}...&quot;?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-300 transition-colors px-3 py-1.5 rounded-lg"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Delete
    </button>
  );
}
