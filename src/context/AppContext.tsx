// src/context/AppContext.tsx
import { createContext, Dispatch, SetStateAction } from "react";
import { ColumnConfig, ColumnKey, ComicBook } from "../interfaces/ComicBook";

// Type for User
export type User = { id: string; name: string } | null;

// Type for the state
export type AppState = {
  user: User;
  setUser: (user: User) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  jsonData: ComicBook[];
  setJsonData: (data: ComicBook[]) => void;

  columns: ColumnConfig[];
  setColumns: Dispatch<SetStateAction<ColumnConfig[]>>;

  filters: Record<ColumnKey, string>;
  setFilters: Dispatch<SetStateAction<Record<ColumnKey, string>>>;

  useOrFiltering: boolean;
  setUseOrFiltering: (value: boolean) => void;

  isConfigOpen: boolean;
  setIsConfigOpen: (value: boolean) => void;

  fileName: string | null;
  setFileName: (value: string | null) => void;
};

// Context declaration
export const AppContext = createContext<AppState | undefined>(undefined);
