import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Report } from "../pages/Report";
import { Settings } from "../pages/Settings";
import { File } from "../pages/File";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/report" element={<Report />} />
      <Route path="/file" element={<File />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
