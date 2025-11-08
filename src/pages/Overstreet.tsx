import { useAppContext } from "../hooks/useAppContext";
import { Alert, Container } from "react-bootstrap";
import OverstreetReport from "../components/OverstreetReport";

export function Overstreet() {
  const { jsonData, fileName } = useAppContext();

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Overstreet Report</h1>

      {!fileName ? (
        <Alert key="info" variant="info">
          No data loaded. Please visit the <Alert.Link href="/file">File</Alert.Link> page to load an existing file or
          start a new collection.
        </Alert>
      ) : (
        <>
          <OverstreetReport comics={jsonData} />
        </>
      )}
    </Container>
  );
}
