import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Build all entries (title groups with their issue lines)
  const LINES_PER_PAGE = 32;

  // Flatten all groups into individual lines with group headers
  type PageItem =
    | { type: "header"; title: string; publisher: string; volume: string }
    | { type: "line"; left: string; right: string };
  const allItems: PageItem[] = [];

  groups.forEach((g) => {
    allItems.push({ type: "header", title: g.title, publisher: g.publisher, volume: g.volume });
    const lines = buildIssueLines(g.issues);
    lines.forEach((line) => allItems.push({ type: "line", left: line.label, right: line.value }));
  });

  // Calculate visual line count for each item (headers = 3 lines, regular lines = 1 line)
  const getVisualLineCount = (item: PageItem, isFirstItem: boolean) => {
    if (item.type === "header") {
      // Header has title (1 line) + publisher info (1 line) + spacing
      // First header has no top margin, subsequent headers have 1rem top margin ≈ 1 extra line
      return isFirstItem ? 2 : 3;
    }
    return 1; // Regular issue line
  };

  // Split into pages based on visual line count
  const pages: PageItem[][] = [];
  let currentPageItems: PageItem[] = [];
  let currentPageLineCount = 0;

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    const lineCount = getVisualLineCount(item, currentPageItems.length === 0);

    // If adding this item would exceed the page limit, start a new page
    if (currentPageLineCount > 0 && currentPageLineCount + lineCount > LINES_PER_PAGE) {
      pages.push(currentPageItems);
      currentPageItems = [];
      currentPageLineCount = 0;
    }

    currentPageItems.push(item);
    currentPageLineCount += lineCount;
  }

  // Push the last page
  if (currentPageItems.length > 0) {
    pages.push(currentPageItems);
  }

  // Now organize pages into spreads (overlapping like a real book)
  // Spread 0: pages 0-1, Spread 1: pages 1-2, Spread 2: pages 2-3, etc.
  const totalPages = pages.length > 0 ? pages.length - 1 : 0;
  const leftPageItems = pages[currentPage] || [];
  const rightPageItems = pages[currentPage + 1] || [];

  const goToPrevious = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  const showNavigation = totalPages > 1;

  const renderPage = (items: PageItem[]) => (
    <div
      className="font-monospace p-4 bg-white border shadow"
      style={{
        flex: "0 0 450px",
        width: "450px",
        height: "700px",
        minHeight: "700px",
        maxHeight: "700px",
        fontSize: "0.875rem",
        lineHeight: "1.25",
        borderRadius: "4px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      {items.map((item, idx) =>
        item.type === "header" ? (
          <div key={idx}>
            <div
              style={{ fontWeight: "bold", marginBottom: "0.25rem", fontSize: "1rem", marginTop: idx > 0 ? "1rem" : 0 }}
            >
              {item.title}
            </div>
            <div style={{ marginBottom: "0.5rem", color: "#666" }}>
              ({item.publisher}, v{item.volume})
            </div>
          </div>
        ) : (
          <Line key={idx} left={item.left} right={item.right} />
        )
      )}
    </div>
  );

  // Mobile view: single scrollable column with all content
  if (isMobile) {
    return (
      <div className="font-monospace p-3" style={{ fontSize: "0.75rem" }}>
        {allItems.map((item, idx) =>
          item.type === "header" ? (
            <div key={idx}>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "0.25rem",
                  fontSize: "0.75rem",
                  marginTop: idx > 0 ? "1rem" : 0,
                }}
              >
                {item.title}
              </div>
              <div style={{ marginBottom: "0.5rem", color: "#666", fontSize: "0.75rem" }}>
                ({item.publisher}, v{item.volume})
              </div>
            </div>
          ) : (
            <Line key={idx} left={item.left} right={item.right} />
          )
        )}
      </div>
    );
  }

  // Desktop view: paginated book layout
  return (
    <div>
      {/* Navigation Controls */}
      {showNavigation && (
        <div className="d-flex justify-content-center align-items-center mb-3 gap-3">
          <Button
            variant="outline-secondary"
            onClick={goToPrevious}
            disabled={currentPage === 0}
            style={{ width: "120px" }}
          >
            <ChevronLeft /> Previous
          </Button>
          <Button
            variant="outline-secondary"
            onClick={goToNext}
            disabled={currentPage === totalPages - 1}
            style={{ width: "120px" }}
          >
            Next <ChevronRight />
          </Button>
        </div>
      )}

      {/* Book Pages Layout - Two columns side by side */}
      <div
        className="d-flex gap-4 justify-content-center align-items-start"
        style={{ minHeight: "70vh", maxWidth: "1000px", margin: "0 auto" }}
      >
        {leftPageItems.length > 0 && (
          <div>
            <div className="text-center text-muted mb-2" style={{ fontSize: "0.8rem" }}>
              Page {currentPage + 1}
            </div>
            {renderPage(leftPageItems)}
          </div>
        )}
        {rightPageItems.length > 0 && (
          <div>
            <div className="text-center text-muted mb-2" style={{ fontSize: "0.8rem" }}>
              Page {currentPage + 2}
            </div>
            {renderPage(rightPageItems)}
          </div>
        )}
      </div>
    </div>
  );
}
