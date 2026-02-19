import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JustNotes – Free VTU Notes, PYQs & Study Materials",
  description:
    "JustNotes is a free, open-source repository of VTU study materials. Access module-wise notes, previous year question papers, model papers, and important questions for the 2022 and 2021 VTU schemes.",
};

// Scheme entries shown on the landing page
const schemes = [
  {
    year: "2022",
    href: "/2022",
    description:
      "Current scheme for students admitted from 2022 onwards. Covers revised syllabus across all branches.",
    status: "Active",
  },
  {
    year: "2021",
    href: "/2021",
    description:
      "Scheme for students admitted in 2021. Legacy syllabus — notes and PYQs available.",
    status: "Legacy",
  },
];

export default function HomePage() {
  return (
    <div className="content-wrap">
      {/* ── Hero ────────────────────────────────────────────── */}
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
          Free, no-login access to VTU notes, previous year question papers,
          model papers, question banks, and important questions. Pick your
          scheme below.
        </p>
      </section>

      <div className="rule" />

      {/* ── Scheme Directory ─────────────────────────────────── */}
      <section className="pb-16">
        <h2 className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-8">
          Select Scheme
        </h2>

        <div className="flex flex-col gap-0">
          {schemes.map((scheme, index) => (
            <Link
              key={scheme.year}
              href={scheme.href}
              className="group flex flex-col sm:flex-row sm:items-baseline justify-between py-6 border-t border-black/10 last:border-b hover:bg-black/[0.02] transition-colors -mx-6 px-6"
            >
              {/* Left — year and description */}
              <div className="flex flex-col gap-1 sm:gap-0">
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl font-semibold tracking-tight text-black group-hover:translate-x-1 transition-transform">
                    {scheme.year} Scheme
                  </span>
                  <span className="text-xs font-medium text-[#525252] border border-black/20 px-2 py-0.5 rounded-sm">
                    {scheme.status}
                  </span>
                </div>
                <p className="text-sm text-[#525252] mt-1.5 max-w-md">
                  {scheme.description}
                </p>
              </div>

              {/* Right — arrow */}
              <span className="text-[#525252] text-lg mt-3 sm:mt-0 group-hover:text-black transition-colors">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* ── What's Inside ─────────────────────────────────────── */}
      <section className="pb-20">
        <h2 className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-8">
          What&apos;s Inside
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
          {[
            ["Module-wise Notes", "PDF notes organized per module, per subject."],
            ["Previous Year Papers", "Solved and unsolved PYQs from all recent exams."],
            ["Model Question Papers", "Official VTU model papers for exam practice."],
            ["Question Banks", "500+ questions per subject, module-wise."],
            ["Important Questions", "High-probability questions for each semester exam."],
          ].map(([title, desc]) => (
            <div key={title} className="flex flex-col gap-1">
              <span className="text-sm font-medium text-black">{title}</span>
              <span className="text-xs text-[#525252] leading-relaxed">{desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
