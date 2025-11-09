import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useToast } from "../context/ToastContext";
import { Button, Alert, Form } from "react-bootstrap";
import { normalizeComicBook } from "../utils/normalizeComicBook";
import { ComicBook } from "../interfaces/ComicBook";
import { ExportFormat } from "../interfaces/ExportFormat";

export function JsonClipboardImporter() {
  const { setJsonData, setFileName, setColumns, setFilters, setUseOrFiltering, setTableSortConfig } = useAppContext();
  const { addToast } = useToast();
  const [pastedJson, setPastedJson] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Helper functions from JsonFileUploader
  function parseNumber(str: string): number | null {
    const num = Number(str);
    return Number.isFinite(num) ? num : null;
  }

  function normalizeTitle(title: string): string {
    if (title.startsWith("The ")) {
      return title.slice(4) + ", The";
    }
    return title;
  }

  function sortComics(data: ComicBook[]) {
    return [...data].sort((a, b) => {
      // 1. Title (normalize for sorting)
      const t = normalizeTitle(a.title).localeCompare(normalizeTitle(b.title));
      if (t !== 0) return t;

      // 2. Volume
      const av = parseNumber(a.volume);
      const bv = parseNumber(b.volume);
      if (av !== null && bv !== null) {
        if (av !== bv) return av - bv;
      } else {
        const v = a.volume.localeCompare(b.volume);
        if (v !== 0) return v;
      }

      // 3. Issue
      const ai = parseNumber(a.issue);
      const bi = parseNumber(b.issue);
      if (ai !== null && bi !== null) {
        return ai - bi;
      }
      return a.issue.localeCompare(b.issue);
    });
  }

  // Type guard to check if data is in new ExportFormat
  function isExportFormat(data: unknown): data is ExportFormat {
    return (
      typeof data === "object" && data !== null && "comics" in data && Array.isArray((data as ExportFormat).comics)
    );
  }

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
