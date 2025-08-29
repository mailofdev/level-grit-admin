import React, { useState, useMemo } from "react";
import DynamicForm from "./DynamicForm";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

const Toast = ({ message, type, onClose }) => (
  <div className={`toast align-items-center text-bg-${type} border-0 show position-fixed top-0 end-0 m-3`} role="alert" aria-live="assertive" aria-atomic="true" style={{zIndex: 9999, minWidth: 250}}>
    <div className="d-flex">
      <div className="toast-body">{message}</div>
      <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={onClose}></button>
    </div>
  </div>
);

const getRowStyle = (isSelected, idx) => {
  if (isSelected) {
    return { backgroundColor: "gold" };
  }
  return { backgroundColor: idx % 2 === 0 ? "#ffe0f0" : "#fff9c4" };
};

const PAGE_SIZE = 5;

const DynamicTable = ({ columns = [], data = [], formSchema = [], onRowSelect, onFormSubmit, actions = [], multiSelect = false }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]); 
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("edit");
  const [formKey, setFormKey] = useState(0);  
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filtered and paginated data
  const filteredData = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter(row =>
      columns.some(col =>
        String(row[col.key] ?? "").toLowerCase().includes(lower)
      )
    );
  }, [search, data, columns]);

  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page]);

  // Selection logic
  const handleSelectRow = (idx) => {
    if (multiSelect) {
      setSelectedRows(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    } else {
      setSelectedRow(idx);
    }
  };

  const handleRowClick = (row, idx, e) => {
    if (e && (e.target.closest("button") || e.target.closest("a") || e.target.type === "radio" || e.target.type === "checkbox")) return;
    if (!multiSelect) {
      setSelectedRow(idx);
    }
    setFormData(row);
    setShowForm(true);
    setFormMode("edit");
    setFormKey(prev => prev + 1);
    if (onRowSelect) onRowSelect(row, idx);
  };

  const handleAddNew = () => {
    setSelectedRow(null);
    setFormData({});
    setShowForm(true);
    setFormMode("add");
    setFormKey(prev => prev + 1);
  };

  const handleEdit = () => {
    if (multiSelect) return;
    if (selectedRow == null) return;
    setFormData(data[selectedRow]);
    setShowForm(true);
    setFormMode("edit");
    setFormKey(prev => prev + 1);
  };

  const handleView = () => {
    if (multiSelect) return;
    if (selectedRow == null) return;
    setFormData(data[selectedRow]);
    setShowForm(true);
    setFormMode("view");
    setFormKey(prev => prev + 1);
  };

  const handleDeleteTop = () => {
    if (actions.length === 0) return;
    const deleteAction = actions[0];
    try {
      if (multiSelect) {
        selectedRows.forEach(idx => deleteAction.onClick(data[idx], idx));
      } else if (selectedRow != null) {
        deleteAction.onClick(data[selectedRow], selectedRow);
      }
      setToast({ message: "Deleted successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Delete failed!", type: "danger" });
    }
    setSelectedRow(null);
    setSelectedRows([]);
  };

  const handleFormSubmit = async (data, mode, idx) => {
    let shouldClose = true;
    try {
      if (onFormSubmit) {
        const result = await onFormSubmit(data, formMode, multiSelect ? selectedRows : selectedRow);
        if (result === false) shouldClose = false;
      }
      setToast({ message: mode === "add" ? "Added successfully!" : "Updated successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Operation failed!", type: "danger" });
      shouldClose = false;
    }
    if (shouldClose) {
      setShowForm(false);
      setFormData({});
      setSelectedRow(null);
      setSelectedRows([]);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setFormData({});
    setSelectedRow(null);
    setSelectedRows([]);
  };

  const renderSelectCell = (idx) => {
    if (multiSelect) {
      return (
        <td>
          <input
            type="checkbox"
            checked={selectedRows.includes(idx)}
            onChange={() => handleSelectRow(idx)}
            aria-label="Select row"
            className="form-check-input"
          />
        </td>
      );
    } else {
      return (
        <td>
          <input
            type="radio"
            checked={selectedRow === idx}
            onChange={() => handleSelectRow(idx)}
            name="rowSelect"
            aria-label="Select row"
            className="form-check-input"
          />
        </td>
      );
    }
  };

  // Pagination controls
  const renderPagination = () => (
    <nav aria-label="Table pagination">
      <ul className="pagination justify-content-end mt-3 mb-0">
        <li className={`page-item${page === 1 ? " disabled" : ""}`}>
          <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>&laquo;</button>
        </li>
        {Array.from({ length: pageCount }, (_, i) => (
          <li key={i} className={`page-item${page === i + 1 ? " active" : ""}`}>
            <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
          </li>
        ))}
        <li className={`page-item${page === pageCount ? " disabled" : ""}`}>
          <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === pageCount}>&raquo;</button>
        </li>
      </ul>
    </nav>
  );

  // Reset page on search or data change
  React.useEffect(() => {
    setPage(1);
  }, [search, data.length]);

  return (
    <div className="border-1 border-black card shadow-sm pt-2 pb-2">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="d-flex justify-content-between align-items-center mb-2 gap-2 ms-2 me-2">
      <div>
        <input
          type="text"
          className="form-control w-auto"
          style={{ maxWidth: 300 }}
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search table"
        />
      </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={handleAddNew} aria-label="Add new entry"><IoMdAdd /></button>
          <button className="btn btn-warning" onClick={handleEdit} disabled={multiSelect ? selectedRows.length !== 1 : selectedRow == null} aria-label="Edit selected"><MdEdit /></button>
          <button className="btn btn-info" onClick={handleView} disabled={multiSelect ? selectedRows.length !== 1 : selectedRow == null} aria-label="View selected"><GrFormView /></button>
          <button className="btn btn-danger" onClick={handleDeleteTop} disabled={multiSelect ? selectedRows.length === 0 : selectedRow == null} aria-label="Delete selected"><MdDelete /></button>
        </div>
      </div>
      <div className="table-responsive" style={{overflowX: 'auto', width: '100%'}}>
        <table className="table table-hover table-striped align-middle" aria-labelledby="tableTitle" style={{minWidth: 700}}>
          <thead className="table-light">
            <tr>
              <th scope="col">Select</th>
              {columns.map((col, idx) => (
                <th key={idx} scope="col">{col.label}</th>
              ))}
              {actions.length > 0 && <th scope="col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr><td colSpan={columns.length + (actions.length > 0 ? 2 : 1)} className="text-center">No data</td></tr>
            ) : (
              paginatedData.map((row, idx) => {
                // idx here is the index in paginatedData, so get the real index in filteredData
                const realIdx = (page - 1) * PAGE_SIZE + idx;
                const isSelected = selectedRow === realIdx || (multiSelect && selectedRows.includes(realIdx));
                return (
                  <tr
                    key={realIdx}
                    className={isSelected ? "table-active" : ""}
                    style={getRowStyle(isSelected, realIdx)}
                    tabIndex={0}
                    aria-selected={isSelected}
                  >
                    {renderSelectCell(realIdx)}
                    {columns.map((col, cidx) => (
                      <td key={cidx}>{row[col.key]}</td>
                    ))}
                    {actions.length > 0 && (
                      <td>
                        {actions.map((action, aidx) => (
                          <button
                            key={aidx}
                            className={`btn btn-sm me-1 ${action.className || "btn-outline-secondary"}`}
                            onClick={e => { e.stopPropagation(); action.onClick(row, realIdx); }}
                            aria-label={action.label}
                            tabIndex={0}
                          >
                            {action.label}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
       <div className="d-flex justify-content-between align-items-center mb-2 gap-2 ms-2 me-2">
        <div className=" fs-6 fw-bold text-center w-auto me-2 ms-2 align-items-center d-flex">
        Total records: {data?.length}
        </div>
        {renderPagination()}
      </div>
      {showForm && (
        <div className="card p-3 mt-3 shadow-sm">
          <h6>{formMode === "add" ? "Add New" : formMode === "edit" ? "Edit" : "View"} Entry</h6>
          <DynamicForm
            key={formKey}
            schema={formSchema}
            mode={formMode}
            isEditing={formMode === "edit"}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}
    </div>
  );
};

export default DynamicTable; 