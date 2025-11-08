import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Card, Button, Collapse, Badge } from "react-bootstrap";
import { normalizeComicBook } from "../utils/normalizeComicBook";
import { ExportFormat } from "../interfaces/ExportFormat";

export function JsonDataViewer() {
  const { jsonData, fileName, columns, filters, useOrFiltering, tableSortConfig } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  if (!fileName) return null;

  // Create the export format structure to show what will be saved
  const exportData: ExportFormat = {
    appName: "Comic Book Collection Manager",
    version: "2.0",
    exportDate: new Date().toISOString(),
    columns,
    filters,
    useOrFiltering,
    tableSortConfig,
    comics: jsonData.map(normalizeComicBook),
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const comicCount = jsonData.length;

  return (
    <Card className="mt-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0">JSON Data Preview</Card.Title>
          <Badge bg="secondary">{comicCount} comics</Badge>
        </div>
        <p className="text-muted mb-3">View the complete export format with all settings and comic data</p>
        <Button variant="outline-primary" onClick={() => setIsOpen(!isOpen)} className="mb-3">
          {isOpen ? "Hide" : "Show"} JSON Data
        </Button>
        <Collapse in={isOpen}>
          <div>
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "1rem",
                borderRadius: "0.25rem",
                maxHeight: "500px",
                overflow: "auto",
                fontSize: "0.875rem",
              }}
            >
              <code>{jsonString}</code>
            </pre>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
}
