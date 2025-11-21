import { Container, Row, Col, Card, Badge, Alert } from "react-bootstrap";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAppContext } from "../hooks/useAppContext";
import { JsonFileUploader } from "../components/JsonFileUploader";
import { JsonFileDownloader } from "../components/JsonFileDownloader";
import { JsonClipboardImporter } from "../components/JsonClipboardImporter";
import { JsonDataViewer } from "../components/JsonDataViewer";

// Card styling constants
const CARD_MIN_HEIGHT = "320px";
const CARD_MAX_HEIGHT = "500px";

const cardStyle = {
  minHeight: CARD_MIN_HEIGHT,
  maxHeight: CARD_MAX_HEIGHT,
};

const cardBodyStyle = {
  overflow: "auto" as const,
};

export function File() {
  const { loading, fileName, jsonData } = useAppContext();

  return (
    <Container className="mt-4">
      <h1 className="mb-3">File Manager</h1>

      {fileName && (
        <div className="mb-4 d-flex align-items-center gap-2">
          <span className="text-muted small">Current File:</span>
          <Badge bg="" className="border border-secondary text-secondary">
            {fileName}
          </Badge>
          {jsonData.length > 0 && <span className="text-muted small">({jsonData.length} comics loaded)</span>}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {/* Load and Import Row */}
      <Row className="g-4 mb-4">
        <Col xs={12} lg={6}>
          <Card style={cardStyle}>
            <Card.Header>
              <h5 className="mb-0">Load from File</h5>
            </Card.Header>
            <Card.Body style={cardBodyStyle}>
              <JsonFileUploader />
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card style={cardStyle}>
            <Card.Header>
              <h5 className="mb-0">Import from Clipboard</h5>
            </Card.Header>
            <Card.Body style={cardBodyStyle}>
              <JsonClipboardImporter />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Export and Preview Row */}
      <Row className="g-4 mb-4">
        <Col xs={12} lg={6}>
          <Card style={cardStyle}>
            <Card.Header>
              <h5 className="mb-0">Export Collection</h5>
            </Card.Header>
            <Card.Body style={cardBodyStyle}>
              {fileName ? (
                <JsonFileDownloader />
              ) : (
                <Alert variant="light" className="mb-0 text-center border">
                  <p className="text-muted mb-0">Load or create a collection first to enable export</p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card style={cardStyle}>
            <Card.Header>
              <h5 className="mb-0">Preview Data</h5>
            </Card.Header>
            <Card.Body style={cardBodyStyle}>
              {fileName ? (
                <JsonDataViewer />
              ) : (
                <Alert variant="light" className="mb-0 text-center border">
                  <p className="text-muted mb-0">Load or create a collection first to preview data</p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
