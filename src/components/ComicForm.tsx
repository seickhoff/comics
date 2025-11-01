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
  onSubmit: (comic: ComicBook) => void;
  onCancel?: () => void;
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

export function ComicForm({ mode, existingComics, initialComic, onSubmit, onCancel }: ComicFormProps) {
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
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm mt-2">
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
            min={1}
            value={comic.quantity || 1}
            onChange={(e) => handleChange("quantity", Number(e.target.value))}
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
            placeholder="0.00"
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
            value={comic.condition || GradeCode.NM}
            onChange={(e) => handleChange("condition", e.target.value)}
          >
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
            options={writerOptions.map((w) => ({ value: w, label: w }))}
            value={(comic.writer || []).map((w) => ({ value: w, label: w }))}
            onChange={(selected) => handleChange("writer", selected ? selected.map((s) => s.value) : [])}
          />
        </Col>

        {/* Artists */}
        <Col lg={6}>
          <Form.Label>Artists</Form.Label>
          <Select
            isMulti
            isClearable
            options={artistOptions.map((a) => ({ value: a, label: a }))}
            value={(comic.artist || []).map((a) => ({ value: a, label: a }))}
            onChange={(selected) => handleChange("artist", selected ? selected.map((s) => s.value) : [])}
          />
        </Col>

        {/* Comments */}
        <Col lg={12}>
          <Form.Label>Comments</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={comic.comments || ""}
            onChange={(e) => handleChange("comments", e.target.value)}
            placeholder="Add any comments here"
          />
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
