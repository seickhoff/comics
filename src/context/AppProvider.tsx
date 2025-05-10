// src/context/AppProvider.tsx
import { useState, ReactNode } from "react";
import { AppContext } from "./AppContext";
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
  const [user, setUser] = useState<null | { id: string; name: string }>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<ComicBook[]>([]);
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [filters, setFilters] = useState<Record<ColumnKey, string>>({} as Record<ColumnKey, string>);
  const [useOrFiltering, setUseOrFiltering] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        jsonData,
        setJsonData,
        columns,
        setColumns,
        filters,
        setFilters,
        useOrFiltering,
        setUseOrFiltering,
        fileName,
        setFileName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
