import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ChevronDown, ChevronRight, Plus } from "react-bootstrap-icons";
import { ReportConfiguration, ReportConfigurationProps } from "./ReportConfiguration";
import { useAppContext } from "../hooks/useAppContext";
import { ComicForm } from "./ComicForm";
import { ComicBook } from "../interfaces/ComicBook";
import { normalizeComicBook } from "../utils/normalizeComicBook";
import { getComicKey } from "../utils/comicKeys";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClose = () => setShowAddModal(false);
  const handleShow = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent collapsing the config
    setShowAddModal(true);
  };

  const handleAddComic = (newComic: ComicBook, isLastInBulk?: boolean) => {
    // Normalize the comic before adding
    const normalized = normalizeComicBook(newComic);
    setTableData((prev) => [...prev, normalized]);

    // Only close modal after the last comic in a bulk add
    if (isLastInBulk !== false) {
      setShowAddModal(false);
    }
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

  const handleDeleteSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedKeys.size === 0) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const filtered = tableData.filter((c) => !selectedKeys.has(getComicKey(c)));
    setTableData(filtered);
    setSelectedKeys(new Set());
    setShowDeleteConfirm(false);
  };

  return (
    <div className="mb-3">
      {/* Header row with icon and Add button - Desktop */}
      <div
        className="d-none d-md-flex align-items-center justify-content-between cursor-pointer"
        onClick={() => setIsConfigOpen(!isConfigOpen)}
      >
        <div className="d-flex align-items-center">
          <div className="me-2">{isConfigOpen ? <ChevronDown /> : <ChevronRight />}</div>
          <strong>Report Configuration</strong>
        </div>

        <div className="d-flex align-items-center gap-2">
          {selectedKeys.size > 0 ? (
            <>
              <span style={{ fontSize: "0.9rem", marginRight: 5 }}>
                <strong>{selectedKeys.size}</strong> selected
              </span>
              <Button variant="outline-primary" size="sm" onClick={handleEditSelected}>
                Edit
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleDeleteSelected}>
                Delete
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={handleClearSelection}>
                Clear
              </Button>
            </>
          ) : (
            <Button variant="outline-primary" size="sm" onClick={handleShow} className="d-flex align-items-center">
              <Plus className="me-1" /> Add
            </Button>
          )}
        </div>
      </div>

      {/* Header row - Mobile */}
      <div className="d-md-none">
        {/* First row: Report Configuration and Add button (or Edit/Delete if selections exist) */}
        <div
          className="d-flex align-items-center justify-content-between cursor-pointer"
          onClick={() => setIsConfigOpen(!isConfigOpen)}
        >
          <div className="d-flex align-items-center">
            <div className="me-2">{isConfigOpen ? <ChevronDown /> : <ChevronRight />}</div>
            <strong>Report Configuration</strong>
          </div>

          {selectedKeys.size === 0 ? (
            <Button variant="outline-primary" size="sm" onClick={handleShow} className="d-flex align-items-center">
              <Plus className="me-1" /> Add
            </Button>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Button variant="outline-primary" size="sm" onClick={handleEditSelected}>
                Edit
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleDeleteSelected}>
                Delete
              </Button>
            </div>
          )}
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete <strong>{selectedKeys.size}</strong> selected comic(s)?
          </p>
          <p className="text-danger mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
