import { getAllCategories } from "@/lib/issues";
import IssueForm from "@/components/IssueForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewIssuePage() {
  const categories = await getAllCategories();

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-morgan-orange text-sm font-medium hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-morgan-blue mb-6">New Guide</h1>
      <IssueForm categories={categories} />
    </div>
  );
}
