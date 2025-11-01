import { useAppContext } from "../../hooks/useAppContext";
import { Alert, Container } from "react-bootstrap";
import OverstreetReport from "../../components/OverstreetReport";

export function Overstreet() {
  const { jsonData } = useAppContext();

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Overstreet Report</h1>

      {jsonData.length === 0 ? (
        <Alert key="danger" variant="danger">
          No data loaded. Please <Alert.Link href="/file">open</Alert.Link> a data file to get started.
        </Alert>
      ) : (
        <>
          <OverstreetReport comics={jsonData} />
        </>
      )}
    </Container>
  );
}
