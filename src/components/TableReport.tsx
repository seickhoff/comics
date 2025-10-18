import { Table } from "react-bootstrap";
import { ColumnConfig, ColumnKey, ComicBook } from "../interfaces/ComicBook";
import { useAppContext } from "../hooks/useAppContext"; // <-- use context now
import { useState, useEffect } from "react";

export type ReportTableProps = {
  tableId: string; // unique ID for storing sort state
  data: ComicBook[];
  columns: ColumnConfig[];
  filters: Record<ColumnKey, string>;
  useOrFiltering: boolean;
};

type SortDirection = "asc" | "desc";
type SortConfig = { key: keyof ComicBook; direction: SortDirection }[];

// --- normalize title for sorting ---
function normalizeTitle(title: string): string {
  if (title.startsWith("The ")) return title.slice(4) + ", The";
  return title;
}

export const TableReport = ({ tableId, data, columns, filters, useOrFiltering }: ReportTableProps) => {
  const visibleColumns = columns.filter((col) => col.visible);

  const { tableSortConfig, setTableSortConfig } = useAppContext();

  // Initialize sort config from AppContext for this table
  const [sortConfig, setSortConfig] = useState<SortConfig>(tableSortConfig[tableId] || []);

  useEffect(() => {
    // Persist to context whenever sortConfig changes
    setTableSortConfig({ ...tableSortConfig, [tableId]: sortConfig });
  }, [sortConfig]);

  const toggleSort = (key: keyof ComicBook) => {
    setSortConfig((prev) => {
      const existing = prev.find((s) => s.key === key);
      if (!existing) return [...prev, { key, direction: "asc" }];

      if (existing.direction === "asc") {
        return prev.map((s) => (s.key === key ? { ...s, direction: "desc" } : s));
      } else {
        return prev.filter((s) => s.key !== key);
      }
    });
  };

  // --- filtering + sorting logic remains the same ---
  const filteredData = data.filter((item) => {
    const checks = visibleColumns.map((col) => {
      const filterValue = filters[col.key];
      if (!filterValue) return useOrFiltering ? false : true;
      const val = item[col.key];
      try {
        const regex = new RegExp(filterValue, "i");
        if (Array.isArray(val)) return val.some((v) => regex.test(String(v)));
        return regex.test(String(val));
      } catch {
        return useOrFiltering ? false : true;
      }
    });
    return useOrFiltering ? checks.some(Boolean) : checks.every(Boolean);
  });

  const sortedData = [...filteredData].sort((a, b) => {
    for (const { key, direction } of sortConfig) {
      let aValue = a[key];
      let bValue = b[key];

      if (key === "title") {
        aValue = normalizeTitle(String(aValue));
        bValue = normalizeTitle(String(bValue));
      }

      const aNum = Number(aValue);
      const bNum = Number(bValue);
      const bothNumeric = !isNaN(aNum) && !isNaN(bNum);

      let cmp = 0;
      if (bothNumeric) cmp = aNum - bNum;
      else
        cmp =
          String(aValue).toLowerCase() < String(bValue).toLowerCase()
            ? -1
            : String(aValue).toLowerCase() > String(bValue).toLowerCase()
              ? 1
              : 0;

      if (cmp !== 0) return direction === "asc" ? cmp : -cmp;
    }
    return 0;
  });

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {visibleColumns.map((col) => {
            const activeSort = sortConfig.find((s) => s.key === col.key);
            const sortPriority = sortConfig.findIndex((s) => s.key === col.key) + 1;

            return (
              <th key={col.key} onClick={() => toggleSort(col.key)} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                {col.label}
                {activeSort && (
                  <span style={{ display: "inline-flex", alignItems: "center", marginLeft: 5 }}>
                    <span style={{ marginRight: 5 }}>{activeSort.direction === "asc" ? "↑" : "↓"}</span>
                    {sortPriority}
                  </span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, idx) => (
          <tr key={idx}>
            {visibleColumns.map((col) => {
              const value = row[col.key];
              const display = Array.isArray(value) ? value.join(", ") : value;
              return <td key={col.key}>{display}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
