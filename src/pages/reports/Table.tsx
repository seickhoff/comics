import { useAppContext } from "../../hooks/useAppContext";
import { Alert, Container } from "react-bootstrap";
import { ColumnConfig, ColumnKey } from "../../interfaces/ComicBook";
import { TableReport } from "../../components/TableReport";
import ReportConfigWrapper from "../../components/ReportConfigurationWrapper";

export function Table() {
  const { columns, setColumns, jsonData, filters, setFilters, useOrFiltering, setUseOrFiltering } = useAppContext();

  const toggleColumnVisibility = (key: ColumnKey) => {
    setColumns((cols: ColumnConfig[]) =>
      cols.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Report</h1>

      {jsonData.length === 0 ? (
        <Alert key="danger" variant="danger">
          No data loaded. Please <Alert.Link href="/file">open</Alert.Link> a data file to get started.
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
          <TableReport
            tableId="main-comics-table"
            data={jsonData}
            columns={columns}
            filters={filters}
            useOrFiltering={useOrFiltering}
          />
        </>
      )}
    </Container>
  );
}
