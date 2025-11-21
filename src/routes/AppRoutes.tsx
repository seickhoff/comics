import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Overstreet } from "../pages/Overstreet";
import { MaintenanceTable } from "../pages/MaintenanceTable";
import { Summary } from "../pages/Summary";
import { Heatmap } from "../pages/Heatmap";
import { Settings } from "../pages/Settings";
import { File } from "../pages/File";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/file" element={<File />} />
      <Route path="/maintenance" element={<MaintenanceTable />} />
      <Route path="/overstreet" element={<Overstreet />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/heatmap" element={<Heatmap />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
