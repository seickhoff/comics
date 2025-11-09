import { Card, InputGroup, Button } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
import { ColumnConfig, ColumnKey } from "../interfaces/ComicBook";

export type ReportConfigurationProps = {
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
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="row">
          {columns.map((col) => (
            <div key={col.key} className="col-12 col-md-6 col-lg-4 mb-3">
              <div className="form-group d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  id={`toggle-${col.key}`}
                  checked={col.visible}
                  onChange={() => onToggle(col.key)}
                />
                <label className="form-check-label me-2" htmlFor={`toggle-${col.key}`} style={{ minWidth: "100px" }}>
                  {col.label}
                </label>
                <InputGroup>
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
                  {filters[col.key] && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          [col.key]: "",
                        }))
                      }
                      title="Clear filter"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </InputGroup>
              </div>
            </div>
          ))}
        </div>

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
      </Card.Body>
    </Card>
  );
};
