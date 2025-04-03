import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import DashboardRoutes from "./DashboardRoutes";
import Settings from "../pages/Settings";
import Open from "../pages/file/Open";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/file/open" element={<Open />} />
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
