import { ColumnConfig, ColumnKey } from "../interfaces/ComicBook";

type ReportConfigurationProps = {
  columns: ColumnConfig[];
  onToggle: (key: ColumnKey) => void;
  filters: Record<ColumnKey, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<ColumnKey, string>>>;
  useOrFiltering: boolean;
  setUseOrFiltering: (value: boolean) => void;
};

export const ReportConfiguration: React.FC<ReportConfigurationProps> = ({
  columns,
  onToggle,
  filters,
  setFilters,
  useOrFiltering,
  setUseOrFiltering,
}) => {
  return (
    <div className="mb-4">
      <h5>Report Configuration</h5>
      {columns.map((col) => (
        <div key={col.key} className="form-group d-flex align-items-center mb-2">
          <input
            type="checkbox"
            className="form-check-input me-2"
            id={`toggle-${col.key}`}
            checked={col.visible}
            onChange={() => onToggle(col.key)}
          />
          <label className="form-check-label me-3" htmlFor={`toggle-${col.key}`} style={{ minWidth: "100px" }}>
            {col.label}
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Regex filter"
            value={filters[col.key] || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                [col.key]: e.target.value,
              }))
            }
          />
        </div>
      ))}

      <div className="form-check mt-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="or-filter-toggle"
          checked={useOrFiltering}
          onChange={() => setUseOrFiltering(!useOrFiltering)}
        />
        <label className="form-check-label" htmlFor="or-filter-toggle">
          Use <strong>OR</strong> logic across filters
        </label>
      </div>
    </div>
  );
};
