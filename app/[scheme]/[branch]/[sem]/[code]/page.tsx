import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import curriculum from "@/data/curriculum.json";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Resource {
  title: string;
  url: string;
  description?: string;
  fileType?: string;
  module?: number;
  examMonth?: string;
  examYear?: number;
  set?: number;
  isOfficial?: boolean;
  targetExam?: string;
}

interface Subject {
  code: string;
  name: string;
  credits: number;
  notes: Resource[];
  pyqs: Resource[];
  modelPapers: Resource[];
  questionBanks: Resource[];
  importantQuestions: Resource[];
}

interface PageParams {
  scheme: string;
  branch: string;
  sem: string;
  code: string;
}

// ─── Data Helpers ─────────────────────────────────────────────────────────────

/**
 * Resolves subject data from curriculum.json given route params.
 * Returns null if any segment is not found.
 */
function getSubject(params: PageParams): Subject | null {
  try {
    const schemes = curriculum.schemes as Record<
      string,
      {
        branches: Record<
          string,
          {
            semesters: Record<
              string,
              { subjects: Record<string, Subject> }
            >;
          }
        >;
      }
    >;

    const subject =
      schemes[params.scheme]?.branches[params.branch]?.semesters[params.sem]
        ?.subjects[params.code.toLowerCase()];

    return subject ?? null;
  } catch {
    return null;
  }
}

/**
 * Returns a human-readable label for a scheme code.
 */
