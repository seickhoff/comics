import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/Home";
import { LoadFile } from "../pages/LoadFile";
import { ImportClipboard } from "../pages/ImportClipboard";
import { ExportCollection } from "../pages/ExportCollection";
import { PreviewData } from "../pages/PreviewData";
import { Overstreet } from "../pages/Overstreet";
import { MaintenanceTable } from "../pages/MaintenanceTable";
import { Summary } from "../pages/Summary";
import { Heatmap } from "../pages/Heatmap";
import { Settings } from "../pages/Settings";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/file" element={<Navigate to="/file/load" replace />} />
      <Route path="/file/load" element={<LoadFile />} />
      <Route path="/file/import" element={<ImportClipboard />} />
      <Route path="/file/export" element={<ExportCollection />} />
      <Route path="/file/preview" element={<PreviewData />} />
      <Route path="/maintenance" element={<MaintenanceTable />} />
      <Route path="/overstreet" element={<Overstreet />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/heatmap" element={<Heatmap />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
