import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useToast } from "../context/ToastContext";
import { Button, Alert, Spinner } from "react-bootstrap";
import { loadCollectionData } from "../utils/collectionLoader";
import { defaultColumns, defaultMobileColumns, defaultDesktopColumns } from "../config/columnDefaults";

export function JsonFileUploader() {
  const {
    setJsonData,
    setLoading,
    setFileName,
    setColumns,
    setMobileColumns,
    setDesktopColumns,
    setFilters,
    setUseOrFiltering,
    setTableSortConfig,
    setMobileTableSortConfig,
    setDesktopTableSortConfig,
    setSettings,
  } = useAppContext();
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

        const result = loadCollectionData(
          rawData,
          {
            setJsonData,
            setFileName,
            setColumns,
            setMobileColumns,
            setDesktopColumns,
            setFilters,
            setUseOrFiltering,
            setTableSortConfig,
            setMobileTableSortConfig,
            setDesktopTableSortConfig,
            setSettings,
            defaultColumns,
            defaultMobileColumns,
            defaultDesktopColumns,
          },
          file.name
        );

        if (result.success) {
          addToast({
            title: "Success",
            body: `Loaded ${result.count} comics from ${file.name}`,
            bg: "success",
          });
        } else {
          addToast({
            title: "Error",
            body: result.error || "Failed to load collection",
            bg: "danger",
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
