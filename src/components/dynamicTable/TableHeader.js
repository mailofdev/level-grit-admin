import React from "react";

const TableHeader = React.memo(({ columns, actions, multiSelect }) => (
  <thead className="table-light">
    <tr>
      <th scope="col">Select</th>
      {columns.map((col, idx) => (
        <th key={idx} scope="col">{col.label}</th>
      ))}
      {actions && actions.length > 0 && <th scope="col">Actions</th>}
    </tr>
  </thead>
));

export default TableHeader; 