import { useAppContext } from "../hooks/useAppContext";
import { Card, Container } from "react-bootstrap";

export function Home() {
  const { jsonData } = useAppContext();

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Home</h1>

      {jsonData && (
        <Card className="mt-4">
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </Card>
      )}
    </Container>
  );
}
