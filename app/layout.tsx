import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JustNotes – VTU Study Materials, Notes & PYQs",
    template: "%s | JustNotes VTU",
  },
  description:
    "Free VTU study materials, notes, previous year question papers, and model papers for 2022 and 2021 scheme engineering students.",
  metadataBase: new URL("https://justnotes.tech"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "JustNotes VTU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-black antialiased">
        {/* ── Top Navigation ─────────────────────────────────── */}
        <header className="w-full border-b border-black/10">
          <nav className="content-wrap flex items-center justify-between h-14">
            {/* Logo / Site Name */}
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight hover:opacity-60 transition-opacity"
            >
              JustNotes
            </Link>

            {/* Right-side links */}
            <div className="flex items-center gap-6 text-sm text-[#525252]">
              <a
                href="https://github.com/yourusername/justnotes"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
                aria-label="View source on GitHub"
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>

        {/* ── Page Content ─────────────────────────────────────── */}
        <main>{children}</main>

        {/* ── Footer ────────────────────────────────────────────── */}
        <footer className="w-full border-t border-black/10 mt-24">
          <div className="content-wrap py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-[#525252]">
              JustNotes — Free VTU Study Materials. Not affiliated with
              Visvesvaraya Technological University.
            </p>
            <a
              href="https://github.com/yourusername/justnotes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#525252] hover:text-black transition-colors"
            >
              Open Source on GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
