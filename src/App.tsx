import { BrowserRouter as Router } from "react-router-dom";
import {AppProvider} from "./context/AppContext";
import AppNavbar from "./components/AppNavbar";
import AppRoutes from "./routes/AppRoutes"; // Import AppRoutes

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppNavbar />
        <div className="container mt-4">
          <AppRoutes /> {/* Use AppRoutes here */}
        </div>
      </Router>
    </AppProvider>
  );
}