import { ComicBook, ColumnConfig, ColumnKey } from "../interfaces/ComicBook";

interface UseTableFilteringProps {
  data: ComicBook[];
  visibleColumns: ColumnConfig[];
  filters: Record<ColumnKey, string>;
  useOrFiltering: boolean;
}

export function useTableFiltering({ data, visibleColumns, filters, useOrFiltering }: UseTableFilteringProps) {
  // Get only columns that have active filters (check all columns, not just visible)
  const columnsWithFilters = (Object.keys(filters) as ColumnKey[])
    .filter((key) => filters[key]?.trim())
    .map((key) => ({ key, filterValue: filters[key] }));

  // If no filters, return all data
  if (columnsWithFilters.length === 0) {
    return { filteredData: data };
  }

  const filteredData = data.filter((item) => {
    const checks = columnsWithFilters.map(({ key, filterValue }) => {
      const val = item[key];
      try {
        const regex = new RegExp(filterValue, "i");
        if (Array.isArray(val)) return val.some((v) => regex.test(String(v)));
        return regex.test(String(val));
      } catch {
        return false;
      }
    });
    return useOrFiltering ? checks.some(Boolean) : checks.every(Boolean);
  });

  console.log("Filtering:", {
    totalItems: data.length,
    filteredItems: filteredData.length,
    activeFilters: columnsWithFilters,
    useOrFiltering,
  });

  return { filteredData };
}
