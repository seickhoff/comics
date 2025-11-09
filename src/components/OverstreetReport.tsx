import { ComicBook } from "../interfaces/ComicBook";
import { normalizeTitle, parseNumber } from "../utils/comicSorting";

interface OverstreetProps {
  comics: ComicBook[];
}

// Format currency without $
function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? Number(value) : value;
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" }).replace("$", "");
}

// Parse issue number (alias to parseNumber for clarity in this context)
const parseIssue = parseNumber;

// JSX-based line with responsive dotted leader and hover background
function Line({ left, right }: { left: string; right: string }) {
  return (
    <div className="d-flex align-items-center font-monospace text-nowrap w-100 px-1 py-0.5 line-hover">
      <span className="flex-shrink-0">{left}</span>
      <span className="flex-grow-1 mx-2" style={{ borderBottom: "1px dotted gray", height: "0.6em" }}></span>
      <span className="flex-shrink-0">${formatCurrency(right)}</span>
    </div>
  );
}

// Group comics by Title → Publisher → Volume
function groupByTitlePublisherVolume(comics: ComicBook[]) {
  const map = new Map<string, ComicBook[]>();
  for (const comic of comics) {
    const key = `${comic.title}||${comic.publisher}||${comic.volume}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(comic);
  }

  const groups = Array.from(map.entries()).map(([key, issues]) => {
    const [title, publisher, volume] = key.split("||");
    return { title, publisher, volume, issues };
  });

  groups.sort((a, b) => {
    const t = normalizeTitle(a.title).localeCompare(normalizeTitle(b.title));
    if (t !== 0) return t;
    const p = a.publisher.localeCompare(b.publisher);
    if (p !== 0) return p;
    const av = Number(a.volume);
    const bv = Number(b.volume);
    if (Number.isFinite(av) && Number.isFinite(bv)) return av - bv;
    return a.volume.localeCompare(b.volume);
  });

  return groups;
}

// Build issue lines
function buildIssueLines(issues: ComicBook[]): { label: string; value: string }[] {
  const numeric = issues.filter((i) => parseIssue(i.issue) !== null);
  const nonNumeric = issues.filter((i) => parseIssue(i.issue) === null);

  numeric.sort((a, b) => parseIssue(a.issue)! - parseIssue(b.issue)!);
  nonNumeric.sort((a, b) => a.issue.localeCompare(b.issue));

  const runs: { label: string; value: string }[] = [];
  let runStart: ComicBook | null = null;
  let prev: ComicBook | null = null;

  for (const comic of numeric) {
    if (runStart && prev && parseIssue(prev.issue)! + 1 === parseIssue(comic.issue)! && prev.value === comic.value) {
      prev = comic;
    } else {
      if (runStart && prev) {
        const label = runStart.issue === prev.issue ? runStart.issue : `${runStart.issue}-${prev.issue}`;
        runs.push({ label, value: runStart.value });
      }
      runStart = comic;
      prev = comic;
    }
  }

  if (runStart && prev) {
    const label = runStart.issue === prev.issue ? runStart.issue : `${runStart.issue}-${prev.issue}`;
    runs.push({ label, value: runStart.value });
  }

  // Merge consecutive runs with same value
  const merged: { label: string; value: string }[] = [];
  for (const run of runs) {
    const last = merged[merged.length - 1];
    if (last && last.value === run.value) {
      last.label = `${last.label}, ${run.label}`;
    } else {
      merged.push({ ...run });
    }
  }

  // Append non-numeric
  for (const comic of nonNumeric) {
    merged.push({ label: comic.issue, value: comic.value });
  }

  return merged;
}

export default function OverstreetReport({ comics }: OverstreetProps) {
  const groups = groupByTitlePublisherVolume(comics);

  return (
    <div className="font-monospace text-sm leading-tight" style={{ maxWidth: "500px", overflowX: "auto" }}>
      {groups.map((g, idx) => (
        <div key={idx} className="mb-4">
          <div className="font-bold">{g.title}</div>
          <div>
            ({g.publisher}, v{g.volume})
          </div>
          {buildIssueLines(g.issues).map((r, i) => (
            <Line key={i} left={r.label} right={r.value} />
          ))}
        </div>
      ))}
    </div>
  );
}
