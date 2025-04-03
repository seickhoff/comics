import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useAppContext } from "../../hooks/useAppContext";
import { Card, Container } from "react-bootstrap";
import JsonFileUploader from "../../components/JsonFileUploader";

export default function Open() {
  const { loading, jsonData } = useAppContext();

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Open Comic Book File</h1>

      {loading && <LoadingSpinner />}

      <JsonFileUploader />

      {jsonData && (
        <Card className="mt-4">
          <Card.Body>

            <p>File loaded</p>

          </Card.Body>
        </Card>
      )}

    </Container>
  );
}
