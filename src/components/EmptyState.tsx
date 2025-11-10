import { Alert } from "react-bootstrap";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  variant?: "info" | "warning" | "secondary";
  showFileLink?: boolean;
}

/**
 * Reusable empty state component for displaying when no data is loaded
 */
export function EmptyState({ message = "No data loaded.", variant = "info", showFileLink = true }: EmptyStateProps) {
  return (
    <Alert variant={variant}>
      {showFileLink ? (
        <>
          {message} Please visit the <Alert.Link href="/file">File</Alert.Link> page to load an existing file or start a
          new collection.
        </>
      ) : (
        message
      )}
    </Alert>
  );
}
