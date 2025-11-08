import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Card, Button, Alert, Spinner } from "react-bootstrap";
import { normalizeComicBook } from "../utils/normalizeComicBook";
import { ComicBook } from "../interfaces/ComicBook";

export function JsonFileUploader() {
  const { setJsonData, setLoading, setFileName } = useAppContext();
  const [loading, setLocalLoading] = useState(false);

  // --- helpers ---
  function parseNumber(str: string): number | null {
    const num = Number(str);
    return Number.isFinite(num) ? num : null;
  }

  // normalize "The Amazing Spider-Man" → "Amazing Spider-Man, The"
  function normalizeTitle(title: string): string {
    if (title.startsWith("The ")) {
      return title.slice(4) + ", The";
    }
    return title;
  }

  function sortComics(data: ComicBook[]) {
    return [...data].sort((a, b) => {
      // 1. Title (normalize for sorting)
      const t = normalizeTitle(a.title).localeCompare(normalizeTitle(b.title));
      if (t !== 0) return t;

      // 2. Volume
      const av = parseNumber(a.volume);
      const bv = parseNumber(b.volume);
      if (av !== null && bv !== null) {
        if (av !== bv) return av - bv;
      } else {
        const v = a.volume.localeCompare(b.volume);
        if (v !== 0) return v;
      }

      // 3. Issue
      const ai = parseNumber(a.issue);
      const bi = parseNumber(b.issue);
      if (ai !== null && bi !== null) {
        return ai - bi;
      }
      return a.issue.localeCompare(b.issue);
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setLocalLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawData = JSON.parse(e.target?.result as string);
        const normalized = Array.isArray(rawData) ? rawData.map(normalizeComicBook) : [];
        const sorted = sortComics(normalized);
        setJsonData(sorted);
      } catch (error) {
        console.log(error);
        alert("Error parsing JSON file");
      } finally {
        setLoading(false);
        setLocalLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleStartNew = () => {
    setJsonData([]);
    setFileName("new-collection.json");
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Open Comic Book File</Card.Title>
        <div className="d-flex justify-content-center gap-2">
          <Button variant="primary" className="mb-3" disabled={loading}>
            <label htmlFor="file-upload" className="w-100" style={{ cursor: "pointer", margin: 0 }}>
              {loading ? <Spinner animation="border" size="sm" /> : "Choose File"}
            </label>
          </Button>
          <input type="file" id="file-upload" accept=".json" onChange={handleFileChange} hidden disabled={loading} />

          <Button variant="success" className="mb-3" onClick={handleStartNew} disabled={loading}>
            Start New Collection
          </Button>
        </div>
        {loading && <Alert variant="warning">Loading file...</Alert>}
        {!loading && <Alert variant="info">Load an existing JSON file or start a new collection from scratch</Alert>}
      </Card.Body>
    </Card>
  );
}
