import { Container, Row, Col, Card } from "react-bootstrap";
import { JsonDataViewer } from "../components/JsonDataViewer";

export function PreviewData() {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Preview Data</h1>

      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card>
            <Card.Body className="p-4">
              <JsonDataViewer />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
