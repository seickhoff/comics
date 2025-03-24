import { useAppContext } from "../hooks/useAppContext";
import { Card, Button, Alert } from "react-bootstrap";

export default function JsonFileDownloader() {
  const { jsonData } = useAppContext();

  const handleDownload = () => {
    if (!jsonData) {
      alert("No JSON data available to download");
      return;
    }

    const dataStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // a.target = '_blank'; // opens in a new tab
    // void a.click(); // Simulate a link click that opens in new tab

    URL.revokeObjectURL(url);
  };

  return (
    // <Container className="mt-4">
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Download JSON Data</Card.Title>
        <div className="d-flex justify-content-center">
          <Button
            variant="success"
            onClick={handleDownload}
            disabled={!jsonData}
            className="mb-3"
          >
            Download JSON
          </Button>
        </div>
        <Alert variant="info">
          Click the button to download the current JSON data
        </Alert>
      </Card.Body>
    </Card>
    // </Container>
  );
}
