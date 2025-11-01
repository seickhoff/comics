import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import { AppNavbar } from "./components/AppNavbar";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastProvider } from "./context/ToastContext";

export function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Router>
          <AppNavbar />
          <div className="container mt-4">
            <AppRoutes />
          </div>
        </Router>
      </ToastProvider>
    </AppProvider>
  );
}
