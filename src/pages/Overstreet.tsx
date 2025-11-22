import { useAppContext } from "../hooks/useAppContext";
import { Container, Button } from "react-bootstrap";
import { Printer } from "react-bootstrap-icons";
import OverstreetReport from "../components/OverstreetReport";
import { EmptyState } from "../components/EmptyState";

export function Overstreet() {
  const { jsonData, settings } = useAppContext();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Overstreet Report</h1>
        {jsonData.length > 0 && (
          <Button variant="outline-secondary" size="sm" onClick={handlePrint} className="print-hide">
            <Printer className="me-2" />
            PDF
          </Button>
        )}
      </div>

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