function schemeLabel(scheme: string): string {
  return `${scheme} Scheme`;
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const subject = getSubject(params);

  if (!subject) {
    return { title: "Subject Not Found | JustNotes VTU" };
  }

  const title = `${subject.code} ${subject.name} VTU Notes, PYQs & Model Papers | ${schemeLabel(params.scheme)}`;

  const description = `Download comprehensive VTU study materials for ${subject.name} (${subject.code}). Access free PDF notes, previous year question papers (PYQs), official model papers, and important questions. Fully updated for the VTU ${params.scheme} scheme and 2026 semester exams.`;

  const canonicalPath = `/${params.scheme}/${params.branch}/${params.sem}/${params.code}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    // Targeted keyword signals for Google
    keywords: [
      `${subject.code} notes`,
      `${subject.code} VTU notes`,
      `${subject.name} VTU`,
      `${subject.code} previous year question papers`,
      `${subject.code} PYQ`,
      `${subject.code} model question paper`,
      `VTU ${params.scheme} scheme ${params.sem}sem notes`,
      `${subject.name} notes PDF`,
      `VTU ${subject.code} important questions`,
    ],
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * A single resource row — pure text, no card chrome.
 */
function ResourceRow({ item, index }: { item: Resource; index: number }) {
  const meta: string[] = [];
  if (item.module) meta.push(`Module ${item.module}`);
  if (item.examMonth && item.examYear)
    meta.push(`${item.examMonth} ${item.examYear}`);
  if (item.set) meta.push(`Set ${item.set}`);
  if (item.targetExam) meta.push(item.targetExam);
  if (item.isOfficial) meta.push("Official VTU");
  if (item.fileType) meta.push(item.fileType.toUpperCase());

  return (
    <div className="flex items-start justify-between gap-6 py-4 border-t border-black/10 group">
      {/* Index + content */}
      <div className="flex gap-4 min-w-0">
        <span
          className="text-xs text-[#525252] mt-0.5 tabular-nums w-5 shrink-0"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium text-black leading-snug">
            {item.title}
          </span>
          {item.description && (
            <span className="text-xs text-[#525252] leading-relaxed line-clamp-2">
              {item.description}
            </span>
          )}
          {meta.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {meta.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium uppercase tracking-wider text-[#525252]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Download link */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-xs font-medium text-black border border-black/20 px-3 py-1.5 rounded-sm hover:bg-black hover:text-white hover:border-black transition-colors whitespace-nowrap"
        aria-label={`Download ${item.title}`}
      >
        PDF ↓
      </a>
    </div>
  );
}

/**
 * A resource section with an H2 heading and a list of resource rows.
 * Shows an empty state when no resources are available.
 */
function ResourceSection({
  id,
  heading,
  items,
}: {
  id: string;
  heading: string;
  items: Resource[];
}) {
  return (
    <section id={id} className="scroll-mt-20">
      {/* H2 — one per resource category (SEO signal) */}
      <h2 className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-0">
        {heading}
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-[#525252] py-6 border-t border-black/10 mt-0">
          No resources uploaded yet.{" "}
          <a
            href="https://github.com/yourusername/justnotes"
            className="underline hover:text-black transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contribute on GitHub.
          </a>
        </p>
      ) : (
        <div>
          {items.map((item, i) => (
            <ResourceRow key={item.url ?? i} item={item} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubjectPage({ params }: { params: PageParams }) {
  const subject = getSubject(params);

  if (!subject) {
    notFound();
  }

  // Section-jump anchors for the 5 categories
  const sections = [
    { id: "notes", label: "Notes" },
    { id: "pyqs", label: "PYQs" },
    { id: "model-papers", label: "Model Papers" },
    { id: "question-banks", label: "Question Banks" },
    { id: "important-questions", label: "Important Qs" },
  ];

  return (
    <div className="content-wrap">
      {/* ── Breadcrumb ────────────────────────────────────────── */}
      <nav className="pt-8 pb-2" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-[#525252]">
          <li>
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/${params.scheme}`}
              className="hover:text-black transition-colors"
            >
              {params.scheme} Scheme
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/${params.scheme}/${params.branch}`}
              className="hover:text-black transition-colors uppercase"
            >
              {params.branch.toUpperCase()}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/${params.scheme}/${params.branch}/${params.sem}`}
              className="hover:text-black transition-colors"
            >
              Sem {params.sem}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-black font-medium">{subject.code}</li>
        </ol>
      </nav>

      {/* ── Subject Header (H1) ───────────────────────────────── */}
      <section className="pt-10 pb-6">
        {/* H1 — Subject code and name together for SEO matching */}
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-black leading-tight mb-3">
          {subject.code}
          <br />
          <span className="text-[#525252]">{subject.name}</span>
        </h1>

        <div className="flex flex-wrap gap-3 mt-4 text-xs text-[#525252]">
          <span className="border border-black/15 px-2.5 py-1 rounded-sm">
            {schemeLabel(params.scheme)}
          </span>
          <span className="border border-black/15 px-2.5 py-1 rounded-sm">
            Sem {params.sem}
          </span>
          <span className="border border-black/15 px-2.5 py-1 rounded-sm uppercase">
            {params.branch}
          </span>
          {subject.credits > 0 && (
            <span className="border border-black/15 px-2.5 py-1 rounded-sm">
              {subject.credits} Credits
            </span>
          )}
        </div>

        {/* ── SEO Description Block ──────────────────────────── */}
        <p className="mt-6 text-sm text-[#525252] max-w-[600px] leading-relaxed">
          Download comprehensive VTU study materials for{" "}
          <strong className="font-medium text-black">{subject.name}</strong> (
          <strong className="font-medium text-black">{subject.code}</strong>).
          Access free PDF notes, previous year question papers (PYQs), official
          model papers, and important questions. Fully updated for the VTU{" "}
          <strong className="font-medium text-black">
            {params.scheme} scheme
          </strong>{" "}
          and 2026 semester exams.
        </p>
      </section>

      {/* ── In-page Section Jump Nav ──────────────────────────── */}
      <nav
        className="sticky top-0 bg-white z-10 py-3 border-b border-black/10 mb-12 -mx-6 px-6"
        aria-label="Resource sections"
      >
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-xs font-medium text-[#525252] hover:text-black transition-colors tracking-wide"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── The 5 Resource Sections ───────────────────────────── */}
      <div className="flex flex-col gap-14 pb-24">
        <ResourceSection
          id="notes"
          heading="Module-wise Notes"
          items={subject.notes}
        />

        <ResourceSection
          id="pyqs"
          heading="Previous Year Question Papers (PYQs)"
          items={subject.pyqs}
        />

        <ResourceSection
          id="model-papers"
          heading="Official Model Question Papers"
          items={subject.modelPapers}
        />

        <ResourceSection
          id="question-banks"
          heading="Question Banks"
          items={subject.questionBanks}
        />

        <ResourceSection
          id="important-questions"
          heading="Important Questions — Exam Prep"
          items={subject.importantQuestions}
        />
      </div>
    </div>
  );
}
