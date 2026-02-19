import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import curriculum from "@/data/curriculum.json";

interface Props {
  params: Promise<{ branch: string }>;
}

export async function generateStaticParams() {
  return Object.keys(curriculum.branches).map((branch) => ({ branch }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch: branchCode } = await params;
  const branch =
    curriculum.branches[branchCode as keyof typeof curriculum.branches];
  if (!branch) return { title: "Branch Not Found" };
  return {
    title: `${branch.shortLabel} VTU Notes, PYQs & Question Banks — All Semesters`,
    description: `Download free VTU ${branch.label} notes, previous year question papers (PYQs), and question banks for all 8 semesters.`,
  };
}

export default async function BranchPage({ params }: Props) {
  const { branch: branchCode } = await params;
  const branch =
    curriculum.branches[branchCode as keyof typeof curriculum.branches];
  if (!branch) notFound();

  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

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
          <li className="text-black font-medium">{branch.shortLabel}</li>
        </ol>
      </nav>

      {/* ── Header ──────────────────────────────────────────── */}
      <section className="pt-10 pb-14">
        <p className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-4">
          {branch.shortLabel}
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-black leading-tight mb-4">
          {branch.shortLabel} VTU Notes,
          <br />
          <span className="text-[#525252]">PYQs &amp; Question Banks</span>
        </h1>
        <p className="text-sm text-[#525252]">
          Free VTU {branch.label} notes, previous year question papers (PYQs),
          and question banks across all 8 semesters.
        </p>
      </section>

      <div className="rule" />

      {/* ── Semester Grid ───────────────────────────────────── */}
      <section className="pb-24">
        <h2 className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-8">
          Semester
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black/10">
          {semesters.map((sem) => (
            <Link
              key={sem}
              href={`/${branchCode}/${sem}`}
              className="group bg-white flex flex-col justify-between p-6 hover:bg-black hover:text-white transition-colors"
            >
              <span className="text-3xl font-semibold tracking-tighter text-inherit leading-none mb-6">
                {sem}
              </span>
              <span className="text-xs text-[#525252] group-hover:text-white/70 transition-colors">
                Semester {sem} →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
