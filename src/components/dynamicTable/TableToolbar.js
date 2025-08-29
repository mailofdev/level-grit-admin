import React from "react";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

const TableToolbar = React.memo(({ search, setSearch, handleAddNew, handleEdit, handleView, handleDeleteTop, multiSelect, selectedRow, selectedRows }) => (
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
));

export default TableToolbar; 