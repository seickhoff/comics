import { ComicBook } from "../interfaces/ComicBook";

interface OverstreetProps {
  comics: ComicBook[];
  width?: number; // default 32
}

function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? Number(value) : value;
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" }).replace("$", "");
}

function parseIssue(issue: string): number | null {
  const num = Number(issue);
  return Number.isFinite(num) ? num : null;
}

// Format line with filler dots
function formatLine(left: string, right: string, width: number): string {
  const formatted = formatCurrency(right);
  const dots = ".".repeat(Math.max(1, width - left.length - formatted.length - 1));
  return `${left}${dots}$${formatted}`;
}

// Move leading "The " to the end
function normalizeTitle(title: string): string {
  if (title.startsWith("The ")) {
    return title.slice(4) + ", The";
  }
  return title;
}

// Group comics by Title → Publisher → Volume
function groupByTitlePublisherVolume(comics: ComicBook[]) {
  const map = new Map<string, ComicBook[]>();

  for (const comic of comics) {
    const key = `${comic.title}||${comic.publisher}||${comic.volume}`;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(comic);
  }

  const groups = Array.from(map.entries()).map(([key, issues]) => {
    const [title, publisher, volume] = key.split("||");
    return { title, publisher, volume, issues };
  });

  // Sort groups: title → publisher → volume
  groups.sort((a, b) => {
    const t = normalizeTitle(a.title).localeCompare(normalizeTitle(b.title));
    if (t !== 0) return t;

    const p = a.publisher.localeCompare(b.publisher);
    if (p !== 0) return p;

    const av = Number(a.volume);
    const bv = Number(b.volume);
    if (Number.isFinite(av) && Number.isFinite(bv)) {
      return av - bv;
    }
    return a.volume.localeCompare(b.volume);
  });

  return groups;
}

// Build issue lines, merging consecutive numeric issues and adjacent ranges with the same value
function buildIssueLines(issues: ComicBook[], width: number): string[] {
  const numeric = issues.filter((i) => parseIssue(i.issue) !== null);
  const nonNumeric = issues.filter((i) => parseIssue(i.issue) === null);

  numeric.sort((a, b) => parseIssue(a.issue)! - parseIssue(b.issue)!);
  nonNumeric.sort((a, b) => a.issue.localeCompare(b.issue));

  // Step 1: build initial runs of consecutive issues
  const runs: { label: string; value: string }[] = [];
  let runStart: ComicBook | null = null;
  let prev: ComicBook | null = null;

  for (const comic of numeric) {
    if (runStart && prev && parseIssue(prev.issue)! + 1 === parseIssue(comic.issue)! && prev.value === comic.value) {
      prev = comic; // continue run
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

  // Step 2: merge runs with the same value into comma-separated labels
  const merged: { label: string; value: string }[] = [];
  for (const run of runs) {
    const last = merged[merged.length - 1];
    if (last && last.value === run.value) {
      last.label = `${last.label}, ${run.label}`;
    } else {
      merged.push({ ...run });
    }
  }

  // Step 3: format lines
  const lines: string[] = merged.map((r) => formatLine(r.label, r.value, width));

  // Add non-numeric after numeric
  for (const comic of nonNumeric) {
    lines.push(formatLine(comic.issue, comic.value, width));
  }

  return lines;
}

export default function Overstreet({ comics, width = 32 }: OverstreetProps) {
  const groups = groupByTitlePublisherVolume(comics);

  return (
    <pre className="font-mono text-sm leading-tight">
      {groups.map((g, idx) => (
        <div key={idx} className="mb-4">
          <div className="font-bold">{g.title}</div>
          <div>
            ({g.publisher}, v{g.volume})
          </div>
          {buildIssueLines(g.issues, width).map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      ))}
    </pre>
  );
}
