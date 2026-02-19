import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import curriculum from "@/data/curriculum.json";

interface Resource {
  title: string;
  url: string;
  description?: string;
  fileType?: string;
  examMonth?: string;
  examYear?: number;
}

type ResourceType = "notes" | "pyqs" | "question-banks";

interface Props {
  params: { branch: string; sem: string; type: ResourceType };
}

const TYPE_CONFIG: Record<
  ResourceType,
  { label: string; key: "notes" | "pyqs" | "questionBanks"; description: string }
> = {
  notes: {
    label: "Notes",
    key: "notes",
    description: "Module-wise PDF notes for all subjects.",
  },
  pyqs: {
    label: "Question Papers",
    key: "pyqs",
    description: "Previous year exam papers from all recent VTU examinations.",
  },
  "question-banks": {
    label: "Question Bank",
    key: "questionBanks",
    description: "Compiled 2-mark and 10-mark questions across all subjects.",
  },
};

function getData(branch: string, sem: string, type: ResourceType) {
  const config = TYPE_CONFIG[type];
  if (!config) return null;

  const b = curriculum.branches[branch as keyof typeof curriculum.branches];
  if (!b) return null;

  const s = b.semesters[sem as keyof typeof b.semesters] as Record<
    string,
    Resource[]
  >;
  if (!s) return null;

  return {
    items: (s[config.key] as Resource[]) ?? [],
    config,
    branchLabel: b.label,
    shortLabel: b.shortLabel,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = getData(params.branch, params.sem, params.type);
  if (!data) return { title: "Not Found" };
  return {
    title: `VTU ${data.shortLabel} Sem ${params.sem} ${data.config.label} — Free PDF Download`,
    description: `${data.config.description} VTU ${data.branchLabel}, Semester ${params.sem}.`,
  };
}

export default function ResourceTypePage({ params }: Props) {
  const data = getData(params.branch, params.sem, params.type);
  if (!data) notFound();

  const { items, config, branchLabel, shortLabel } = data;

  return (
    <div className="content-wrap">
      {/* ── Breadcrumb ──────────────────────────────────────── */}
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
              href={`/${params.branch}`}
              className="hover:text-black transition-colors uppercase"
            >
              {shortLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/${params.branch}/${params.sem}`}
              className="hover:text-black transition-colors"
            >
              Semester {params.sem}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-black font-medium">{config.label}</li>
        </ol>
      </nav>

      {/* ── Header ──────────────────────────────────────────── */}
      <section className="pt-10 pb-14">
        <p className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-4">
          {shortLabel} / Sem {params.sem}
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-black leading-tight mb-4">
          {config.label}
        </h1>
        <p className="text-sm text-[#525252] max-w-md leading-relaxed">
          {config.description}
        </p>
      </section>

      <div className="rule" />

      {/* ── Resource List ────────────────────────────────────── */}
      <section className="pb-24">
        <h2 className="text-xs font-medium tracking-widest uppercase text-[#525252] mb-0">
          {branchLabel} — Semester {params.sem}
          {items.length > 0 && (
            <span className="ml-3 font-normal normal-case tracking-normal text-[#525252]">
              {items.length} file{items.length !== 1 ? "s" : ""}
            </span>
          )}
        </h2>

        {items.length === 0 ? (
          <div className="border-t border-black/10 pt-8 mt-0">
            <p className="text-sm text-[#525252]">
              No files uploaded yet.{" "}
              <a
                href="https://github.com/yourusername/justnotes"
                className="underline hover:text-black transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribute on GitHub.
              </a>
            </p>
          </div>
        ) : (
          <div>
            {items.map((item, i) => {
              const meta: string[] = [];
              if (item.examMonth && item.examYear)
                meta.push(`${item.examMonth} ${item.examYear}`);
              if (item.fileType) meta.push(item.fileType.toUpperCase());

              return (
                <div
                  key={item.url ?? i}
                  className="flex items-start justify-between gap-6 py-5 border-t border-black/10 group"
                >
                  <div className="flex gap-4 min-w-0">
                    <span className="text-xs text-[#525252] mt-0.5 tabular-nums w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-sm font-medium text-black leading-snug">
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="text-xs text-[#525252] leading-relaxed">
                          {item.description}
                        </span>
                      )}
                      {meta.length > 0 && (
                        <div className="flex gap-3 mt-0.5">
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

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-medium text-black border border-black/20 px-3 py-1.5 rounded-sm hover:bg-black hover:text-white hover:border-black transition-colors whitespace-nowrap"
                  >
                    PDF ↓
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
