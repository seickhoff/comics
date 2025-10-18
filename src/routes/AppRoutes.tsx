import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Settings } from "../pages/Settings";
import { File } from "../pages/File";
import { Table } from "../pages/reports/Table";
import { Overstreet } from "../pages/reports/Overstreet";
import { MaintenanceTable } from "../pages/maintenance/MaintenanceTable";
import { AddOne } from "../pages/maintenance/AddOne";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/report/table" element={<Table />} />
      <Route path="/report/overstreet" element={<Overstreet />} />
      <Route path="/file" element={<File />} />
      <Route path="/maintenance/add" element={<AddOne />} />
      <Route path="/maintenance/list" element={<MaintenanceTable />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
