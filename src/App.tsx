import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import { AppNavbar } from "./components/AppNavbar";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastProvider } from "./context/ToastContext";
import { useBeforeUnloadPrompt } from "./hooks/useBeforeUnloadPrompt";
import { useAppContext } from "./hooks/useAppContext";

function AppContent() {
  const { jsonData } = useAppContext();

  // Only warn if there's data loaded
  const hasLoadedData = Array.isArray(jsonData) && jsonData.length > 0;
  useBeforeUnloadPrompt(hasLoadedData);

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
