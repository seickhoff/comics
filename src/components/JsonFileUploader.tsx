import { useAppContext } from "../hooks/useAppContext";
import { Card, Button, Alert } from "react-bootstrap";

export default function JsonFileUploader() {
  const { setJsonData } = useAppContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setJsonData(data);
      } catch (error) {
        alert("Error parsing JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    // <Container className="mt-4">
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Upload JSON File</Card.Title>
        <div className="d-flex justify-content-center">
          <Button variant="primary" className="mb-3">
            <label htmlFor="file-upload" className="w-100">
              Choose File
            </label>
          </Button>
          <input
            type="file"
            id="file-upload"
            accept=".json"
            onChange={handleFileChange}
            hidden
          />
        </div>
        <Alert variant="info">
          Click the button to select a JSON file to upload
        </Alert>
      </Card.Body>
    </Card>
    // </Container>
  );
}
