import { useState, useMemo, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select/creatable";
import { ComicBook, GradeCode, GradeDescription } from "../interfaces/ComicBook";
import { useToast } from "../context/ToastContext";
import { generateBulkComics, calculateBulkAddCount } from "../utils/bulkComicGenerator";
import { useComicFormOptions } from "../hooks/useComicFormOptions";
import { getEmptyComic } from "../utils/comicDefaults";
import { BATCH_MARKERS } from "../config/constants";

type ComicFormProps = {
  mode: "add" | "edit";
  existingComics: ComicBook[];
  initialComic?: ComicBook;
  onSubmit: (comic: ComicBook, isLastInBulk?: boolean, appendComments?: boolean) => void;
  onCancel?: () => void;
  isBatchMode?: boolean;
};

export function ComicForm({ mode, existingComics, initialComic, onSubmit, onCancel, isBatchMode }: ComicFormProps) {
  const isEdit = mode === "edit";

  const [comic, setComic] = useState<Partial<ComicBook>>(initialComic || getEmptyComic());
  const [endingIssue, setEndingIssue] = useState<string>("");
  const [appendComments, setAppendComments] = useState(false);

  const { addToast } = useToast();

  // reset when editing a different comic
  useEffect(() => {
    if (isEdit && initialComic) setComic(initialComic);
  }, [initialComic, isEdit]);

  const {
    titleOptions,
    publisherOptions,
    volumeOptions,
    issueOptions,
    valueOptions,
    monthOptions,
    yearOptions,
    writerOptions,
    artistOptions,
  } = useComicFormOptions(existingComics);

  const handleChange = (key: keyof ComicBook, value: string | string[] | number) => {
    setComic((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if bulk add mode is active (add mode with ending issue filled)
    if (!isEdit && endingIssue && comic.issue) {
      const result = generateBulkComics(comic, comic.issue, endingIssue);

      if (!result.success) {
        addToast({
          title: result.error?.includes("number") ? "Invalid Input" : "Invalid Range",
          body: result.error || "Failed to generate bulk comics.",
          bg: "danger",
        });
        return;
      }

      // Submit each comic, marking the last one
      result.comics!.forEach((c, index) => {
        const isLast = index === result.comics!.length - 1;
        onSubmit(c, isLast, false);
      });

      // Reset form
      setComic(getEmptyComic());
      setEndingIssue("");

      addToast({
        title: "Comics Added",
        body: `Successfully added ${result.comics!.length} comics to your collection.`,
        bg: "success",
      });
    } else {
      // Single comic add or edit
      onSubmit(comic as ComicBook, false, appendComments);

      if (!isEdit) {
        setComic(getEmptyComic());
        setEndingIssue("");
        addToast({
          title: "Comic Added",
          body: "Successfully added to your collection.",
          bg: "success",
        });
      } else {
        addToast({
          title: "Comic Updated",
          body: "Changes saved successfully.",
          bg: "info",
        });
      }
    }
  };

  // Calculate how many comics will be added
  const bulkAddCount = useMemo(() => {
    if (!isEdit && endingIssue && comic.issue) {
      return calculateBulkAddCount(comic.issue, endingIssue);
    }
    return 0;
  }, [isEdit, endingIssue, comic.issue]);

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm mt-2">
      {bulkAddCount > 1 && (
        <div
          style={{
            marginBottom: 15,
            padding: 10,
            backgroundColor: "#d1ecf1",
            borderRadius: 5,
            border: "1px solid #bee5eb",
          }}
        >
          <strong>Bulk Add Mode:</strong> Will create {bulkAddCount} comics (Issues {comic.issue} - {endingIssue}),
          incrementing month/year automatically.
        </div>
      )}
      <Row className="g-3">
        {/* Title */}
        <Col lg={6}>
          <Form.Label>Title</Form.Label>
          <Form.Control
            list="title-options"
            value={comic.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter or select title"
          />
          <datalist id="title-options">
            {titleOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </Col>

        {/* Publisher */}
        <Col lg={5}>
          <Form.Label>Publisher</Form.Label>
          <Form.Control
            list="publisher-options"
            value={comic.publisher || ""}
            onChange={(e) => handleChange("publisher", e.target.value)}
            placeholder="Enter or select publisher"
          />
          <datalist id="publisher-options">
            {publisherOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </Col>

        {/* Volume */}
        <Col lg={1}>
          <Form.Label>Volume</Form.Label>
          <Form.Control
            list="volume-options"
            value={comic.volume || ""}
            onChange={(e) => handleChange("volume", e.target.value)}
            placeholder="#"
          />
          <datalist id="volume-options">
            {volumeOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </Col>

        {/* Issue */}
        <Col lg={1}>
          <Form.Label>Issue</Form.Label>
          <Form.Control
            list="issue-options"
            value={comic.issue || ""}
            onChange={(e) => handleChange("issue", e.target.value)}
            placeholder="#"
          />
          <datalist id="issue-options">
            {issueOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </Col>

        {/* Month */}
        <Col lg={1}>
          <Form.Label>Month</Form.Label>
          <Form.Control
            list="month-options"
            value={comic.month || ""}
            onChange={(e) => handleChange("month", e.target.value)}
            placeholder="MM"
          />
          <datalist id="month-options">
            {monthOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </Col>

        {/* Year */}
        <Col lg={1}>
          <Form.Label>Year</Form.Label>
          <Form.Control
            list="year-options"
            value={comic.year || ""}
            onChange={(e) => handleChange("year", e.target.value)}
            placeholder="YYYY"
          />
          <datalist id="year-options">
            {yearOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </Col>

        {/* Quantity */}
        <Col lg={1}>
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            min={isBatchMode ? undefined : 1}
            value={comic.quantity ?? ""}
            onChange={(e) => handleChange("quantity", e.target.value === "" ? "" : Number(e.target.value))}
            placeholder={isBatchMode ? "No change" : "1"}
          />
        </Col>

        {/* Value */}
        <Col lg={2}>
          <Form.Label>Value ($)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            list="value-options"
            value={comic.value || ""}
            onChange={(e) => handleChange("value", e.target.value)}
            placeholder={isBatchMode ? "No change" : "0.00"}
          />
          <datalist id="value-options">
            {valueOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </Col>

        {/* Condition */}
        <Col lg={6}>
          <Form.Label>Condition</Form.Label>
          <Form.Select
            value={comic.condition || (isBatchMode ? "" : GradeCode.NM)}
            onChange={(e) => handleChange("condition", e.target.value)}
          >
            {isBatchMode && <option value="">-- No Change --</option>}
            {Object.entries(GradeDescription).map(([code, desc]) => (
              <option key={code} value={code}>
                {code} - {desc}
              </option>
            ))}
          </Form.Select>
        </Col>

        {/* Ending Issue - only show in add mode */}
        {!isEdit && comic.issue && comic.month && comic.year && (
          <>
            <Col lg={1}>
              <Form.Label>End Issue</Form.Label>
              <Form.Control
                value={endingIssue}
                onChange={(e) => setEndingIssue(e.target.value)}
                placeholder="#"
                title="Fill this to add multiple issues in sequence"
              />
              <Form.Text className="text-muted" style={{ fontSize: "0.7rem" }}>
                Bulk add
              </Form.Text>
            </Col>

            <Col lg={11} />
          </>
        )}

        {/* Writers */}
        <Col lg={6}>
          <Form.Label>Writers</Form.Label>
          <Select
            isMulti
            isClearable
            options={[
              ...(isBatchMode ? [{ value: BATCH_MARKERS.CLEAR_FIELD, label: "⚠️ Clear All Writers" }] : []),
              ...writerOptions.map((w) => ({ value: w, label: w })),
            ]}
            value={(comic.writer || []).map((w) => ({ value: w, label: w }))}
            onChange={(selected) => handleChange("writer", selected ? selected.map((s) => s.value) : [])}
            placeholder={isBatchMode ? "No change (leave as is)" : "Select writers..."}
          />
          {isBatchMode && (
            <Form.Text className="text-muted">
              Empty = no change. Select "Clear All Writers" to remove all writers.
            </Form.Text>
          )}
        </Col>

        {/* Artists */}
        <Col lg={6}>
          <Form.Label>Artists</Form.Label>
          <Select
            isMulti
            isClearable
            options={[
              ...(isBatchMode ? [{ value: BATCH_MARKERS.CLEAR_FIELD, label: "⚠️ Clear All Artists" }] : []),
              ...artistOptions.map((a) => ({ value: a, label: a })),
            ]}
            value={(comic.artist || []).map((a) => ({ value: a, label: a }))}
            onChange={(selected) => handleChange("artist", selected ? selected.map((s) => s.value) : [])}
            placeholder={isBatchMode ? "No change (leave as is)" : "Select artists..."}
          />
          {isBatchMode && (
            <Form.Text className="text-muted">
              Empty = no change. Select "Clear All Artists" to remove all artists.
            </Form.Text>
          )}
        </Col>

        {/* Comments */}
        <Col lg={12}>
          <Form.Label>Comments</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={comic.comments || ""}
            onChange={(e) => handleChange("comments", e.target.value)}
            placeholder={isBatchMode ? "No change (leave as is)" : "Add any comments here"}
          />
          {isBatchMode && (
            <>
              <Form.Check
                type="checkbox"
                label="Append to existing comments (instead of replacing)"
                checked={appendComments}
                onChange={(e) => setAppendComments(e.target.checked)}
                className="mt-2"
              />
              <Form.Text className="text-muted">
                Empty = no change. Type a space " " to clear comments on all selected comics.
                {appendComments && " Append mode adds your text after existing comments."}
              </Form.Text>
            </>
          )}
        </Col>
      </Row>

      <div className="mt-3 text-end">
        {isEdit && onCancel && (
          <Button variant="secondary" className="me-2" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant={isEdit ? "info" : "primary"}>
          {isEdit ? "Save Changes" : "Add Comic"}
        </Button>
      </div>
    </Form>
  );
}
