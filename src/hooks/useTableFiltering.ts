import { ComicBook, ColumnConfig, ColumnKey } from "../interfaces/ComicBook";

interface UseTableFilteringProps {
  data: ComicBook[];
  visibleColumns: ColumnConfig[];
  filters: Record<ColumnKey, string>;
  useOrFiltering: boolean;
}

export function useTableFiltering({ data, visibleColumns, filters, useOrFiltering }: UseTableFilteringProps) {
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

  return { filteredData };
}
