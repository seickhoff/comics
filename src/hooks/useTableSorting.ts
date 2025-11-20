import { useState, useEffect, useRef } from "react";
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
  const lastTableIdRef = useRef(tableId);
  const lastContextConfigRef = useRef<string>(JSON.stringify(tableSortConfig[tableId] || []));

  // When tableId changes (viewport switch), load the config for the new tableId
  useEffect(() => {
    if (lastTableIdRef.current !== tableId) {
      lastTableIdRef.current = tableId;
      const newConfig = tableSortConfig[tableId] || [];
      setSortConfig(newConfig);
      lastContextConfigRef.current = JSON.stringify(newConfig);
    }
  }, [tableId, tableSortConfig]);

  // Sync local state when context changes externally (e.g., from reset button)
  useEffect(() => {
    const currentConfig = tableSortConfig[tableId];
    const currentConfigStr = JSON.stringify(currentConfig || []);

    // Only update if context changed AND it's different from what we last saw
    if (currentConfigStr !== lastContextConfigRef.current) {
      lastContextConfigRef.current = currentConfigStr;
      setSortConfig(currentConfig || []);
    }
  }, [tableSortConfig, tableId]);

  // Persist sort config to context when user changes it
  useEffect(() => {
    const currentConfig = tableSortConfig[tableId];
    const sortConfigStr = JSON.stringify(sortConfig);
    const currentConfigStr = JSON.stringify(currentConfig || []);

    if (sortConfigStr !== currentConfigStr) {
      lastContextConfigRef.current = sortConfigStr;
      setTableSortConfig((prev) => ({ ...prev, [tableId]: sortConfig }));
    }
  }, [sortConfig, tableId, tableSortConfig, setTableSortConfig]);

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

      // Check if both values are actually numeric (not empty strings)
      const aStr = String(aValue).trim();
      const bStr = String(bValue).trim();
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      // Only treat as numeric if the string is not empty and converts to a valid number
      const bothNumeric = aStr !== "" && bStr !== "" && !isNaN(aNum) && !isNaN(bNum);

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
