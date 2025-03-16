import { useAppContext } from "../context/AppContext";
import { Container, Button, Card, Alert } from "react-bootstrap";

export default function Home() {
  const { user, setUser } = useAppContext();

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Home Page</h1>

      {user ? (
        <Card>
          <Card.Body>
            <Card.Title>Welcome!</Card.Title>
            <Card.Text>Welcome, {user.name}!</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="info">
          <p>You are not logged in. Please log in to continue.</p>
          <Button onClick={() => setUser({ id: "1", name: "Scott" })} variant="primary">
            Log in as Scott
          </Button>
        </Alert>
      )}
    </Container>
  );
}
