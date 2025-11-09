import { Container, Row, Col, Card } from "react-bootstrap";
import { JsonClipboardImporter } from "../components/JsonClipboardImporter";

export function ImportClipboard() {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Import from Clipboard</h1>

      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card>
            <Card.Body className="p-4">
              <JsonClipboardImporter />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
