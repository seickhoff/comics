import { useAppContext } from "../hooks/useAppContext";
import { Alert, Container } from "react-bootstrap";

import { ReportTable } from "../components/ReportTable";
import { ReportConfiguration } from "../components/ReportConfiguration";
import { ColumnConfig, ColumnKey } from "../interfaces/ComicBook";
import Overstreet from "../components/OverstreetReport";

export function Report() {
  const { columns, setColumns, jsonData, filters, setFilters, useOrFiltering, setUseOrFiltering } = useAppContext();

  const toggleColumnVisibility = (key: ColumnKey) => {
    setColumns((cols: ColumnConfig[]) =>
      cols.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Report</h1>

      <ReportConfiguration
        columns={columns}
        onToggle={toggleColumnVisibility}
        filters={filters}
        setFilters={setFilters}
        useOrFiltering={useOrFiltering}
        setUseOrFiltering={setUseOrFiltering}
      />

      {jsonData.length === 0 ? (
        <Alert key="danger" variant="danger">
          No data loaded. Please <Alert.Link href="/file">open</Alert.Link> a data file to get started.
        </Alert>
      ) : (
        <>
          <Overstreet comics={jsonData} />
          <ReportTable data={jsonData} columns={columns} filters={filters} useOrFiltering={useOrFiltering} />
        </>
      )}
    </Container>
  );
}
