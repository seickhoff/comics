import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useToast } from "../context/ToastContext";
import { Button, Alert, Form } from "react-bootstrap";
import { normalizeComicBook } from "../utils/normalizeComicBook";
import { sortComics } from "../utils/comicSorting";
import { isExportFormat } from "../utils/exportFormat";

export function JsonClipboardImporter() {
  const { setJsonData, setFileName, setColumns, setFilters, setUseOrFiltering, setTableSortConfig } = useAppContext();
  const { addToast } = useToast();
  const [pastedJson, setPastedJson] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    setError(null);

    if (!pastedJson.trim()) {
      setError("Please paste JSON data first");
      return;
    }

    try {
      const rawData = JSON.parse(pastedJson);

      // Check if it's the new format or legacy format
      if (isExportFormat(rawData)) {
        // New format: restore all app context settings
        const normalized = rawData.comics.map(normalizeComicBook);
        const sorted = sortComics(normalized);
        setJsonData(sorted);

        // Restore app context settings
        if (rawData.columns) setColumns(rawData.columns);
        if (rawData.filters) setFilters(rawData.filters);
        if (typeof rawData.useOrFiltering === "boolean") setUseOrFiltering(rawData.useOrFiltering);
        if (rawData.tableSortConfig) setTableSortConfig(rawData.tableSortConfig);
      } else {
        // Legacy format: just an array of comics
        const normalized = Array.isArray(rawData) ? rawData.map(normalizeComicBook) : [];
        const sorted = sortComics(normalized);
        setJsonData(sorted);
      }

      // Reset filename to default
      setFileName("new-collection.json");

      // Clear the textarea and show success
      setPastedJson("");
      addToast({
        title: "Success",
        body: "Collection imported successfully!",
        bg: "success",
      });
    } catch (err) {
      console.error(err);
      setError("Invalid JSON format. Please check your data and try again.");
    }
  };

  return (
    <div>
      <Alert variant="light" className="mb-3 small border">
        Paste JSON data from your clipboard and click Import to load it as a collection. The filename will be reset to
        the default value.
      </Alert>
      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows={8}
          value={pastedJson}
          onChange={(e) => setPastedJson(e.target.value)}
          placeholder="Paste your JSON collection data here..."
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="d-flex justify-content-center">
        <Button variant="primary" size="lg" onClick={handleImport} disabled={!pastedJson.trim()}>
          Import Collection
        </Button>
      </div>
    </div>
  );
}
