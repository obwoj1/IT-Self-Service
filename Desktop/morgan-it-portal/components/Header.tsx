"use client";

import { Phone } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  return (
    <header className="bg-morgan-blue sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-9 bg-morgan-orange rounded-full" />
          <div>
            <p className="text-white font-bold text-lg leading-tight">
              Morgan State University
            </p>
            <p className="text-morgan-orange text-xs font-semibold tracking-widest uppercase">
              IT Support Tool
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <a
            href="tel:4438854357"
            className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-morgan-orange transition-colors duration-200 text-white text-sm font-medium px-4 py-2 rounded-xl"
          >
            <Phone className="w-4 h-4" />
            (443) 885-4357
          </a>
        </div>
      </div>
    </header>
  );
}
