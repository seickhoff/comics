import { useState, useEffect } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Card, Button, Alert, Form, InputGroup } from "react-bootstrap";
import { normalizeComicBook } from "../utils/normalizeComicBook";

export function JsonFileDownloader() {
  const { jsonData, fileName } = useAppContext();
  const [downloadName, setDownloadName] = useState(fileName || "comics.json");

  // Update downloadName when fileName changes
  useEffect(() => {
    setDownloadName(fileName || "comics.json");
  }, [fileName]);

  if (!fileName) return null;

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

    const nameParts = downloadName.split(".");
    const extension = nameParts.pop();
    let baseName = nameParts.join(".");

    // Remove existing timestamp pattern (yyyy-mm-dd-hh-mm-ss)
    baseName = baseName.replace(/-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/, "");

    setDownloadName(`${baseName}-${timestamp}.${extension}`);
  };

  const handleDownload = () => {
    // Normalize all data before download to ensure consistent types
    const normalized = jsonData.map(normalizeComicBook);
    const dataStr = JSON.stringify(normalized, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Download JSON Data</Card.Title>
        <Form.Group className="mb-3">
          <Form.Label>Filename</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              value={downloadName}
              onChange={(e) => setDownloadName(e.target.value)}
              placeholder="Enter filename"
            />
            <Button variant="outline-secondary" onClick={addTimestamp} title="Add timestamp to filename">
              + Timestamp
            </Button>
          </InputGroup>
        </Form.Group>
        <div className="d-flex justify-content-center">
          <Button variant="success" onClick={handleDownload} disabled={!jsonData} className="mb-3">
            Download JSON
          </Button>
        </div>
        <Alert variant="info">Click the button to download the current JSON data</Alert>
      </Card.Body>
    </Card>
  );
}
