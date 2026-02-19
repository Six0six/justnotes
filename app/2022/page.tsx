import type { Metadata } from "next";
import Link from "next/link";
import curriculum from "@/data/curriculum.json";

export const metadata: Metadata = {
  title: "VTU 2022 Scheme Notes, PYQs & Study Materials – All Branches",
  description:
    "Browse VTU 2022 scheme study materials by branch. Access free notes, PYQs, model papers and important questions for CSE, ECE, ME, CV and more.",
};

// We derive branch data directly from the JSON — no hardcoding.
const schemeData = curriculum.schemes["2022"];

const branches = Object.entries(schemeData.branches).map(([code, branch]) => ({
  code,
  label: branch.label,
  href: `/2022/${code}`,
  semesterCount: Object.keys(branch.semesters).length,
}));

export default function Scheme2022Page() {
  return (
    <div className="content-wrap">
      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <nav className="pt-8 pb-2" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs text-[#525252]">
          <li>
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-black font-medium">2022 Scheme</li>
        </ol>
      </nav>

      {/* ── Page Header ─────────────────────────────────────── */}
      <section className="pt-10 pb-14">
        <p className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-4">
          VTU / 2022 Scheme
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-black leading-tight mb-5">
          2022 Scheme
        </h1>
        <p className="text-sm text-[#525252] max-w-[520px] leading-relaxed">
          Study materials for VTU students admitted under the 2022 scheme.
          Select your branch to browse semester-wise subjects with notes, PYQs,
          and model papers.
        </p>
      </section>

      <div className="rule" />

      {/* ── Branch Directory ────────────────────────────────── */}
      <section className="pb-20">
        <h2 className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-8">
          Select Branch
        </h2>

        <div className="flex flex-col">
          {branches.map((branch) => (
            <Link
              key={branch.code}
              href={branch.href}
              className="group flex items-center justify-between py-5 border-t border-black/10 last:border-b hover:bg-black/[0.02] transition-colors -mx-6 px-6"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-medium text-black group-hover:translate-x-0.5 transition-transform">
                  {branch.label}
                </span>
                <span className="text-xs text-[#525252] uppercase tracking-wider">
                  {branch.code.toUpperCase()}
                  {branch.semesterCount > 0 &&
                    ` · ${branch.semesterCount} semester${branch.semesterCount > 1 ? "s" : ""} available`}
                </span>
              </div>
              <span className="text-[#525252] group-hover:text-black transition-colors">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* ── Semester Quick-Jump (static for now) ────────────── */}
      <section className="pb-20">
        <h2 className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-8">
          Quick Jump — CSE Semesters
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {[3, 4, 5, 6, 7, 8].map((sem) => (
            <Link
              key={sem}
              href={`/2022/cse/${sem}`}
              className="border border-black/15 text-center py-3 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors rounded-sm"
            >
              Sem {sem}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
