import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Morgan State University — IT Support Tool",
  description: "Resolve common IT issues at Morgan State University without visiting the IT desk.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
