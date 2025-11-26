import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { GradeCode } from "../interfaces/ComicBook";

export function Settings() {
  const { settings, setSettings, fileName } = useAppContext();
  const [formData, setFormData] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    // Validate heatmapCellSize range (30-100)
    if (field === "heatmapCellSize" && typeof value === "number") {
      if (value < 30 || value > 100) {
        return; // Reject values outside range
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setSettings(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    setFormData(settings);
    setHasChanges(false);
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Settings</h1>
        {hasChanges && (
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm" onClick={handleReset}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {!fileName && (
        <div className="alert alert-info mb-3" style={{ fontSize: "0.875rem" }}>
          Settings are saved with your collection file. Load or create a collection to persist changes.
        </div>
      )}

      <Row className="g-3 mb-3">
        {/* Default Values */}
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header>
              <strong>Default Values</strong>
              <div className="d-none d-md-block text-muted" style={{ fontSize: "0.75rem" }}>
                Applied when adding new comics
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Default Filename</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      value={formData.defaultFilename}
                      onChange={(e) => handleChange("defaultFilename", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Default Volume</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      value={formData.defaultVolume}
                      onChange={(e) => handleChange("defaultVolume", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Default Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="1"
                      value={formData.defaultQuantity}
                      onChange={(e) => handleChange("defaultQuantity", parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Default Condition</Form.Label>
                    <Form.Select
                      size="sm"
                      value={formData.defaultCondition}
                      onChange={(e) => handleChange("defaultCondition", e.target.value as GradeCode)}
                    >
                      {Object.values(GradeCode).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* UI Configuration */}
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header>
              <strong>UI Configuration</strong>
              <div className="d-none d-md-block text-muted" style={{ fontSize: "0.75rem" }}>
                User interface settings and limits
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Toast Duration (ms)</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="1000"
                      step="500"
                      value={formData.toastDuration}
                      onChange={(e) => handleChange("toastDuration", parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Max Title Length</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="10"
                      value={formData.maxTitleLength}
                      onChange={(e) => handleChange("maxTitleLength", parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Max Comment Length</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="10"
                      value={formData.maxCommentLength}
                      onChange={(e) => handleChange("maxCommentLength", parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        {/* Validation Rules */}
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header>
              <strong>Validation Rules</strong>
              <div className="d-none d-md-block text-muted" style={{ fontSize: "0.75rem" }}>
                Data validation constraints
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Min Year</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      value={formData.minYear}
                      onChange={(e) => handleChange("minYear", parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Max Year</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      value={formData.maxYear}
                      onChange={(e) => handleChange("maxYear", parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Min Issue</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      value={formData.minIssue}
                      onChange={(e) => handleChange("minIssue", parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Overstreet Report */}
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header>
              <strong>Overstreet Report</strong>
              <div className="d-none d-md-block text-muted" style={{ fontSize: "0.75rem" }}>
                Overstreet format configuration
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Max Chars Desktop</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="10"
                      value={formData.overstreetMaxCharsDesktop}
                      onChange={(e) => handleChange("overstreetMaxCharsDesktop", parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Max Chars Mobile</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="10"
                      value={formData.overstreetMaxCharsMobile}
                      onChange={(e) => handleChange("overstreetMaxCharsMobile", parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Lines Per Page</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="10"
                      value={formData.overstreetLinesPerPage}
                      onChange={(e) => handleChange("overstreetLinesPerPage", parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        {/* Summary Page */}
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header>
              <strong>Summary Page</strong>
              <div className="d-none d-md-block text-muted" style={{ fontSize: "0.75rem" }}>
                Summary page display settings
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Max List Height</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      value={formData.summaryMaxListHeight}
                      onChange={(e) => handleChange("summaryMaxListHeight", e.target.value)}
                      placeholder="e.g., 500px"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Heatmap Settings */}
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header>
              <strong>Heatmap Settings</strong>
              <div className="d-none d-md-block text-muted" style={{ fontSize: "0.75rem" }}>
                Customize heatmap appearance
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Cell Width (Desktop)</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="30"
                      max="100"
                      value={formData.heatmapCellSize}
                      onChange={(e) => handleChange("heatmapCellSize", parseInt(e.target.value))}
                    />
                    <Form.Text className="text-muted" style={{ fontSize: "0.7rem" }}>
                      Cell width in pixels (30-100)
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Color Hue (0-360)</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="0"
                      max="360"
                      value={formData.heatmapColorHue}
                      onChange={(e) => handleChange("heatmapColorHue", parseInt(e.target.value))}
                    />
                    <Form.Text className="text-muted" style={{ fontSize: "0.7rem" }}>
                      0=Red, 120=Green, 210=Blue
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Color Saturation</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      value={formData.heatmapColorSaturation}
                      onChange={(e) => handleChange("heatmapColorSaturation", e.target.value)}
                      placeholder="e.g., 70%"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Lightness Min (0-100)</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="0"
                      max="100"
                      value={formData.heatmapColorLightnessMin}
                      onChange={(e) => handleChange("heatmapColorLightnessMin", parseInt(e.target.value))}
                    />
                    <Form.Text className="text-muted" style={{ fontSize: "0.7rem" }}>
                      Darkest color (most comics)
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>Lightness Max (0-100)</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="0"
                      max="100"
                      value={formData.heatmapColorLightnessMax}
                      onChange={(e) => handleChange("heatmapColorLightnessMax", parseInt(e.target.value))}
                    />
                    <Form.Text className="text-muted" style={{ fontSize: "0.7rem" }}>
                      Lightest color (fewest comics)
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              {/* Color preview */}
              <div className="mt-2">
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: "0.75rem" }}>Preview:</span>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: `hsl(${formData.heatmapColorHue}, ${formData.heatmapColorSaturation}, ${formData.heatmapColorLightnessMin}%)`,
                      border: "1px solid #ccc",
                    }}
                  />
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: `hsl(${formData.heatmapColorHue}, ${formData.heatmapColorSaturation}, ${
                        (formData.heatmapColorLightnessMin + formData.heatmapColorLightnessMax) / 2
                      }%)`,
                      border: "1px solid #ccc",
                    }}
                  />
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: `hsl(${formData.heatmapColorHue}, ${formData.heatmapColorSaturation}, ${formData.heatmapColorLightnessMax}%)`,
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Save button at bottom for mobile */}
      {hasChanges && (
        <div className="d-md-none mb-3 d-flex gap-2">
          <Button variant="outline-secondary" onClick={handleReset} className="flex-fill">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-fill">
            Save Changes
          </Button>
        </div>
      )}
    </Container>
  );
}
