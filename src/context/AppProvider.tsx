// src/context/AppProvider.tsx
import { useState, ReactNode } from "react";
import { AppContext, SortConfig } from "./AppContext";
import { ColumnConfig, ColumnKey, ComicBook } from "../interfaces/ComicBook";

const defaultColumns: ColumnConfig[] = [
  { key: "title", label: "Title", visible: true },
  { key: "publisher", label: "Publisher", visible: true },
  { key: "volume", label: "Volume", visible: true },
  { key: "issue", label: "Issue", visible: true },
  { key: "month", label: "Month", visible: true },
  { key: "year", label: "Year", visible: true },
  { key: "quantity", label: "Quantity", visible: true },
  { key: "value", label: "Value", visible: true },
  { key: "condition", label: "Condition", visible: true },
  { key: "writer", label: "Writer", visible: true },
  { key: "artist", label: "Artist", visible: true },
  { key: "comments", label: "Comments", visible: true },
];

// AppProvider component that provides the global context
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<ColumnKey, string>>({} as Record<ColumnKey, string>);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<ComicBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [useOrFiltering, setUseOrFiltering] = useState(false);
  const [user, setUser] = useState<null | { id: string; name: string }>(null);
  const [tableSortConfig, setTableSortConfig] = useState<Record<string, SortConfig>>({});

  return (
    <AppContext.Provider
      value={{
        columns,
        fileName,
        filters,
        isConfigOpen,
        jsonData,
        loading,
        setColumns,
        setFileName,
        setFilters,
        setIsConfigOpen,
        setJsonData,
        setLoading,
        setUseOrFiltering,
        setUser,
        useOrFiltering,
        user,
        tableSortConfig,
        setTableSortConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
