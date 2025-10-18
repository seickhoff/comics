import { useAppContext } from "../../hooks/useAppContext";
import { Alert, Container } from "react-bootstrap";
import { ComicBook } from "../../interfaces/ComicBook";
import { AddComicForm } from "../../components/AddComicForm";

export function AddOne() {
  const { jsonData, setJsonData } = useAppContext();

  const handleAddComic = (newComic: ComicBook): void => {
    setJsonData((prev) => [...prev, newComic]);
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Add One</h1>

      {jsonData.length === 0 ? (
        <Alert key="danger" variant="danger">
          No data loaded. Please <Alert.Link href="/file">open</Alert.Link> a data file to get started.
        </Alert>
      ) : (
        <>
          <AddComicForm existingComics={jsonData} onAdd={handleAddComic} />
        </>
      )}
    </Container>
  );
}
