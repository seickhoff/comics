import { useAppContext } from "../hooks/useAppContext";
import { Container } from "react-bootstrap";
import { ColumnConfig, ColumnKey } from "../interfaces/ComicBook";
import { TableReport } from "../components/TableReport";
import ReportConfigWrapper from "../components/ReportConfigurationWrapper";
import { EmptyState } from "../components/EmptyState";

export function MaintenanceTable() {
  const { columns, setColumns, fileName, filters, setFilters, useOrFiltering, setUseOrFiltering } = useAppContext();

  const toggleColumnVisibility = (key: ColumnKey) => {
    setColumns((cols: ColumnConfig[]) =>
      cols.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Maintenance</h1>

      {!fileName ? (
        <EmptyState />
      ) : (
        <>
          <ReportConfigWrapper
            columns={columns}
            onToggle={toggleColumnVisibility}
            filters={filters}
            setFilters={setFilters}
            useOrFiltering={useOrFiltering}
            setUseOrFiltering={setUseOrFiltering}
          />
          <TableReport tableId="main-comics-table" />
        </>
      )}
    </Container>
  );
}
