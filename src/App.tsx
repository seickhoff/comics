import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import { AppNavbar } from "./components/AppNavbar";
import { AppRoutes } from "./routes/AppRoutes";

export function App() {
  return (
    <AppProvider>
      <Router>
        <AppNavbar />
        <div className="container mt-4">
          <AppRoutes />
        </div>
      </Router>
    </AppProvider>
  );
}
