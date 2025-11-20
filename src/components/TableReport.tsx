import { Table, Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { CheckSquare } from "react-bootstrap-icons";
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
    isMobileView,
    mobileColumns,
    desktopColumns,
    jsonData,
    setJsonData,
    filters,
    setFilters,
    useOrFiltering,
    mobileTableSortConfig,
    setMobileTableSortConfig,
    desktopTableSortConfig,
    setDesktopTableSortConfig,
    selectedKeys,
    setSelectedKeys,
    setHandleBatchEdit,
  } = useAppContext();

  // Use viewport-specific columns and sort config
  const columns = isMobileView ? mobileColumns : desktopColumns;
  const tableSortConfig = isMobileView ? mobileTableSortConfig : desktopTableSortConfig;
  const setTableSortConfig = isMobileView ? setMobileTableSortConfig : setDesktopTableSortConfig;
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

  // Add a key based on viewport to force re-initialization when switching
  const sortingKey = `${tableId}-${isMobileView ? "mobile" : "desktop"}`;

  const { sortConfig, toggleSort, sortedData } = useTableSorting({
    tableId: sortingKey,
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

  // Determine checkbox color based on selection state
  const getCheckboxColor = () => {
    if (sortedData.length === 0) return "#d3d3d3"; // light grey when no data
    if (selectedKeys.size === 0) return "#d3d3d3"; // light grey when nothing selected
    if (selectedKeys.size === sortedData.length) return "#000000"; // black when all selected
    return "#808080"; // gray when 1 or more (but not all) selected
  };

  // Calculate summary statistics for visible/filtered data
  const issueCount = sortedData.length;
  const totalPrice = sortedData.reduce((sum, comic) => sum + Number(comic.value || 0), 0);
  const avgPrice = issueCount > 0 ? totalPrice / issueCount : 0;

  // Reset sort handler
  const handleResetSort = () => {
    if (isMobileView) {
      setMobileTableSortConfig((prev) => ({ ...prev, [sortingKey]: [] }));
    } else {
      setDesktopTableSortConfig((prev) => ({ ...prev, [sortingKey]: [] }));
    }
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setFilters({} as Record<import("../interfaces/ComicBook").ColumnKey, string>);
  };

  // Check if there are active filters
  const hasActiveFilters = Object.values(filters).some((value) => value?.trim());

  return (
    <>
      {/* Summary Badges */}
      {issueCount > 0 && (
        <div className="mb-3 d-flex flex-wrap gap-2 justify-content-center justify-content-md-between align-items-center">
          <div className="d-flex flex-wrap gap-2">
            <span
              className="badge bg-secondary"
              style={{
                fontSize: "0.75rem",
                padding: "0.35rem 0.5rem",
              }}
            >
              Issues: {issueCount}
            </span>
            <span
              className="badge bg-secondary"
              style={{
                fontSize: "0.75rem",
                padding: "0.35rem 0.5rem",
              }}
            >
              Total: ${totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className="badge bg-secondary"
              style={{
                fontSize: "0.75rem",
                padding: "0.35rem 0.5rem",
              }}
            >
              Avg: ${avgPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm" onClick={handleResetFilters} disabled={!hasActiveFilters}>
              Reset Filters
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={handleResetSort}>
              Reset Sort
            </Button>
          </div>
        </div>
      )}

      <Table striped bordered hover responsive style={{ fontSize: isMobileView ? "0.75rem" : "0.875rem" }}>
        <thead>
          <tr>
            <th
              style={{
                width: 30,
                textAlign: "center",
                cursor: "pointer",
                userSelect: "none",
                padding: isMobileView ? "0.25rem 0.15rem" : "0.5rem 0.25rem",
              }}
              onClick={toggleSelectAll}
              title="Select/deselect all"
            >
              <CheckSquare size={16} color={getCheckboxColor()} />
            </th>
            {visibleColumns.map((col) => {
              const activeSort = sortConfig.find((s) => s.key === col.key);
              const sortPriority = sortConfig.findIndex((s) => s.key === col.key) + 1;
              return (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  style={{
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    padding: isMobileView ? "0.25rem 0.35rem" : undefined,
                  }}
                >
                  {col.label}
                  {activeSort && (
                    <span style={{ marginLeft: 3, fontSize: "0.75rem" }}>
                      {activeSort.direction === "asc" ? "↑" : "↓"}
                      <sup style={{ fontSize: "0.7em" }}>{sortPriority}</sup>
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
                    fontSize: "1rem",
                    lineHeight: "1",
                    verticalAlign: "middle",
                    padding: isMobileView ? "0.25rem 0.15rem" : "0.5rem 0.25rem",
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
                  const style: React.CSSProperties = {
                    padding: isMobileView ? "0.25rem 0.35rem" : undefined,
                  };
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
