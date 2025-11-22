import { useAppContext } from "../hooks/useAppContext";
import { Container } from "react-bootstrap";
import OverstreetReport from "../components/OverstreetReport";
import { EmptyState } from "../components/EmptyState";

export function Overstreet() {
  const { jsonData, settings } = useAppContext();

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Overstreet Report</h1>

      {jsonData.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <OverstreetReport comics={jsonData} settings={settings} />
        </>
      )}
    </Container>
  );
}
