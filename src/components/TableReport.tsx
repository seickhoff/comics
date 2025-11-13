import { Table, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { ComicBook } from "../interfaces/ComicBook";
import { useAppContext } from "../hooks/useAppContext";
import { ComicForm } from "./ComicForm";
import { getComicKey } from "../utils/comicKeys";
import { useTableSorting } from "../hooks/useTableSorting";
import { useTableFiltering } from "../hooks/useTableFiltering";
import { useTableSelection } from "../hooks/useTableSelection";
import { useComicDataUpdates } from "../hooks/useComicDataUpdates";
import { COLUMN_ALIGNMENT } from "../config/constants";

export type TableReportProps = {
  tableId: string;
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

  // Keep local table in sync with context
  useEffect(() => {
    setTableData(jsonData);
  }, [jsonData]);

  // Custom hooks for separation of concerns
  const { filteredData } = useTableFiltering({
    data: tableData,
    visibleColumns,
    filters,
    useOrFiltering,
  });

  const { sortConfig, toggleSort, sortedData } = useTableSorting({
    tableId,
    data: filteredData,
    tableSortConfig,
    setTableSortConfig,
  });

  const {
    selectedComic,
    setSelectedComic,
    showEditModal,
    setShowEditModal,
    isBatchMode,
    setIsBatchMode,
    toggleSelection,
    toggleSelectAll,
    handleRowClick,
  } = useTableSelection({
    tableData,
    sortedData,
    selectedKeys,
    setSelectedKeys,
    setHandleBatchEdit,
  });

  const { handleSave } = useComicDataUpdates({
    tableData,
    setTableData,
    setJsonData,
    selectedKeys,
    setSelectedKeys,
    isBatchMode,
    setShowEditModal,
    setSelectedComic,
    setIsBatchMode,
  });

  return (
    <>
      <Table striped bordered hover responsive style={{ fontSize: "0.875rem" }}>
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
                  const style: React.CSSProperties = {};
                  if ((COLUMN_ALIGNMENT.RIGHT as readonly string[]).includes(col.key)) style.textAlign = "right";
                  else if ((COLUMN_ALIGNMENT.CENTER as readonly string[]).includes(col.key)) style.textAlign = "center";

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
