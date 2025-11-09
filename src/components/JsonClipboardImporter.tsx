import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useToast } from "../context/ToastContext";
import { Button, Alert, Form } from "react-bootstrap";
import { loadCollectionData } from "../utils/collectionLoader";
import { APP_CONFIG } from "../config/constants";

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

      const result = loadCollectionData(
        rawData,
        {
          setJsonData,
          setFileName,
          setColumns,
          setFilters,
          setUseOrFiltering,
          setTableSortConfig,
        },
        APP_CONFIG.DEFAULT_FILENAME
      );

      if (result.success) {
        // Clear the textarea and show success
        setPastedJson("");
        addToast({
          title: "Success",
          body: `Imported ${result.count} comics successfully!`,
          bg: "success",
        });
      } else {
        setError(result.error || "Failed to import collection");
      }
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
