import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ChevronDown, ChevronRight, Plus } from "react-bootstrap-icons";
import { ReportConfiguration, ReportConfigurationProps } from "./ReportConfiguration";
import { useAppContext } from "../hooks/useAppContext";
import { ComicForm } from "./ComicForm";
import { ComicBook } from "../interfaces/ComicBook";

export default function ReportConfigWrapper(props: ReportConfigurationProps) {
  const {
    isConfigOpen,
    setIsConfigOpen,
    jsonData: tableData,
    setJsonData: setTableData,
    selectedKeys,
    setSelectedKeys,
    handleBatchEdit,
  } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleClose = () => setShowAddModal(false);
  const handleShow = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent collapsing the config
    setShowAddModal(true);
  };

  const handleAddComic = (newComic: ComicBook) => {
    // Add to local state
    setTableData([...tableData, newComic]);
    setShowAddModal(false);
  };

  const handleEditSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (handleBatchEdit) {
      handleBatchEdit();
    }
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedKeys(new Set());
  };

  return (
    <div className="mb-3">
      {/* Header row with icon and Add button */}
      <div
        className="d-flex align-items-center justify-content-between cursor-pointer"
        onClick={() => setIsConfigOpen(!isConfigOpen)}
      >
        <div className="d-flex align-items-center">
          <div className="me-2">{isConfigOpen ? <ChevronDown /> : <ChevronRight />}</div>
          <strong>Report Configuration</strong>
        </div>

        <div className="d-flex align-items-center gap-2">
          {selectedKeys.size > 0 && (
            <>
              <span style={{ fontSize: "0.9rem", marginRight: 5 }}>
                <strong>{selectedKeys.size}</strong> selected
              </span>
              <Button variant="primary" size="sm" onClick={handleEditSelected}>
                Edit Selected
              </Button>
              <Button variant="secondary" size="sm" onClick={handleClearSelection}>
                Clear
              </Button>
            </>
          )}
          <Button variant="outline-primary" size="sm" onClick={handleShow} className="d-flex align-items-center">
            <Plus className="me-1" /> Add
          </Button>
        </div>
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

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add Comic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ComicForm
            mode="add"
            existingComics={tableData} // for datalist options
            onSubmit={handleAddComic}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
