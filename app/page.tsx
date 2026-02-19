import type { Metadata } from "next";
import Link from "next/link";
import curriculum from "@/data/curriculum.json";

export const metadata: Metadata = {
  title: "JustNotes – Free VTU Notes, PYQs & Study Materials",
  description:
    "Free VTU study materials for all branches. Access module-wise notes, previous year question papers, and question banks. No login required.",
};

const branches = Object.entries(curriculum.branches).map(([code, branch]) => ({
  code,
  label: branch.label,
  shortLabel: branch.shortLabel,
  href: `/${code}`,
}));

export default function HomePage() {
  return (
    <div className="content-wrap">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-20 pb-16">
        <p className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-6">
          VTU Engineering / Study Materials
        </p>
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter text-black leading-[1.08] mb-8">
          Student
          <br />
          Repository.
        </h1>
        <p className="text-base text-[#525252] max-w-[480px] leading-relaxed">
          Free, no-login access to VTU notes, previous year question papers, and
          question banks. Select your branch to get started.
        </p>
      </section>

      <div className="rule" />

      {/* ── Branch Directory ─────────────────────────────────── */}
      <section className="pb-20">
        <h2 className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-0">
          Select Your Branch
        </h2>

        <div className="flex flex-col">
          {branches.map((branch) => (
            <Link
              key={branch.code}
              href={branch.href}
              className="group flex items-center justify-between py-5 border-t border-black/10 last:border-b hover:bg-black/[0.02] transition-colors -mx-6 px-6"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-base font-medium text-black group-hover:translate-x-0.5 transition-transform">
                  {branch.label}
                </span>
                <span className="text-xs font-medium tracking-wider uppercase text-[#525252]">
                  {branch.shortLabel}
                </span>
              </div>
              <span className="text-[#525252] group-hover:text-black transition-colors">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
