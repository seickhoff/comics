// src/components/ComicForm.tsx
import { useState, useMemo, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select/creatable";
import { ComicBook, GradeCode, GradeDescription } from "../interfaces/ComicBook";
import { useToast } from "../context/ToastContext";

type ComicFormProps = {
  mode: "add" | "edit";
  existingComics: ComicBook[];
  initialComic?: ComicBook;
  onSubmit: (comic: ComicBook, isLastInBulk?: boolean) => void;
  onCancel?: () => void;
  isBatchMode?: boolean;
};

function getUniqueValues<T extends keyof ComicBook>(comics: ComicBook[], key: T): string[] {
  const values = comics.flatMap((c) => {
    const v = c[key];
    if (Array.isArray(v)) return v.map(String);
    return [String(v ?? "")];
  });
  const unique = Array.from(new Set(values.filter((v) => v.trim() !== "")));
  return unique.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function ComicForm({ mode, existingComics, initialComic, onSubmit, onCancel, isBatchMode }: ComicFormProps) {
  const isEdit = mode === "edit";

  const [comic, setComic] = useState<Partial<ComicBook>>(
    initialComic || {
      title: "",
      publisher: "",
      volume: "",
      issue: "",
      value: "",
      writer: [],
      artist: [],
      month: "",
      year: "",
      quantity: 1,
      condition: GradeCode.NM,
      comments: "",
    }
  );

  // For bulk add mode
  const [endingIssue, setEndingIssue] = useState<string>("");

  const { addToast } = useToast();

  // reset when editing a different comic
  useEffect(() => {
    if (isEdit && initialComic) setComic(initialComic);
  }, [initialComic]);

  const titleOptions = useMemo(() => getUniqueValues(existingComics, "title"), [existingComics]);
  const publisherOptions = useMemo(() => getUniqueValues(existingComics, "publisher"), [existingComics]);
  const volumeOptions = useMemo(() => getUniqueValues(existingComics, "volume"), [existingComics]);
  const issueOptions = useMemo(() => getUniqueValues(existingComics, "issue"), [existingComics]);
  const valueOptions = useMemo(() => getUniqueValues(existingComics, "value"), [existingComics]);
  const monthOptions = useMemo(() => getUniqueValues(existingComics, "month"), [existingComics]);
  const yearOptions = useMemo(() => getUniqueValues(existingComics, "year"), [existingComics]);
  const writerOptions = useMemo(() => getUniqueValues(existingComics, "writer"), [existingComics]);
  const artistOptions = useMemo(() => getUniqueValues(existingComics, "artist"), [existingComics]);

  const handleChange = (key: keyof ComicBook, value: string | string[] | number) => {
    setComic((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if bulk add mode is active (add mode with ending issue filled)
    if (!isEdit && endingIssue && comic.issue && comic.month && comic.year) {
      const startIssue = parseFloat(comic.issue);
      const endIssue = parseFloat(endingIssue);

      if (isNaN(startIssue) || isNaN(endIssue)) {
        addToast({
          title: "Invalid Input",
          body: "Issue and Ending Issue must be valid numbers for bulk add.",
          bg: "danger",
        });
        return;
      }

      if (endIssue < startIssue) {
        addToast({
          title: "Invalid Range",
          body: "Ending Issue must be greater than or equal to Issue.",
          bg: "danger",
        });
        return;
      }

      // Generate multiple comics
      const comicsToAdd: ComicBook[] = [];
      let currentIssue = startIssue;
      let currentMonth = parseInt(comic.month);
      let currentYear = parseInt(comic.year);

      while (currentIssue <= endIssue) {
        comicsToAdd.push({
          ...comic,
          issue: String(currentIssue),
          month: String(currentMonth).padStart(2, "0"),
          year: String(currentYear),
        } as ComicBook);

        currentIssue++;
        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }
      }

      // Submit each comic, marking the last one
      comicsToAdd.forEach((c, index) => {
        const isLast = index === comicsToAdd.length - 1;
        onSubmit(c, isLast);
      });

      // Reset form
      setComic({
        title: "",
        publisher: "",
        volume: "",
        issue: "",
        value: "",
        writer: [],
        artist: [],
        month: "",
        year: "",
        quantity: 1,
        condition: GradeCode.NM,
      });
      setEndingIssue("");

      addToast({
        title: "Comics Added",
        body: `Successfully added ${comicsToAdd.length} comics to your collection.`,
        bg: "success",
      });
    } else {
      // Single comic add or edit
      onSubmit(comic as ComicBook);

      if (!isEdit) {
        setComic({
          title: "",
          publisher: "",
          volume: "",
          issue: "",
          value: "",
          writer: [],
          artist: [],
          month: "",
          year: "",
          quantity: 1,
          condition: GradeCode.NM,
        });
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
    if (!isEdit && endingIssue && comic.issue && comic.month && comic.year) {
      const start = parseFloat(comic.issue);
      const end = parseFloat(endingIssue);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        return Math.floor(end - start + 1);
      }
    }
    return 0;
  }, [isEdit, endingIssue, comic.issue, comic.month, comic.year]);

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

        {/* Ending Issue - only show in add mode */}
        {!isEdit && (
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
        )}

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

        {/* Writers */}
        <Col lg={6}>
          <Form.Label>Writers</Form.Label>
          <Select
            isMulti
            isClearable
            options={[
              ...(isBatchMode ? [{ value: "__CLEAR__", label: "⚠️ Clear All Writers" }] : []),
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
              ...(isBatchMode ? [{ value: "__CLEAR__", label: "⚠️ Clear All Artists" }] : []),
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
            <Form.Text className="text-muted">
              Empty = no change. Type a space " " to clear comments on all selected comics.
            </Form.Text>
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
