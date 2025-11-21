import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Button, Collapse, Badge } from "react-bootstrap";
import { normalizeComicBook } from "../utils/normalizeComicBook";
import { ExportFormat } from "../interfaces/ExportFormat";

export function JsonDataViewer() {
  const {
    jsonData,
    fileName,
    columns,
    mobileColumns,
    desktopColumns,
    filters,
    useOrFiltering,
    tableSortConfig,
    mobileTableSortConfig,
    desktopTableSortConfig,
    settings,
  } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  if (!fileName) return null;

  // Create the export format structure to show what will be saved
  const exportData: ExportFormat = {
    appName: "Comic Book Collection Manager",
    version: "2.0",
    exportDate: new Date().toISOString(),
    columns,
    mobileColumns,
    desktopColumns,
    filters,
    useOrFiltering,
    tableSortConfig,
    mobileTableSortConfig,
    desktopTableSortConfig,
    settings,
    comics: jsonData.map(normalizeComicBook),
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const comicCount = jsonData.length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="text-muted mb-0 small">View the complete export format with all settings and comic data</p>
        </div>
        <Badge bg="" className="fs-6 border border-secondary text-secondary">
          {comicCount} comics
        </Badge>
      </div>
      <div className="d-flex justify-content-center mb-3">
        <Button variant="outline-secondary" size="lg" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Hide JSON" : "Show JSON"}
        </Button>
      </div>
      <Collapse in={isOpen}>
        <div>
          <pre
            style={{
              backgroundColor: "#f5f5f5",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              maxHeight: "600px",
              overflow: "auto",
              fontSize: "0.875rem",
              border: "1px solid #dee2e6",
            }}
          >
            <code>{jsonString}</code>
          </pre>
        </div>
      </Collapse>
    </div>
  );
}
