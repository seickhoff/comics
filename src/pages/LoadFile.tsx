import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAppContext } from "../hooks/useAppContext";
import { Container, Row, Col, Card } from "react-bootstrap";
import { JsonFileUploader } from "../components/JsonFileUploader";

export function LoadFile() {
  const { loading } = useAppContext();

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Load from File</h1>

      {loading && <LoadingSpinner />}

      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card>
            <Card.Body className="p-4">
              <JsonFileUploader />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
