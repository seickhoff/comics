import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useToast } from "../context/ToastContext";
import { Button, Alert, Form, InputGroup } from "react-bootstrap";
import { normalizeComicBook } from "../utils/normalizeComicBook";
import { ExportFormat } from "../interfaces/ExportFormat";

export function JsonFileDownloader() {
  const { jsonData, fileName, setFileName, columns, filters, useOrFiltering, tableSortConfig, settings } =
    useAppContext();
  const { addToast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);

  if (!fileName) return null;

  const getExportData = () => {
    // Normalize all data before export to ensure consistent types
    const normalized = jsonData.map(normalizeComicBook);

    // Create export format with metadata and app context
    const exportData: ExportFormat = {
      appName: "Comic Book Collection Manager",
      version: "2.0",
      exportDate: new Date().toISOString(),
      columns,
      filters,
      useOrFiltering,
      tableSortConfig,
      settings,
      comics: normalized,
    };

    return exportData;
  };

  const addTimestamp = () => {
    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join("-");

    const nameParts = fileName.split(".");
    const extension = nameParts.pop();
    let baseName = nameParts.join(".");

    // Remove existing timestamp pattern (yyyy-mm-dd-hh-mm-ss)
    baseName = baseName.replace(/-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/, "");

    setFileName(`${baseName}-${timestamp}.${extension}`);
  };

  const handleCopyToClipboard = async () => {
    try {
      const exportData = getExportData();
      const dataStr = JSON.stringify(exportData, null, 2);
      await navigator.clipboard.writeText(dataStr);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      addToast({
        title: "Success",
        body: `Copied ${jsonData.length} comics to clipboard`,
        bg: "success",
      });
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      addToast({
        title: "Error",
        body: "Failed to copy to clipboard",
        bg: "danger",
      });
    }
  };

  const handleDownload = () => {
    try {
      const exportData = getExportData();
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);

      addToast({
        title: "Success",
        body: `Downloaded ${jsonData.length} comics to ${fileName}`,
        bg: "success",
      });
    } catch (error) {
      console.error("Failed to download file:", error);
      addToast({
        title: "Error",
        body: "Failed to download file",
        bg: "danger",
      });
    }
  };

  return (
    <div>
      <Alert variant="light" className="mb-3 small border">
        Download your collection as a file or copy to clipboard. Includes all settings (filters, sorting, columns) to
        restore your workspace later.
      </Alert>
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Filename</Form.Label>
        <InputGroup size="lg">
          <Form.Control
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter filename"
          />
          <Button variant="outline-secondary" onClick={addTimestamp} title="Add timestamp to filename">
            + Timestamp
          </Button>
        </InputGroup>
      </Form.Group>
      <div className="d-flex justify-content-center gap-3">
        <Button variant="success" size="lg" onClick={handleDownload} disabled={!jsonData}>
          Download File
        </Button>
        <Button variant="outline-primary" size="lg" onClick={handleCopyToClipboard} disabled={!jsonData}>
          {copySuccess ? "Copied!" : "Copy to Clipboard"}
        </Button>
      </div>
    </div>
  );
}
