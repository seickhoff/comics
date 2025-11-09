import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useToast } from "../context/ToastContext";
import { Button, Alert, Spinner } from "react-bootstrap";
import { normalizeComicBook } from "../utils/normalizeComicBook";
import { sortComics } from "../utils/comicSorting";
import { isExportFormat } from "../utils/exportFormat";

export function JsonFileUploader() {
  const { setJsonData, setLoading, setFileName, setColumns, setFilters, setUseOrFiltering, setTableSortConfig } =
    useAppContext();
  const { addToast } = useToast();
  const [loading, setLocalLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setLocalLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawData = JSON.parse(e.target?.result as string);

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

          // Only set filename after successful load
          setFileName(file.name);

          addToast({
            title: "Success",
            body: `Loaded ${sorted.length} comics from ${file.name}`,
            bg: "success",
          });
        } else {
          // Legacy format: just an array of comics
          const normalized = Array.isArray(rawData) ? rawData.map(normalizeComicBook) : [];
          const sorted = sortComics(normalized);
          setJsonData(sorted);

          // Only set filename after successful load
          setFileName(file.name);

          addToast({
            title: "Success",
            body: `Loaded ${sorted.length} comics from ${file.name}`,
            bg: "success",
          });
        }
      } catch (error) {
        console.error(error);
        addToast({
          title: "Error",
          body: "Error parsing JSON file. Please check the file format.",
          bg: "danger",
        });
      } finally {
        setLoading(false);
        setLocalLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleStartNew = () => {
    setJsonData([]);
    setFileName("new-collection.json");
  };

  return (
    <div>
      <Alert variant="light" className="mb-3 small border">
        Load an existing collection or start a new one. Collections saved from this app will restore all your settings
        (filters, sorting, columns). Legacy files with just comic data are also supported.
      </Alert>
      <div className="d-flex justify-content-center gap-2 mb-3">
        <Button variant="primary" size="lg" disabled={loading}>
          <label htmlFor="file-upload" className="w-100" style={{ cursor: "pointer", margin: 0 }}>
            {loading ? <Spinner animation="border" size="sm" /> : "Load Collection"}
          </label>
        </Button>
        <input type="file" id="file-upload" accept=".json" onChange={handleFileChange} hidden disabled={loading} />

        <Button variant="success" size="lg" onClick={handleStartNew} disabled={loading}>
          New Collection
        </Button>
      </div>
      {loading && (
        <Alert variant="warning" className="mb-0">
          Loading collection...
        </Alert>
      )}
    </div>
  );
}
