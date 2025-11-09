import { useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAppContext } from "../hooks/useAppContext";
import { Container, Tabs, Tab, Row, Col, Card, Badge } from "react-bootstrap";
import { JsonFileUploader } from "../components/JsonFileUploader";
import { JsonFileDownloader } from "../components/JsonFileDownloader";
import { JsonClipboardImporter } from "../components/JsonClipboardImporter";
import { JsonDataViewer } from "../components/JsonDataViewer";

export function File() {
  const { loading, fileName, jsonData } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>("load-file");

  // Custom styles for enhanced tab visualization
  const tabStyles = `
    .nav-tabs .nav-link {
      border: 2px solid transparent;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .nav-tabs .nav-link:hover:not(.active) {
      border-color: #dee2e6;
      background-color: #f8f9fa;
    }
    .nav-tabs .nav-link.active {
      border: 2px solid #0d6efd;
      border-bottom-color: transparent;
      font-weight: 600;
      background-color: #fff;
      position: relative;
      z-index: 2;
      margin-bottom: -2px;
    }
    .nav-tabs {
      border-bottom: none;
    }
    .tab-content {
      border: 2px solid #0d6efd;
      border-top: 2px solid #0d6efd;
      border-radius: 0 0 0.375rem 0.375rem;
    }
  `;

  return (
    <Container className="mt-4">
      <style>{tabStyles}</style>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Collection Manager</h1>
        {fileName && (
          <div className="text-end">
            <div className="text-muted small">Current File</div>
            <Badge bg="info" className="fs-6">
              {fileName}
            </Badge>
            {jsonData.length > 0 && <div className="text-muted small mt-1">{jsonData.length} comics loaded</div>}
          </div>
        )}
      </div>

      {loading && <LoadingSpinner />}

      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card>
            <Card.Body className="p-0">
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || "load-file")} className="mb-0" fill>
                <Tab eventKey="load-file" title="Load from File">
                  <div className="p-4">
                    <div className="border rounded p-4">
                      <h4 className="mb-3">Load from File</h4>
                      <JsonFileUploader />
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="import-clipboard" title="Import from Clipboard">
                  <div className="p-4">
                    <div className="border rounded p-4">
                      <h4 className="mb-3">Import from Clipboard</h4>
                      <JsonClipboardImporter />
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="export" title="Export Collection" disabled={!fileName}>
                  <div className="p-4">
                    <div className="border rounded p-4">
                      <h4 className="mb-3">Export Collection</h4>
                      <JsonFileDownloader />
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="preview" title="Preview Data" disabled={!fileName}>
                  <div className="p-4">
                    <div className="border rounded p-4">
                      <JsonDataViewer />
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
