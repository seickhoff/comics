import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Report } from "../pages/Report";
import { Settings } from "../pages/Settings";
import { Open } from "../pages/file/Open";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/report" element={<Report />} />
      <Route path="/file/open" element={<Open />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
