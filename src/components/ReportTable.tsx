import { Table } from "react-bootstrap";
import { ColumnConfig, ColumnKey, ComicBook } from "../interfaces/ComicBook";
import { useState } from "react";

export type ReportTableProps = {
  data: ComicBook[];
  columns: ColumnConfig[];
  filters: Record<ColumnKey, string>;
  useOrFiltering: boolean;
};

type SortDirection = "asc" | "desc";

type SortConfig = {
  key: keyof ComicBook;
  direction: SortDirection;
}[];

export const ReportTable = ({ data, columns, filters, useOrFiltering }: ReportTableProps) => {
  const visibleColumns = columns.filter((col) => col.visible);

  const [sortConfig, setSortConfig] = useState<SortConfig>([]);

  const toggleSort = (key: keyof ComicBook) => {
    setSortConfig((prev) => {
      const existing = prev.find((s) => s.key === key);
      if (!existing) {
        return [...prev, { key, direction: "asc" }];
      } else {
        // Toggle asc → desc → remove
        if (existing.direction === "asc") {
          return prev.map((s) =>
            s.key === key ? { ...s, direction: "desc" } : s
          );
        } else {
          return prev.filter((s) => s.key !== key);
        }
      }
    });
  };

  const filteredData = data.filter((item) => {
    const filterChecks = visibleColumns.map((col) => {
      const filterValue = filters[col.key];
      if (!filterValue) return useOrFiltering ? false : true;

      const cellValue = item[col.key];
      try {
        const regex = new RegExp(filterValue, "i");
        if (Array.isArray(cellValue)) {
          return cellValue.some((v) => regex.test(String(v)));
        }
        return regex.test(String(cellValue));
      } catch {
        return useOrFiltering ? false : true;
      }
    });

    return useOrFiltering ? filterChecks.some(Boolean) : filterChecks.every(Boolean);
  });

  const sortedData = [...filteredData].sort((a, b) => {
    for (const { key, direction } of sortConfig) {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue == null || bValue == null) continue;

      const aNum = Number(aValue);
      const bNum = Number(bValue);
      const bothNumeric = !isNaN(aNum) && !isNaN(bNum);

      let comparison = 0;

      if (bothNumeric) {
        comparison = aNum - bNum;
      } else {
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        if (aStr < bStr) comparison = -1;
        else if (aStr > bStr) comparison = 1;
      }

      if (comparison !== 0) {
        return direction === "asc" ? comparison : -comparison;
      }
    }

    return 0;
  });

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {visibleColumns.map((col) => {
            const activeSort = sortConfig.find((s) => s.key === col.key);
            const sortPriority = sortConfig.findIndex((s) => s.key === col.key) + 1; // Priority as 1-based index

            return (
              <th
                key={col.key}
                onClick={() => toggleSort(col.key)}
                style={{ cursor: "pointer", whiteSpace: "nowrap" }} // Prevent wrapping
              >
                {col.label}
                {activeSort && (
                  <span style={{ display: "inline-flex", alignItems: "center", marginLeft: "5px" }}>
                    <span style={{ marginRight: "5px" }}>
                      {activeSort.direction === "asc" ? "↑" : "↓"}
                    </span>
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

}  
