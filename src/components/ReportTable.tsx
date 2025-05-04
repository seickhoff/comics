import { Table } from "react-bootstrap";
import { ColumnConfig, ColumnKey, ComicBook } from "../interfaces/ComicBook";

export type ReportTableProps = {
  data: ComicBook[];
  columns: ColumnConfig[];
  filters: Record<ColumnKey, string>;
  useOrFiltering: boolean;
};

export const ReportTable = ({ data, columns, filters, useOrFiltering }: ReportTableProps) => {
  const visibleColumns = columns.filter((col) => col.visible);

  const filteredData = data.filter((item) => {
    const filterChecks = visibleColumns.map((col) => {
      const filterValue = filters[col.key];
      if (!filterValue) return useOrFiltering ? false : true; // Important distinction

      const cellValue = item[col.key];
      try {
        const regex = new RegExp(filterValue, "i");
        if (Array.isArray(cellValue)) {
          return cellValue.some((v) => regex.test(String(v)));
        }
        return regex.test(String(cellValue));
      } catch {
        // Ignore invalid regexes
        return useOrFiltering ? false : true;
      }
    });

    return useOrFiltering ? filterChecks.some(Boolean) : filterChecks.every(Boolean);
  });

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {visibleColumns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredData.map((comic, index) => (
          <tr key={index}>
            {visibleColumns.map((col) => {
              const value = comic[col.key];
              const cellValue = Array.isArray(value) ? value.join(", ") : value;
              return <td key={col.key}>{cellValue}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
