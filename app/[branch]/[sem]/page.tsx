import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import curriculum from "@/data/curriculum.json";

interface Props {
  params: Promise<{ branch: string; sem: string }>;
}

type SemData = {
  notes: unknown[];
  pyqs: unknown[];
  questionBanks: unknown[];
};

function getSemData(branch: string, sem: string): SemData | null {
  const b = curriculum.branches[branch as keyof typeof curriculum.branches];
  if (!b) return null;
  const s = b.semesters[sem as keyof typeof b.semesters] as SemData | undefined;
  return s ?? null;
}

export async function generateStaticParams() {
  const params: { branch: string; sem: string }[] = [];
  for (const branch of Object.keys(curriculum.branches)) {
    for (let sem = 1; sem <= 8; sem++) {
      params.push({ branch, sem: String(sem) });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch: branchCode, sem } = await params;
  const branch =
    curriculum.branches[branchCode as keyof typeof curriculum.branches];
  if (!branch) return { title: "Not Found" };
  return {
    title: `${branch.shortLabel} Semester ${sem} VTU Notes, PYQs & Question Banks`,
    description: `Download free VTU ${branch.label} Semester ${sem} notes, previous year question papers (PYQs), and question banks.`,
  };
}

export default async function SemesterPage({ params }: Props) {
  const { branch: branchCode, sem } = await params;
  const branch =
    curriculum.branches[branchCode as keyof typeof curriculum.branches];
  if (!branch) notFound();

  const semData = getSemData(branchCode, sem);
  if (!semData) notFound();

  const resources = [
    {
      id: "notes",
      label: "Notes",
      description: "Module-wise PDF notes for all subjects this semester.",
      count: semData.notes.length,
      href: `/${branchCode}/${sem}/notes`,
    },
    {
      id: "pyqs",
      label: "Question Papers",
      description:
        "Previous year exam papers (PYQs) from all recent examinations.",
      count: semData.pyqs.length,
      href: `/${branchCode}/${sem}/pyqs`,
    },
    {
      id: "question-banks",
      label: "Question Bank",
      description: "Compiled 2-mark and 10-mark questions across all subjects.",
      count: semData.questionBanks.length,
      href: `/${branchCode}/${sem}/question-banks`,
    },
  ];

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
          <li>
            <Link
              href={`/${branchCode}`}
              className="hover:text-black transition-colors uppercase"
            >
              {branch.shortLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-black font-medium">Semester {sem}</li>
        </ol>
      </nav>

      {/* ── Header ──────────────────────────────────────────── */}
      <section className="pt-10 pb-14">
        <p className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-4">
          {branch.shortLabel} / Semester {sem}
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-black leading-tight">
          {branch.shortLabel} Semester {sem}
          <br />
          <span className="text-[#525252]">Notes, PYQs &amp; Question Banks</span>
        </h1>
      </section>

      <div className="rule" />

      {/* ── Resource Type Cards ─────────────────────────────── */}
      <section className="pb-24">
        <h2 className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-8">
          Resources
        </h2>

        <div className="flex flex-col">
          {resources.map((res) => (
            <Link
              key={res.id}
              href={res.href}
              className="group flex items-start justify-between py-7 border-t border-black/10 last:border-b hover:bg-black/[0.02] -mx-6 px-6 transition-colors"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-xl font-semibold tracking-tight text-black group-hover:translate-x-0.5 transition-transform">
                  {res.label}
                </span>
                <span className="text-sm text-[#525252] max-w-sm leading-relaxed">
                  {res.description}
                </span>
                {res.count > 0 && (
                  <span className="text-xs text-[#525252] mt-1">
                    {res.count} file{res.count !== 1 ? "s" : ""} available
                  </span>
                )}
              </div>
              <span className="text-xl text-[#525252] group-hover:text-black mt-1 transition-colors shrink-0 ml-8">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
