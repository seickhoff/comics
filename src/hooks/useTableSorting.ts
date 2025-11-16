import { useState, useEffect } from "react";
import { ComicBook } from "../interfaces/ComicBook";
import { normalizeTitle } from "../utils/comicSorting";

type SortDirection = "asc" | "desc";
export type SortConfig = { key: keyof ComicBook; direction: SortDirection }[];

interface UseTableSortingProps {
  tableId: string;
  data: ComicBook[];
  tableSortConfig: Record<string, SortConfig>;
  setTableSortConfig: (
    config: Record<string, SortConfig> | ((prev: Record<string, SortConfig>) => Record<string, SortConfig>)
  ) => void;
}

export function useTableSorting({ tableId, data, tableSortConfig, setTableSortConfig }: UseTableSortingProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(tableSortConfig[tableId] || []);

  // Persist sort config to context
  useEffect(() => {
    setTableSortConfig((prev) => ({ ...prev, [tableId]: sortConfig }));
  }, [sortConfig, tableId, setTableSortConfig]);

  const toggleSort = (key: keyof ComicBook) => {
    setSortConfig((prev) => {
      const existing = prev.find((s) => s.key === key);
      if (!existing) return [...prev, { key, direction: "asc" }];
      if (existing.direction === "asc") return prev.map((s) => (s.key === key ? { ...s, direction: "desc" } : s));
      return prev.filter((s) => s.key !== key);
    });
  };

  const sortedData = [...data].sort((a, b) => {
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

  return { sortConfig, toggleSort, sortedData };
}
