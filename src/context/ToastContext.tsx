import { createContext, useContext, useState, ReactNode } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

type ToastMessage = {
  id: number;
  title?: string;
  body: string;
  bg?: string;
  delay?: number;
};

type ToastContextType = {
  addToast: (toast: Omit<ToastMessage, "id">) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, delay: 3000, ...toast }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{
          zIndex: 9999,
          position: "fixed",
          top: window.innerWidth < 768 ? "4rem" : "1rem",
          right: "1rem",
          display: "flex",
          flexDirection: "column", // stack vertically
          gap: "0.5rem", // spacing between toasts
        }}
      >
        {[...toasts].reverse().map((t) => (
          <Toast key={t.id} bg={t.bg || "dark"} onClose={() => removeToast(t.id)} delay={t.delay} autohide>
            {t.title && (
              <Toast.Header closeButton={true}>
                <strong className="me-auto">{t.title}</strong>
              </Toast.Header>
            )}
            <Toast.Body className="text-white">{t.body}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
