import React from "react";

const TablePagination = React.memo(({ page, setPage, pageCount }) => (
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
));

export default TablePagination; 