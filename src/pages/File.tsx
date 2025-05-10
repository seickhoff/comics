import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAppContext } from "../hooks/useAppContext";
import { Container } from "react-bootstrap";
import { JsonFileUploader } from "../components/JsonFileUploader";
import { CurrentComicBookFile } from "../components/CurrentComicBookFile";
import { JsonFileDownloader } from "../components/JsonFileDownloader";

export function File() {
  const { loading } = useAppContext();

  return (
    <Container className="mt-4">
      <h1 className="mb-3">File Maintenance</h1>

      {loading && <LoadingSpinner />}

      <JsonFileUploader />

      <CurrentComicBookFile />

      <JsonFileDownloader />
    </Container>
  );
}
