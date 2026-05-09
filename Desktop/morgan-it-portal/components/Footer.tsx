import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 py-6 text-center">
      <p className="text-gray-400 text-xs">
        Morgan State University IT Support Tool &mdash;{" "}
        <a
          href="tel:4438854357"
          className="hover:text-morgan-orange transition-colors"
        >
          (443) 885-4357
        </a>
      </p>
      <Link
        href="/admin"
        className="inline-block mt-2 text-xs text-gray-300 hover:text-morgan-blue transition-colors"
      >
        Admin
      </Link>
    </footer>
  );
}
