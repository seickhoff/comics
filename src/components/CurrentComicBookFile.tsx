import { useAppContext } from "../hooks/useAppContext";
import { Card, Alert } from "react-bootstrap";

export function CurrentComicBookFile() {
  const { fileName } = useAppContext();

  if (!fileName) return null;

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Comic Book File</Card.Title>
        <Alert variant="info">{fileName}</Alert>
      </Card.Body>
    </Card>
  );
}
