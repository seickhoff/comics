import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Card, Button, Alert, Spinner } from "react-bootstrap";

export function JsonFileUploader() {
  const { setJsonData, setLoading, setFileName } = useAppContext();
  const [loading, setLocalLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setLocalLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setJsonData(data);
      } catch (error) {
        console.log(error);
        alert("Error parsing JSON file");
      } finally {
        setLoading(false);
        setLocalLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Open Comic Book File</Card.Title>
        <div className="d-flex justify-content-center">
          <Button variant="primary" className="mb-3" disabled={loading}>
            <label htmlFor="file-upload" className="w-100">
              {loading ? <Spinner animation="border" size="sm" /> : "Choose File"}
            </label>
          </Button>
          <input type="file" id="file-upload" accept=".json" onChange={handleFileChange} hidden disabled={loading} />
        </div>
        {loading && <Alert variant="warning">Loading file...</Alert>}
        {!loading && <Alert variant="info">Click the button to select a JSON file to upload</Alert>}
      </Card.Body>
    </Card>
  );
}
