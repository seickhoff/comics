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
  const {
    columns,
    jsonData,
    setJsonData,
    filters,
    useOrFiltering,
    tableSortConfig,
    setTableSortConfig,
    selectedKeys,
    setSelectedKeys,
    setHandleBatchEdit,
  } = useAppContext();

  const visibleColumns = columns.filter((col) => col.visible);

  // Local state
  const [tableData, setTableData] = useState<ComicBook[]>(jsonData);
  const [sortConfig, setSortConfig] = useState<SortConfig>(tableSortConfig[tableId] || []);
  const [selectedComic, setSelectedComic] = useState<ComicBook | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);

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
    setIsBatchMode(false);
    setShowEditModal(true);
  };

  const getComicKey = (c: ComicBook) => `${c.title}||${c.publisher}||${c.volume}||${c.issue}`;

  const toggleSelection = (key: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedKeys.size === sortedData.length) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(sortedData.map(getComicKey)));
    }
  };

  const handleEditSelected = () => {
    if (selectedKeys.size === 0) return;

    const selectedComics = tableData.filter((c) => selectedKeys.has(getComicKey(c)));
    const mergedComic: Partial<ComicBook> = {};
    const firstComic = selectedComics[0];

    (Object.keys(firstComic) as (keyof ComicBook)[]).forEach((field) => {
      const firstValue = firstComic[field];
      const allMatch = selectedComics.every((c) => {
        const value = c[field];
        if (Array.isArray(firstValue) && Array.isArray(value)) {
          return JSON.stringify(firstValue.sort()) === JSON.stringify(value.sort());
        }
        return String(value) === String(firstValue);
      });

      if (allMatch) {
        (mergedComic as any)[field] = firstValue;
      } else {
        if (Array.isArray(firstValue)) {
          (mergedComic as any)[field] = [];
        } else {
          (mergedComic as any)[field] = "";
        }
      }
    });

    setSelectedComic(mergedComic as ComicBook);
    setIsBatchMode(true);
    setShowEditModal(true);
  };

  // Register the batch edit handler in context so ReportConfigWrapper can call it
  useEffect(() => {
    setHandleBatchEdit(() => handleEditSelected);
    return () => setHandleBatchEdit(null);
  }, [tableData, selectedKeys, setHandleBatchEdit]);

  const formatFieldValue = (field: keyof ComicBook, value: any): any => {
    if (field === "value" && value && value.trim() !== "") {
      const num = Number(value);
      return isNaN(num) ? value : num.toFixed(2);
    }
    if (field === "month" && value && value.trim() !== "") {
      const monthNum = Number(value);
      return isNaN(monthNum) ? value : monthNum.toString().padStart(2, "0");
    }
    return value;
  };

  const isEmptyValue = (value: any): boolean => {
    return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
  };

  const shouldClearField = (value: any): boolean => {
    // Check if value is a single space (for text fields)
    if (value === " ") return true;
    // Check if array contains __CLEAR__ marker
    if (Array.isArray(value) && value.includes("__CLEAR__")) return true;
    return false;
  };

  const handleSave = (updatedComic: ComicBook) => {
    if (isBatchMode && selectedKeys.size > 0) {
      // Batch update: apply changes to all selected comics
      setTableData((prev) =>
        prev.map((c) => {
          const key = getComicKey(c);
          if (selectedKeys.has(key)) {
            // Merge updates, only overwrite non-empty fields
            const updated = { ...c };
            (Object.keys(updatedComic) as (keyof ComicBook)[]).forEach((field) => {
              const newValue = updatedComic[field];

              // Check if user wants to clear this field
              if (shouldClearField(newValue)) {
                if (Array.isArray(newValue)) {
                  (updated as any)[field] = [];
                } else {
                  (updated as any)[field] = "";
                }
              }
              // Empty strings and empty arrays mean "no change" in batch mode
              else if (!isEmptyValue(newValue)) {
                (updated as any)[field] = formatFieldValue(field, newValue);
              }
            });
            return updated;
          }
          return c;
        })
      );

      setJsonData((prev) =>
        prev.map((c) => {
          const key = getComicKey(c);
          if (selectedKeys.has(key)) {
            const updated = { ...c };
            (Object.keys(updatedComic) as (keyof ComicBook)[]).forEach((field) => {
              const newValue = updatedComic[field];

              if (shouldClearField(newValue)) {
                if (Array.isArray(newValue)) {
                  (updated as any)[field] = [];
                } else {
                  (updated as any)[field] = "";
                }
              } else if (!isEmptyValue(newValue)) {
                (updated as any)[field] = formatFieldValue(field, newValue);
              }
            });
            return updated;
          }
          return c;
        })
      );

      setSelectedKeys(new Set());
    } else {
      // Single update
      const formatted = { ...updatedComic };
      (Object.keys(formatted) as (keyof ComicBook)[]).forEach((field) => {
        (formatted as any)[field] = formatFieldValue(field, formatted[field]);
      });

      const key = getComicKey(formatted);
      setTableData((prev) => prev.map((c) => (getComicKey(c) === key ? formatted : c)));
      setJsonData((prev) => prev.map((c) => (getComicKey(c) === key ? formatted : c)));
    }

    setShowEditModal(false);
    setSelectedComic(null);
    setIsBatchMode(false);
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
            <th
              style={{ width: 40, textAlign: "center", cursor: "pointer", userSelect: "none" }}
              onClick={toggleSelectAll}
              title="Select/deselect all"
            >
              {sortedData.length > 0 && selectedKeys.size === sortedData.length ? "✓" : ""}
            </th>
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
            const isSelected = selectedKeys.has(key);
            return (
              <tr
                key={key}
                onClick={() => handleRowClick(row)}
                style={{
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#e3f2fd" : undefined,
                }}
              >
                <td
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    userSelect: "none",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                  }}
                  onClick={(e) => toggleSelection(key, e)}
                >
                  {isSelected ? "✓" : ""}
                </td>
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
          <Modal.Title>{isBatchMode ? `Edit ${selectedKeys.size} Comics` : "Edit Comic"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComic && (
            <>
              {isBatchMode && (
                <div style={{ marginBottom: 15, padding: 10, backgroundColor: "#fff3cd", borderRadius: 5 }}>
                  <strong>Batch Edit Mode:</strong> Only fields you modify will be updated across all{" "}
                  {selectedKeys.size} selected comics.
                </div>
              )}
              <ComicForm
                mode="edit"
                existingComics={tableData}
                initialComic={selectedComic}
                onSubmit={handleSave}
                onCancel={() => setShowEditModal(false)}
                isBatchMode={isBatchMode}
              />
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
