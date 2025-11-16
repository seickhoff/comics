import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import { AppNavbar } from "./components/AppNavbar";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastProvider } from "./context/ToastContext";
import { useBeforeUnloadPrompt } from "./hooks/useBeforeUnloadPrompt";
import { useAppContext } from "./hooks/useAppContext";

function AppContent() {
  const { jsonData, setIsMobileView } = useAppContext();

  // Only warn if there's data loaded
  const hasLoadedData = Array.isArray(jsonData) && jsonData.length > 0;
  useBeforeUnloadPrompt(hasLoadedData);

  // Listen for viewport changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobileView]);

  return (
    <Router>
      <AppNavbar />
      <div className="container mt-4">
        <AppRoutes />
      </div>
    </Router>
  );
}

export function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}
