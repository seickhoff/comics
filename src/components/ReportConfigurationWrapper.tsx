import { ChevronDown, ChevronRight } from "react-bootstrap-icons"; // bootstrap-icons
import { ReportConfiguration, ReportConfigurationProps } from "./ReportConfiguration";
import { useAppContext } from "../hooks/useAppContext";

export default function ReportConfigWrapper(props: ReportConfigurationProps) {
  const { isConfigOpen, setIsConfigOpen } = useAppContext();

  return (
    <div className="mb-3">
      {/* Header row with icon */}
      <div className="d-flex align-items-center cursor-pointer" onClick={() => setIsConfigOpen(!isConfigOpen)}>
        <div className="me-2">{isConfigOpen ? <ChevronDown /> : <ChevronRight />}</div>
        <strong>Report Configuration</strong>
      </div>

      {/* Collapsible body */}
      {isConfigOpen && (
        <div className="mt-2">
          <ReportConfiguration
            columns={props.columns}
            onToggle={props.onToggle}
            filters={props.filters}
            setFilters={props.setFilters}
            useOrFiltering={props.useOrFiltering}
            setUseOrFiltering={props.setUseOrFiltering}
          />
        </div>
      )}
    </div>
  );
}
