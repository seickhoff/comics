import { Container, Row, Col, Card, ListGroup, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";
import { ComicBook } from "../interfaces/ComicBook";
import { SUMMARY_CONFIG } from "../config/constants";

export function Summary() {
  const { jsonData, setFilters, settings } = useAppContext();
  const navigate = useNavigate();

  // Calculate statistics
  const stats = calculateStatistics(jsonData);

  // Handle clicks on comic items (title, publisher, volume, issue)
  const handleComicClick = (comic: ComicBook) => {
    const escapedTitle = comic.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedPublisher = comic.publisher?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") || "";
    const escapedVolume = comic.volume?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") || "";
    const escapedIssue = comic.issue?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") || "";

    // Reset filters and set only the comic-specific filters
    setFilters({
      title: `^${escapedTitle}$`,
      publisher: escapedPublisher ? `^${escapedPublisher}$` : "",
      volume: escapedVolume ? `^${escapedVolume}$` : "",
      issue: escapedIssue ? `^${escapedIssue}$` : "",
    } as Record<string, string>);

    navigate("/maintenance");
  };

  // Handle clicks on title items (title, publisher, volume - no specific issue)
  const handleTitleClick = (title: string, publisher: string, volume: string) => {
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedPublisher = publisher?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") || "";
    const escapedVolume = volume?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") || "";

    // Reset filters and set only title, publisher, and volume
    setFilters({
      title: `^${escapedTitle}$`,
      publisher: escapedPublisher ? `^${escapedPublisher}$` : "",
      volume: escapedVolume ? `^${escapedVolume}$` : "",
    } as Record<string, string>);

    navigate("/maintenance");
  };

  // Handle clicks on duplicate items (title, publisher, volume, issue - show all duplicates)
  const handleDuplicateClick = (title: string, publisher: string, volume: string, issue: string) => {
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedPublisher = publisher?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") || "";
    const escapedVolume = volume?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") || "";
    const escapedIssue = issue?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") || "";

    // Reset filters and set all fields to show the duplicate comics
    setFilters({
      title: `^${escapedTitle}$`,
      publisher: escapedPublisher ? `^${escapedPublisher}$` : "",
      volume: escapedVolume ? `^${escapedVolume}$` : "",
      issue: escapedIssue ? `^${escapedIssue}$` : "",
    } as Record<string, string>);

    navigate("/maintenance");
  };

  // Handle clicks on summary items to filter and navigate to maintenance
  const handleItemClick = (filterType: string, filterValue: string | number, exactMatch = true) => {
    let regexPattern: string;

    if (filterType === "decade") {
      // For decades like "1990s", match years 1990-1999
      const decade = String(filterValue).replace("s", "");
      regexPattern = `^${decade.slice(0, 3)}\\d$`; // Matches years in the decade (e.g., ^197\d$ for 1970s)
    } else if (exactMatch) {
      // Exact match with proper escaping for special regex characters
      const escapedValue = String(filterValue).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      regexPattern = `^${escapedValue}$`;
    } else {
      // Partial match (for cases where we want to match part of a field)
      const escapedValue = String(filterValue).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      regexPattern = escapedValue;
    }

    // Map filter types to column keys
    const filterMap: Record<string, string> = {
      title: "title",
      publisher: "publisher",
      volume: "volume",
      writer: "writer",
      artist: "artist",
      condition: "condition",
      decade: "year",
    };

    const columnKey = filterMap[filterType];
    if (!columnKey) return;

    // Reset filters and set only the selected filter
    setFilters({
      [columnKey]: regexPattern,
    } as Record<string, string>);

    navigate("/maintenance");
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Collection Summary</h1>

      {jsonData.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <p className="lead">No comics in collection</p>
          <p>Load or add comics to see summary statistics</p>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <Row className="g-4 mb-4">
            <Col xs={6} md={3}>
              <Card className="text-center h-100">
                <Card.Body className="py-2 py-md-3">
                  <h2 className="d-none d-md-block" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.DESKTOP_STAT_VALUE }}>
                    {jsonData.length}
                  </h2>
                  <h2 className="d-md-none" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.MOBILE_STAT_VALUE }}>
                    {jsonData.length}
                  </h2>
                  <p className="text-muted mb-0" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.STAT_LABEL }}>
                    Total Comics
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="text-center h-100">
                <Card.Body className="py-2 py-md-3">
                  <h2 className="d-none d-md-block" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.DESKTOP_STAT_VALUE }}>
                    {stats.totalTitles}
                  </h2>
                  <h2 className="d-md-none" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.MOBILE_STAT_VALUE }}>
                    {stats.totalTitles}
                  </h2>
                  <p className="text-muted mb-0" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.STAT_LABEL }}>
                    Unique Titles
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="text-center h-100">
                <Card.Body className="py-2 py-md-3">
                  <h2 className="d-none d-md-block" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.DESKTOP_STAT_VALUE }}>
                    ${stats.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                  <h2 className="d-md-none" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.MOBILE_STAT_VALUE }}>
                    ${stats.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                  <p className="text-muted mb-0" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.STAT_LABEL }}>
                    Total Value
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="text-center h-100">
                <Card.Body className="py-2 py-md-3">
                  <h2 className="d-none d-md-block" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.DESKTOP_STAT_VALUE }}>
                    $
                    {stats.averageValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                  <h2 className="d-md-none" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.MOBILE_STAT_VALUE }}>
                    $
                    {stats.averageValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                  <p className="text-muted mb-0" style={{ fontSize: SUMMARY_CONFIG.FONT_SIZE.STAT_LABEL }}>
                    Average Value
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Most Valuable Comics */}
          <Row className="g-4 mb-4">
            <Col xs={12} lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Most Valuable Comics</h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: settings.summaryMaxListHeight, overflowY: "auto" }}>
                  <ListGroup variant="flush">
                    {stats.allValuableComics.map((comic, index) => (
                      <ListGroup.Item
                        key={index}
                        className="px-md-3"
                        style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem", cursor: "pointer" }}
                        onClick={() => handleComicClick(comic)}
                      >
                        {/* Mobile: Number badge + title on row 1, publisher/vol + value on row 2 */}
                        <div className="d-md-none">
                          <div className="d-flex align-items-center mb-1">
                            <Badge bg="secondary" className="me-2">
                              {index + 1}
                            </Badge>
                            <span className="fw-bold">
                              {comic.title} #{comic.issue}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {comic.publisher} {comic.volume ? `v${comic.volume}` : ""}
                            </small>
                            <Badge bg="light" text="dark" className="border">
                              $
                              {Number(comic.value).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </Badge>
                          </div>
                        </div>

                        {/* Desktop: Original layout */}
                        <div className="d-none d-md-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div>
                              <Badge bg="secondary" className="me-2">
                                {index + 1}
                              </Badge>
                              <span className="fw-bold">
                                {comic.title} #{comic.issue}
                              </span>
                            </div>
                            <small className="text-muted ms-4 ps-2">
                              {comic.publisher} {comic.volume ? `v${comic.volume}` : ""}
                            </small>
                          </div>
                          <Badge bg="light" text="dark" className="border ms-2">
                            $
                            {Number(comic.value).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* Titles by Issue Count */}
            <Col xs={12} lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Titles by Issue Count</h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: settings.summaryMaxListHeight, overflowY: "auto" }}>
                  <ListGroup variant="flush">
                    {stats.allTitlesByCount.map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="px-md-3"
                        style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem", cursor: "pointer" }}
                        onClick={() => handleTitleClick(item.title, item.publisher, item.volume)}
                      >
                        {/* Mobile: Number badge + title on row 1, publisher/vol + count on row 2 */}
                        <div className="d-md-none">
                          <div className="d-flex align-items-center mb-1">
                            <Badge bg="secondary" className="me-2">
                              {index + 1}
                            </Badge>
                            <span className="fw-bold">{item.title}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {item.publisher} {item.volume ? `v${item.volume}` : ""}
                            </small>
                            <Badge bg="light" text="dark" className="border">
                              {item.count} issues
                            </Badge>
                          </div>
                        </div>

                        {/* Desktop: Original layout */}
                        <div className="d-none d-md-block">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div>
                                <Badge bg="secondary" className="me-2">
                                  {index + 1}
                                </Badge>
                                <span className="fw-bold">{item.title}</span>
                              </div>
                              <small className="text-muted ms-4 ps-2">
                                {item.publisher} {item.volume ? `v${item.volume}` : ""}
                              </small>
                            </div>
                            <Badge bg="light" text="dark" className="border">
                              {item.count} issues
                            </Badge>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Writers and Artists */}
          <Row className="g-4 mb-4">
            <Col xs={12} lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Writers</h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: settings.summaryMaxListHeight, overflowY: "auto" }}>
                  <ListGroup variant="flush">
                    {stats.allWriters.map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleItemClick("writer", item.name)}
                      >
                        <span>
                          <Badge bg="secondary" className="me-2">
                            {index + 1}
                          </Badge>
                          {item.name}
                        </span>
                        <Badge bg="light" text="dark" className="border">
                          {item.count} comics
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Artists</h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: settings.summaryMaxListHeight, overflowY: "auto" }}>
                  <ListGroup variant="flush">
                    {stats.allArtists.map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleItemClick("artist", item.name)}
                      >
                        <span>
                          <Badge bg="secondary" className="me-2">
                            {index + 1}
                          </Badge>
                          {item.name}
                        </span>
                        <Badge bg="light" text="dark" className="border">
                          {item.count} comics
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Publishers and Conditions */}
          <Row className="g-4 mb-4">
            <Col xs={12} lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Publishers</h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: settings.summaryMaxListHeight, overflowY: "auto" }}>
                  <ListGroup variant="flush">
                    {stats.allPublishers.map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleItemClick("publisher", item.name)}
                      >
                        <span>
                          <Badge bg="secondary" className="me-2">
                            {index + 1}
                          </Badge>
                          {item.name}
                        </span>
                        <Badge bg="light" text="dark" className="border">
                          {item.count} comics
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Comics by Condition</h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: settings.summaryMaxListHeight, overflowY: "auto" }}>
                  <ListGroup variant="flush">
                    {stats.conditionBreakdown.map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleItemClick("condition", item.condition || "Unknown")}
                      >
                        <span>
                          <Badge bg="secondary" className="me-2">
                            {index + 1}
                          </Badge>
                          {item.condition || "Unknown"}
                        </span>
                        <Badge bg="light" text="dark" className="border">
                          {item.count} comics
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Duplicates and Comics by Decade */}
          <Row className="g-4 mb-4">
            {/* Duplicates */}
            {stats.allDuplicates.length > 0 && (
              <Col xs={12} lg={6}>
                <Card className="h-100">
                  <Card.Header>
                    <h5 className="mb-0">Duplicate Comics</h5>
                  </Card.Header>
                  <Card.Body style={{ maxHeight: settings.summaryMaxListHeight, overflowY: "auto" }}>
                    <ListGroup variant="flush">
                      {stats.allDuplicates.map((item, index) => (
                        <ListGroup.Item
                          key={index}
                          className="px-md-3"
                          style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem", cursor: "pointer" }}
                          onClick={() => handleDuplicateClick(item.title, item.publisher, item.volume, item.issue)}
                        >
                          {/* Mobile: Number badge + title/issue on row 1, publisher/vol + count on row 2 */}
                          <div className="d-md-none">
                            <div className="d-flex align-items-center mb-1">
                              <Badge bg="secondary" className="me-2">
                                {index + 1}
                              </Badge>
                              <span className="fw-bold">
                                {item.title} #{item.issue}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                {item.publisher} {item.volume ? `v${item.volume}` : ""}
                              </small>
                              <Badge bg="light" text="dark" className="border">
                                {item.count} copies
                              </Badge>
                            </div>
                          </div>

                          {/* Desktop: Original layout */}
                          <div className="d-none d-md-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div>
                                <Badge bg="secondary" className="me-2">
                                  {index + 1}
                                </Badge>
                                <span className="fw-bold">
                                  {item.title} #{item.issue}
                                </span>
                              </div>
                              <small className="text-muted ms-4 ps-2">
                                {item.publisher} {item.volume ? `v${item.volume}` : ""}
                              </small>
                            </div>
                            <Badge bg="light" text="dark" className="border ms-2">
                              {item.count} copies
                            </Badge>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {/* Comics by Decade */}
            <Col xs={12} lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Comics by Decade</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <Row>
                      {stats.comicsByDecade.map((item, index) => (
                        <Col xs={6} md={6} key={index} className="mb-2">
                          <div
                            className="d-flex justify-content-between align-items-center p-2 border rounded"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleItemClick("decade", item.decade)}
                          >
                            <span className="fw-bold">{item.decade}</span>
                            <Badge bg="secondary">{item.count}</Badge>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

function calculateStatistics(comics: ComicBook[]) {
  // Total value
  const totalValue = comics.reduce((sum, comic) => {
    const value = Number(comic.value) || 0;
    return sum + value;
  }, 0);

  const averageValue = comics.length > 0 ? totalValue / comics.length : 0;

  // All valuable comics sorted by value
  const allValuableComics = [...comics].sort((a, b) => Number(b.value || 0) - Number(a.value || 0));

  // Count unique titles
  const titleMap = new Map<string, { count: number; publisher: string; volume: string }>();
  comics.forEach((comic) => {
    const key = `${comic.title}|${comic.publisher}|${comic.volume || ""}`;
    const existing = titleMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      titleMap.set(key, { count: 1, publisher: comic.publisher || "", volume: comic.volume || "" });
    }
  });

  const totalTitles = titleMap.size;

  // All titles by count
  const allTitlesByCount = Array.from(titleMap.entries())
    .map(([key, data]) => {
      const [title, publisher, volume] = key.split("|");
      return { title, publisher, volume, count: data.count };
    })
    .sort((a, b) => b.count - a.count);

  // Count writers
  const writerMap = new Map<string, number>();
  comics.forEach((comic) => {
    if (comic.writer && Array.isArray(comic.writer)) {
      comic.writer.forEach((writer) => {
        if (writer) {
          writerMap.set(writer, (writerMap.get(writer) || 0) + 1);
        }
      });
    }
  });

  const allWriters = Array.from(writerMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Count artists
  const artistMap = new Map<string, number>();
  comics.forEach((comic) => {
    if (comic.artist && Array.isArray(comic.artist)) {
      comic.artist.forEach((artist) => {
        if (artist) {
          artistMap.set(artist, (artistMap.get(artist) || 0) + 1);
        }
      });
    }
  });

  const allArtists = Array.from(artistMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Count publishers
  const publisherMap = new Map<string, number>();
  comics.forEach((comic) => {
    if (comic.publisher) {
      publisherMap.set(comic.publisher, (publisherMap.get(comic.publisher) || 0) + 1);
    }
  });

  const allPublishers = Array.from(publisherMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Condition breakdown
  const conditionMap = new Map<string, number>();
  comics.forEach((comic) => {
    const condition = comic.condition || "Unknown";
    conditionMap.set(condition, (conditionMap.get(condition) || 0) + 1);
  });

  const conditionBreakdown = Array.from(conditionMap.entries())
    .map(([condition, count]) => ({ condition, count }))
    .sort((a, b) => b.count - a.count);

  // Comics by decade
  const decadeMap = new Map<string, number>();
  comics.forEach((comic) => {
    if (comic.year) {
      const year = Number(comic.year);
      if (!isNaN(year)) {
        const decade = Math.floor(year / 10) * 10;
        const decadeLabel = `${decade}s`;
        decadeMap.set(decadeLabel, (decadeMap.get(decadeLabel) || 0) + 1);
      }
    }
  });

  const comicsByDecade = Array.from(decadeMap.entries())
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => a.decade.localeCompare(b.decade));

  // Find duplicates - comics where quantity > 1
  const allDuplicates = comics
    .filter((comic) => Number(comic.quantity) > 1)
    .map((comic) => ({
      title: comic.title,
      publisher: comic.publisher || "",
      volume: comic.volume || "",
      issue: comic.issue || "",
      count: Number(comic.quantity),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalValue,
    averageValue,
    totalTitles,
    allValuableComics,
    allTitlesByCount,
    allWriters,
    allArtists,
    allPublishers,
    conditionBreakdown,
    comicsByDecade,
    allDuplicates,
  };
}
