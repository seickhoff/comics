import { useAppContext } from "../hooks/useAppContext";
import { Card, Container, Row, Col, Badge, ListGroup } from "react-bootstrap";
import {
  FileEarmarkArrowUp,
  FileEarmarkArrowDown,
  PlusCircle,
  PencilSquare,
  Trash,
  Filter,
  SortDown,
} from "react-bootstrap-icons";

export function Home() {
  const { jsonData } = useAppContext();

  return (
    <Container className="mt-4">
      <div className="text-center mb-5">
        <h1 className="display-4">Comic Book Collection Manager</h1>
        <p className="lead text-muted">Organize, track, and manage your comic book collection with ease</p>
        {jsonData.length > 0 && (
          <Badge bg="success" className="fs-6">
            {jsonData.length} comic{jsonData.length !== 1 ? "s" : ""} in collection
          </Badge>
        )}
      </div>

      <Row className="g-4">
        {/* Getting Started */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Getting Started</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <FileEarmarkArrowUp className="me-2 text-primary" size={20} />
                  <strong>Load Your Collection:</strong> Navigate to the <Badge bg="secondary">File</Badge> page to
                  upload an existing JSON file or start fresh
                </ListGroup.Item>
                <ListGroup.Item>
                  <PlusCircle className="me-2 text-success" size={20} />
                  <strong>Add Comics:</strong> Use the <Badge bg="success">+ Add</Badge> button to add comics
                  individually or in bulk
                </ListGroup.Item>
                <ListGroup.Item>
                  <Filter className="me-2 text-info" size={20} />
                  <strong>Filter & Search:</strong> Use the Report Configuration panel to filter by any field
                </ListGroup.Item>
                <ListGroup.Item>
                  <FileEarmarkArrowDown className="me-2 text-warning" size={20} />
                  <strong>Save Your Work:</strong> Download your collection as JSON from the{" "}
                  <Badge bg="secondary">File</Badge> page
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Key Features */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Key Features</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Bulk Add:</strong> Add multiple consecutive issues at once by filling in the "End Issue" field
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Batch Edit:</strong> Select multiple comics and edit common fields simultaneously
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Smart Sorting:</strong> Multi-level sorting by clicking column headers (handles "The" prefix
                  automatically)
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Flexible Filtering:</strong> Use regex patterns for advanced searches with AND/OR logic
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Auto-complete:</strong> All fields offer suggestions based on your existing collection
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Tips & Tricks */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Tips & Tricks</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <SortDown className="me-2" size={16} />
                  <strong>Multi-Sort:</strong> Click multiple columns to sort by priority (1, 2, 3...)
                </ListGroup.Item>
                <ListGroup.Item>
                  <PencilSquare className="me-2" size={16} />
                  <strong>Quick Edit:</strong> Click any row to edit that comic's details
                </ListGroup.Item>
                <ListGroup.Item>
                  <Trash className="me-2" size={16} />
                  <strong>Batch Delete:</strong> Select multiple comics and use "Delete Selected" to remove them
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Bulk Add:</strong> Enter Issue: 1, End Issue: 12, Month: 01, Year: 2024 to create 12 comics
                  automatically
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Timestamps:</strong> Add timestamp to filenames when downloading to track versions
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Bulk Add Instructions */}
        <Col md={12}>
          <Card className="shadow-sm border-primary">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-primary">Bulk Add Instructions</h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-2">
                The bulk add feature allows you to quickly add multiple consecutive issues of the same title:
              </p>
              <ol>
                <li>
                  Click the <Badge bg="success">+ Add</Badge> button
                </li>
                <li>Fill in the comic details (Title, Publisher, Volume, etc.)</li>
                <li>
                  Enter the starting <strong>Issue</strong> number (e.g., 1)
                </li>
                <li>
                  Fill in the <strong>End Issue</strong> field (e.g., 12)
                </li>
                <li>
                  Enter the <strong>Month</strong> and <strong>Year</strong> for the first issue
                </li>
                <li>A blue banner will show how many comics will be created</li>
                <li>Click "Add Comic" to create all issues at once</li>
              </ol>
              <div className="alert alert-info mb-0">
                <strong>Note:</strong> The month and year will automatically increment for each issue. When the month
                exceeds 12, it rolls over to January of the next year.
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Batch Edit Instructions */}
        <Col md={12}>
          <Card className="shadow-sm border-warning">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-warning">Batch Edit Instructions</h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-2">Edit multiple comics at once to save time:</p>
              <ol>
                <li>Click the checkboxes next to the comics you want to edit</li>
                <li>
                  Click <Badge bg="primary">Edit Selected</Badge>
                </li>
                <li>Fields showing the same value across all selected comics will be pre-filled</li>
                <li>Fields with different values will be empty</li>
                <li>Only modify the fields you want to change - empty fields won't be updated</li>
                <li>
                  To clear a field: Type a single space <code>" "</code> for text fields, or select "Clear All" for
                  multi-select fields
                </li>
              </ol>
              <div className="alert alert-warning mb-0">
                <strong>Tip:</strong> This is perfect for updating condition, value, or adding writers/artists to
                multiple issues at once.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
