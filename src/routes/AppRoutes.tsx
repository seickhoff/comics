import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { File } from "../pages/File";
import { Overstreet } from "../pages/Overstreet";
import { MaintenanceTable } from "../pages/MaintenanceTable";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/file" element={<File />} />
      <Route path="/maintenance" element={<MaintenanceTable />} />
      <Route path="/overstreet" element={<Overstreet />} />
    </Routes>
  );
}
