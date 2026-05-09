"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, PlusCircle, LogOut, BarChart2 } from "lucide-react";

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <nav className="bg-morgan-blue shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="w-1 h-7 bg-morgan-orange rounded-full mr-2" />
          <span className="text-white font-bold text-base">IT Portal</span>
          <span className="ml-2 text-xs bg-morgan-orange text-white px-2 py-0.5 rounded-full font-semibold">Admin</span>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors px-3 py-2 rounded-xl text-sm font-medium"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors px-3 py-2 rounded-xl text-sm font-medium"
          >
            <BarChart2 className="w-4 h-4" />
            Analytics
          </Link>
          <Link
            href="/admin/issues/new"
            className="flex items-center gap-1.5 bg-morgan-orange hover:bg-orange-600 transition-colors text-white px-3 py-2 rounded-xl text-sm font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            New Guide
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors px-3 py-2 rounded-xl text-sm ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
