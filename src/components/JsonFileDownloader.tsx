import { useAppContext } from "../hooks/useAppContext";
import { Card, Button, Alert } from "react-bootstrap";

export function JsonFileDownloader() {
  const { jsonData, fileName } = useAppContext();

  if (!fileName) return null;

  const handleDownload = () => {
    const dataStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Download JSON Data</Card.Title>
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
