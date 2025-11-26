import { useState } from "react";
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
  BarChart,
  Grid3x3Gap,
} from "react-bootstrap-icons";

export function Home() {
  const { jsonData } = useAppContext();
  const [carouselIndex, setCarouselIndex] = useState(0);

  // All cards data
  const allCards: Array<{
    title: string;
    items?: Array<{ icon?: React.ReactElement; text: React.ReactElement }>;
    content?: React.ReactElement;
  }> = [
    {
      title: "Getting Started",
      items: [
        {
          icon: <FileEarmarkArrowUp className="me-2" size={16} />,
          text: (
            <>
              <strong>Load Your Collection:</strong> Navigate to the <Badge bg="secondary">File</Badge> page to upload
              an existing JSON file or start fresh
            </>
          ),
        },
        {
          icon: <PlusCircle className="me-2" size={16} />,
          text: (
            <>
              <strong>Add Comics:</strong> Use the <Badge bg="secondary">+ Add</Badge> button to add comics individually
              or in bulk
            </>
          ),
        },
        {
          icon: <Filter className="me-2" size={16} />,
          text: (
            <>
              <strong>Filter & Search:</strong> Use the Report Configuration panel to filter by any field
            </>
          ),
        },
        {
          icon: <FileEarmarkArrowDown className="me-2" size={16} />,
          text: (
            <>
              <strong>Save Your Work:</strong> Download your collection as JSON from the{" "}
              <Badge bg="secondary">File</Badge> page (includes sort and filter preferences)
            </>
          ),
        },
      ],
    },
    {
      title: "Key Features",
      items: [
        {
          text: (
            <>
              <strong>Bulk Add:</strong> Add multiple consecutive issues at once by filling in the "End Issue" field
            </>
          ),
        },
        {
          text: (
            <>
              <strong>Batch Edit:</strong> Select multiple comics and edit common fields simultaneously
            </>
          ),
        },
        {
          text: (
            <>
              <strong>Smart Sorting:</strong> Multi-level sorting by clicking column headers (handles "The" prefix
              automatically)
            </>
          ),
        },
        {
          text: (
            <>
              <strong>Flexible Filtering:</strong> Use regex patterns for advanced searches with AND/OR logic
            </>
          ),
        },
      ],
    },
    {
      title: "Key Features (cont.)",
      items: [
        {
          icon: <BarChart className="me-2" size={16} />,
          text: (
            <>
              <strong>Summary View:</strong> Click any statistic (writers, publishers, titles, etc.) to filter your
              collection instantly
            </>
          ),
        },
        {
          icon: <Grid3x3Gap className="me-2" size={16} />,
          text: (
            <>
              <strong>Heatmap View:</strong> Visualize your collection by publication date and click any month to see
              those comics
            </>
          ),
        },
        {
          text: (
            <>
              <strong>Auto-complete:</strong> All fields offer suggestions based on your existing collection
            </>
          ),
        },
        {
          text: (
            <>
              <strong>Multi-select Fields:</strong> Writers and artists support multiple values with auto-suggestions
            </>
          ),
        },
      ],
    },
    {
      title: "Tips & Tricks",
      items: [
        {
          icon: <SortDown className="me-2" size={16} />,
          text: (
            <>
              <strong>Multi-Sort:</strong> Click multiple columns to sort by priority (1, 2, 3...)
            </>
          ),
        },
        {
          icon: <PencilSquare className="me-2" size={16} />,
          text: (
            <>
              <strong>Quick Edit:</strong> Click any row to edit that comic's details
            </>
          ),
        },
        {
          icon: <Trash className="me-2" size={16} />,
          text: (
            <>
              <strong>Batch Delete:</strong> Select multiple comics and use "Delete" to remove them
            </>
          ),
        },
        {
          text: (
            <>
              <strong>Bulk Add:</strong> Enter Issue: 1, End Issue: 12, Month: 01, Year: 2024 to create 12 comics
              automatically
            </>
          ),
        },
        {
          text: (
            <>
              <strong>Timestamps:</strong> Add timestamp to filenames when downloading to track versions
            </>
          ),
        },
      ],
    },
    {
      title: "Bulk Add Instructions",
      content: (
        <>
          <p className="mb-2">
            The bulk add feature allows you to quickly add multiple consecutive issues of the same title:
          </p>
          <ol>
            <li>
              Click the <Badge bg="secondary">+ Add</Badge> button
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
            <li>Click "Add to Collection" to create all issues at once</li>
          </ol>
          <div className="alert alert-secondary mb-0">
            <strong>Note:</strong> The month and year will automatically increment for each issue. When the month
            exceeds 12, it rolls over to January of the next year.
          </div>
        </>
      ),
    },
    {
      title: "Batch Edit Instructions",
      content: (
        <>
          <p className="mb-2">Edit multiple comics at once to save time:</p>
          <ol>
            <li>Click the checkboxes next to the comics you want to edit</li>
            <li>
              Click <Badge bg="secondary">Edit</Badge>
            </li>
            <li>Fields showing the same value across all selected comics will be pre-filled</li>
            <li>Fields with different values will be empty</li>
            <li>Only modify the fields you want to change - empty fields won't be updated</li>
            <li>
              To clear a field: Type a single space <code>" "</code> for text fields, or select "Clear All" for
              multi-select fields
            </li>
          </ol>
          <div className="alert alert-secondary mb-0">
            <strong>Tip:</strong> This is perfect for updating condition, value, or adding writers/artists to multiple
            issues at once.
          </div>
        </>
      ),
    },
    {
      title: "Summary Page",
      content: (
        <>
          <p className="mb-2">
            Navigate to <Badge bg="secondary">Summary</Badge> to explore your collection statistics:
          </p>
          <ul>
            <li>View your most valuable comics ranked by price</li>
            <li>See which titles you have the most issues of</li>
            <li>Browse top writers, artists, and publishers in your collection</li>
            <li>View comics grouped by condition and decade</li>
          </ul>
          <div className="alert alert-secondary mb-0">
            <strong>
              <BarChart className="me-1" size={16} />
              Interactive Filtering:
            </strong>{" "}
            Click any item (writer, publisher, title, decade, etc.) to instantly filter the Maintenance page to show
            only those comics. Perfect for quick exploration!
          </div>
        </>
      ),
    },
    {
      title: "Heatmap Page",
      content: (
        <>
          <p className="mb-2">
            Navigate to <Badge bg="secondary">Heatmap</Badge> to visualize your collection by publication date:
          </p>
          <ul>
            <li>Interactive grid showing comics by month and year</li>
            <li>Color intensity indicates volume (darker = more comics)</li>
            <li>See your busiest collection months at a glance</li>
            <li>Identify gaps or missing periods in your collection</li>
          </ul>
          <div className="alert alert-secondary mb-0">
            <strong>
              <Grid3x3Gap className="me-1" size={16} />
              Interactive Filtering:
            </strong>{" "}
            Click any cell to view all comics from that specific month and year. Great for tracking publication runs!
          </div>
        </>
      ),
    },
  ];

  // Get the two cards to display based on carousel index
  const getDisplayCards = () => {
    const leftIndex = carouselIndex;
    const rightIndex = (carouselIndex + 1) % allCards.length;
    return [allCards[leftIndex], allCards[rightIndex]];
  };

  return (
    <Container className="mt-4">
      <div className="text-center mb-5">
        <h1 className="display-4">Comic Book Collection Manager</h1>
        <p className="lead text-muted">Organize, track, and manage your comic book collection with ease</p>
        {jsonData.length > 0 && (
          <Badge bg="secondary" className="fs-6">
            {jsonData.length} comic{jsonData.length !== 1 ? "s" : ""} in collection
          </Badge>
        )}
      </div>

      {/* Desktop: Carousel with two cards side-by-side */}
      <Row className="g-4 d-none d-md-block">
        <Col md={12}>
          <Row className="align-items-stretch">
            {/* Left arrow in column 1 - entire column is clickable */}
            <Col
              xs={1}
              className="d-flex align-items-center justify-content-center"
              onClick={() => setCarouselIndex((carouselIndex - 1 + allCards.length) % allCards.length)}
              style={{
                cursor: "pointer",
                userSelect: "none",
                minHeight: "450px",
                fontSize: "2rem",
                color: "#333",
              }}
            >
              &#8249;
            </Col>

            {/* Two cards side-by-side in columns 2-11 */}
            <Col xs={10}>
              <Row>
                {getDisplayCards().map((card, cardIndex) => (
                  <Col xs={6} key={cardIndex}>
                    <Card
                      className="shadow-sm"
                      style={{ minHeight: "450px", display: "flex", flexDirection: "column" }}
                    >
                      <Card.Header>
                        <h5 className="mb-0">{card.title}</h5>
                      </Card.Header>
                      <Card.Body style={{ flex: 1, overflow: "auto" }}>
                        {card.content ? (
                          card.content
                        ) : (
                          <ListGroup variant="flush">
                            {card.items?.map((item, itemIndex) => (
                              <ListGroup.Item key={itemIndex}>
                                {item.icon}
                                {item.text}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Indicators below the cards */}
              <div className="text-center mt-3">
                {allCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: index === carouselIndex ? "#333" : "#ccc",
                      margin: "0 5px",
                      cursor: "pointer",
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </Col>

            {/* Right arrow in column 12 - entire column is clickable */}
            <Col
              xs={1}
              className="d-flex align-items-center justify-content-center"
              onClick={() => setCarouselIndex((carouselIndex + 1) % allCards.length)}
              style={{
                cursor: "pointer",
                userSelect: "none",
                minHeight: "450px",
                fontSize: "2rem",
                color: "#333",
              }}
            >
              &#8250;
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Mobile: Stacked cards */}
      <Row className="g-4 d-md-none">
        {allCards.map((card, index) => (
          <Col xs={12} key={index}>
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">{card.title}</h5>
              </Card.Header>
              <Card.Body>
                {card.content ? (
                  card.content
                ) : (
                  <ListGroup variant="flush">
                    {card.items?.map((item, itemIndex) => (
                      <ListGroup.Item key={itemIndex}>
                        {item.icon}
                        {item.text}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
