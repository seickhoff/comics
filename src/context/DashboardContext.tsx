import { createContext, useContext, useState, ReactNode } from "react";

type DashboardState = {
  filters: string[];
  setFilters: (filters: string[]) => void;
};

const DashboardContext = createContext<DashboardState | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <DashboardContext.Provider value={{ filters, setFilters }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
};
