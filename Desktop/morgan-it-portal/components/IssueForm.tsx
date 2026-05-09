"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2, GripVertical } from "lucide-react";
import { Category } from "@/lib/issues";

interface Step {
  step_number: number;
  instruction: string;
  note: string;
}

interface IssueFormProps {
  categories: Category[];
  initial?: {
    id?: number;
    categoryId: number;
    title: string;
    slug: string;
    summary: string;
    keywords: string;
    steps: Step[];
  };
}

const emptyStep = (n: number): Step => ({ step_number: n, instruction: "", note: "" });

export default function IssueForm({ categories, initial }: IssueFormProps) {
  const isEdit = !!initial?.id;
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? 0);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [keywords, setKeywords] = useState(initial?.keywords ?? "");
  const [steps, setSteps] = useState<Step[]>(initial?.steps ?? [emptyStep(1)]);

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function addStep() {
    setSteps((s) => [...s, emptyStep(s.length + 1)]);
  }

  function removeStep(i: number) {
    setSteps((s) => s.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, step_number: idx + 1 })));
  }

  function updateStep(i: number, field: keyof Step, value: string) {
    setSteps((s) => s.map((step, idx) => idx === i ? { ...step, [field]: value } : step));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = {
      categoryId,
      title,
      slug,
      summary,
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
      steps: steps.map((s) => ({ ...s, note: s.note || null })),
    };

    const url = isEdit ? `/api/admin/issues/${initial!.id}` : "/api/admin/issues";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
        <h2 className="font-bold text-morgan-blue text-sm uppercase tracking-wide">Guide Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-morgan-orange text-sm transition-colors"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. reset-mymsu-password"
              className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-morgan-orange text-sm transition-colors font-mono"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (!isEdit) setSlug(autoSlug(e.target.value)); }}
            placeholder="e.g. Reset myMSU Password"
            className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-morgan-orange text-sm transition-colors"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="One sentence describing the issue and fix"
            rows={2}
            className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-morgan-orange text-sm transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500">Keywords <span className="font-normal text-gray-400">(comma-separated)</span></label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="password, reset, login, mymsu"
            className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-morgan-orange text-sm transition-colors"
          />
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
        <h2 className="font-bold text-morgan-blue text-sm uppercase tracking-wide">Steps</h2>

        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-7 h-7 mt-2 rounded-full bg-morgan-blue text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={step.instruction}
                  onChange={(e) => updateStep(i, "instruction", e.target.value)}
                  placeholder="Step instruction"
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-morgan-orange text-sm transition-colors"
                  required
                />
                <input
                  type="text"
                  value={step.note}
                  onChange={(e) => updateStep(i, "note", e.target.value)}
                  placeholder="Optional tip or note"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-morgan-orange text-xs transition-colors text-gray-500"
                />
              </div>
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="mt-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addStep}
          className="flex items-center gap-2 text-sm text-morgan-orange hover:text-orange-600 font-medium transition-colors mt-1"
        >
          <PlusCircle className="w-4 h-4" />
          Add Step
        </button>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-semibold hover:border-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-morgan-orange hover:bg-orange-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Guide"}
        </button>
      </div>
    </form>
  );
}
