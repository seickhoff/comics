import { useAppContext } from "../../hooks/useAppContext";
import { Alert, Container } from "react-bootstrap";
import { ColumnConfig, ColumnKey } from "../../interfaces/ComicBook";
import { TableReport } from "../../components/TableReport";
import ReportConfigWrapper from "../../components/ReportConfigurationWrapper";

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
        <Alert key="info" variant="info">
          No data loaded. Please visit the <Alert.Link href="/file">File</Alert.Link> page to load an existing file or
          start a new collection.
        </Alert>
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
