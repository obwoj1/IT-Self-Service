"use client";

export default function Header() {
  return (
    <header className="bg-morgan-blue sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-xl font-heading leading-tight">
            Morgan State University
          </p>
          <p className="text-morgan-orange text-sm font-semibold tracking-wide">
            IT Support Tool
          </p>
        </div>
        <a
          href="tel:4438854357"
          className="text-white text-sm hover:text-morgan-orange transition-colors hidden sm:block"
        >
          IT Help Desk: (443) 885-4357
        </a>
      </div>
    </header>
  );
}
