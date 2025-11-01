import { Table, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { ComicBook } from "../interfaces/ComicBook";
import { useAppContext } from "../hooks/useAppContext";
import { ComicForm } from "./ComicForm";

type SortDirection = "asc" | "desc";
type SortConfig = { key: keyof ComicBook; direction: SortDirection }[];

export type TableReportProps = {
  tableId: string; // unique ID for storing sort state
};

export const TableReport = ({ tableId }: TableReportProps) => {
  const { columns, jsonData, setJsonData, filters, useOrFiltering, tableSortConfig, setTableSortConfig } =
    useAppContext();

  const visibleColumns = columns.filter((col) => col.visible);

  // Local state
  const [tableData, setTableData] = useState<ComicBook[]>(jsonData);
  const [sortConfig, setSortConfig] = useState<SortConfig>(tableSortConfig[tableId] || []);
  const [selectedComic, setSelectedComic] = useState<ComicBook | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Keep local table in sync with context
  useEffect(() => {
    setTableData(jsonData);
  }, [jsonData]);

  // Persist sort config to context
  useEffect(() => {
    setTableSortConfig({ ...tableSortConfig, [tableId]: sortConfig });
  }, [sortConfig]);

  const normalizeTitle = (title: string) => (title.startsWith("The ") ? title.slice(4) + ", The" : title);

  const toggleSort = (key: keyof ComicBook) => {
    setSortConfig((prev) => {
      const existing = prev.find((s) => s.key === key);
      if (!existing) return [...prev, { key, direction: "asc" }];
      if (existing.direction === "asc") return prev.map((s) => (s.key === key ? { ...s, direction: "desc" } : s));
      return prev.filter((s) => s.key !== key);
    });
  };

  const handleRowClick = (comic: ComicBook) => {
    setSelectedComic(comic);
    setShowEditModal(true);
  };

  const getComicKey = (c: ComicBook) => `${c.title}||${c.publisher}||${c.volume}||${c.issue}`;

  const handleSave = (updatedComic: ComicBook) => {
    // Format value if not blank
    if (updatedComic.value && updatedComic.value.trim() !== "") {
      const num = Number(updatedComic.value);
      updatedComic.value = isNaN(num) ? updatedComic.value : num.toFixed(2);
    }

    // Format month if not blank
    if (updatedComic.month && updatedComic.month.trim() !== "") {
      const monthNum = Number(updatedComic.month);
      updatedComic.month = isNaN(monthNum) ? updatedComic.month : monthNum.toString().padStart(2, "0");
    }

    const key = getComicKey(updatedComic);

    // Update local tableData
    setTableData((prev) => prev.map((c) => (getComicKey(c) === key ? updatedComic : c)));

    // Update context
    setJsonData((prev) => prev.map((c) => (getComicKey(c) === key ? updatedComic : c)));

    setShowEditModal(false);
    setSelectedComic(null);
  };

  // Filtering
  const filteredData = tableData.filter((item) => {
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

  // Sorting
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
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {visibleColumns.map((col) => {
              const activeSort = sortConfig.find((s) => s.key === col.key);
              const sortPriority = sortConfig.findIndex((s) => s.key === col.key) + 1;
              return (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {col.label}
                  {activeSort && (
                    <span style={{ marginLeft: 5 }}>
                      {activeSort.direction === "asc" ? "↑" : "↓"} {sortPriority}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => {
            const key = getComicKey(row);
            return (
              <tr key={key} onClick={() => handleRowClick(row)} style={{ cursor: "pointer" }}>
                {visibleColumns.map((col) => {
                  let value = row[col.key];

                  // Format money column
                  if (col.key === "value" && typeof value === "string") {
                    const num = Number(value);
                    value = isNaN(num) ? value : num.toLocaleString("en-US", { style: "currency", currency: "USD" });
                  }

                  const display = Array.isArray(value) ? value.join(", ") : value;

                  // Alignment
                  const centerCols: (keyof ComicBook)[] = ["issue", "month", "year", "quantity", "condition"];
                  const style: React.CSSProperties = {};
                  if (col.key === "value") style.textAlign = "right";
                  else if (centerCols.includes(col.key)) style.textAlign = "center";

                  return (
                    <td key={col.key} style={style}>
                      {display}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Comic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComic && (
            <ComicForm
              mode="edit"
              existingComics={tableData}
              initialComic={selectedComic}
              onSubmit={handleSave}
              onCancel={() => setShowEditModal(false)}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
