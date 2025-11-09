import { Container, Row, Col, Card } from "react-bootstrap";
import { JsonFileDownloader } from "../components/JsonFileDownloader";

export function ExportCollection() {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Export Collection</h1>

      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card>
            <Card.Body className="p-4">
              <JsonFileDownloader />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
