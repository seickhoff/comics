import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { useAppContext } from "../hooks/useAppContext";
import { ComicBook } from "../interfaces/ComicBook";

export function Heatmap() {
  const { jsonData } = useAppContext();

  const heatmapData = calculateHeatmapData(jsonData);

  // Get unique years sorted
  const years = Array.from(heatmapData.keys()).sort((a, b) => a - b);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Calculate max count for color intensity
  const maxCount = Math.max(...Array.from(heatmapData.values()).flatMap((monthData) => Array.from(monthData.values())));

  // Get color based on count (0 = light, maxCount = dark)
  const getColor = (count: number) => {
    if (count === 0) return "#f0f0f0";
    const intensity = Math.min(count / maxCount, 1);
    // Blue gradient from light to dark
    const lightness = 85 - intensity * 55; // 85% to 30%
    return `hsl(210, 70%, ${lightness}%)`;
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Collection Heatmap</h1>

      {jsonData.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <p className="lead">No comics in collection</p>
          <p>Load or add comics to see the heatmap</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-muted">
              Visualize your collection by publication date. Darker colors indicate more comics published in that
              month/year.
            </p>
          </div>

          {/* Legend */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Body className="d-flex align-items-center justify-content-center gap-3">
                  <span className="text-muted">Less</span>
                  <div className="d-flex gap-1">
                    {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((intensity, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: "30px",
                          height: "20px",
                          backgroundColor: intensity === 0 ? "#f0f0f0" : `hsl(210, 70%, ${85 - intensity * 55}%)`,
                          border: "1px solid #ddd",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-muted">More</span>
                  <Badge bg="secondary" className="ms-3">
                    Max: {maxCount} comics/month
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Heatmap */}
          <Row>
            <Col>
              <Card>
                <Card.Body style={{ overflowX: "auto" }}>
                  <div style={{ minWidth: "800px" }}>
                    {/* Month labels header */}
                    <div className="d-flex mb-2">
                      <div style={{ width: "60px", flexShrink: 0 }} />
                      {months.map((month, idx) => (
                        <div
                          key={idx}
                          className="text-center fw-bold"
                          style={{ flex: 1, fontSize: "0.875rem", minWidth: "40px" }}
                        >
                          {month}
                        </div>
                      ))}
                    </div>

                    {/* Year rows */}
                    {years.map((year) => {
                      const monthData = heatmapData.get(year) || new Map();
                      return (
                        <div key={year} className="d-flex mb-1">
                          {/* Year label */}
                          <div
                            className="text-end pe-2 fw-bold"
                            style={{ width: "60px", flexShrink: 0, fontSize: "0.875rem", lineHeight: "40px" }}
                          >
                            {year}
                          </div>

                          {/* Month cells */}
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
                            const count = monthData.get(month) || 0;
                            return (
                              <div
                                key={month}
                                className="d-flex align-items-center justify-content-center position-relative"
                                style={{
                                  flex: 1,
                                  minWidth: "40px",
                                  height: "40px",
                                  backgroundColor: getColor(count),
                                  border: "1px solid #ddd",
                                  cursor: count > 0 ? "pointer" : "default",
                                  fontSize: "0.75rem",
                                }}
                                title={
                                  count > 0
                                    ? `${months[month - 1]} ${year}: ${count} comic${count !== 1 ? "s" : ""}`
                                    : ""
                                }
                              >
                                {count > 0 && (
                                  <span style={{ color: count / maxCount > 0.5 ? "white" : "#333" }}>{count}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Summary Statistics */}
          <Row className="g-4 mt-4 mb-4">
            <Col xs={12} md={4}>
              <Card className="text-center h-100">
                <Card.Body>
                  <h3>{years.length}</h3>
                  <p className="text-muted mb-0">Years Covered</p>
                  {years.length > 0 && (
                    <small className="text-muted">
                      {years[0]} - {years[years.length - 1]}
                    </small>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={4}>
              <Card className="text-center h-100">
                <Card.Body>
                  <h3>{getBusiestMonth(heatmapData)?.month || "N/A"}</h3>
                  <p className="text-muted mb-0">Most Active Month</p>
                  {getBusiestMonth(heatmapData) && (
                    <small className="text-muted">{getBusiestMonth(heatmapData)?.count} comics</small>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={4}>
              <Card className="text-center h-100">
                <Card.Body>
                  <h3>{getBusiestYear(heatmapData)?.year || "N/A"}</h3>
                  <p className="text-muted mb-0">Most Active Year</p>
                  {getBusiestYear(heatmapData) && (
                    <small className="text-muted">{getBusiestYear(heatmapData)?.count} comics</small>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

function calculateHeatmapData(comics: ComicBook[]): Map<number, Map<number, number>> {
  const heatmap = new Map<number, Map<number, number>>();

  comics.forEach((comic) => {
    const year = Number(comic.year);
    const month = Number(comic.month);

    if (!isNaN(year) && year > 0 && !isNaN(month) && month >= 1 && month <= 12) {
      if (!heatmap.has(year)) {
        heatmap.set(year, new Map());
      }
      const monthMap = heatmap.get(year)!;
      monthMap.set(month, (monthMap.get(month) || 0) + 1);
    }
  });

  return heatmap;
}

function getBusiestMonth(heatmapData: Map<number, Map<number, number>>): { month: string; count: number } | null {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let maxCount = 0;
  let busiestYear = 0;
  let busiestMonth = 0;

  heatmapData.forEach((monthData, year) => {
    monthData.forEach((count, month) => {
      if (count > maxCount) {
        maxCount = count;
        busiestYear = year;
        busiestMonth = month;
      }
    });
  });

  if (maxCount === 0) return null;
  return { month: `${months[busiestMonth - 1]} ${busiestYear}`, count: maxCount };
}

function getBusiestYear(heatmapData: Map<number, Map<number, number>>): { year: number; count: number } | null {
  let maxCount = 0;
  let busiestYear = 0;

  heatmapData.forEach((monthData, year) => {
    let yearTotal = 0;
    monthData.forEach((count) => {
      yearTotal += count;
    });
    if (yearTotal > maxCount) {
      maxCount = yearTotal;
      busiestYear = year;
    }
  });

  if (maxCount === 0) return null;
  return { year: busiestYear, count: maxCount };
}
