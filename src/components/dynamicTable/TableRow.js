import React, { useState } from "react";

const TableRow = React.memo(
  ({ row, columns, actions, isSelected, onRowClick, renderSelectCell, rowIdx }) => {
    const [modalData, setModalData] = useState(null);

    const openModal = (type, value) => {
      setModalData({ type, value });
    };

    const closeModal = () => {
      setModalData(null);
    };

    const renderValueByType = (type, value) => {
      if (!value) return "";

      // Compact table cell: Show "View" button for large content
      if (["image", "video", "file", "json"].includes(type)) {
        return (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={(e) => {
              e.stopPropagation();
              openModal(type, value);
            }}
          >
            View
          </button>
        );
      }

      switch (type) {
        case "date":
          return new Date(value).toLocaleDateString();

        case "number":
          return Number(value).toLocaleString();

        case "badge":
          if (Array.isArray(value)) {
            return value.map((v, i) => (
              <span key={i} className="badge bg-primary me-1">
                {v}
              </span>
            ));
          }
          return <span className="badge bg-primary">{value}</span>;

        default:
          if (Array.isArray(value)) return value.join(", ");
          if (typeof value === "object") return JSON.stringify(value);
          return value;
      }
    };

    const renderModalContent = () => {
      if (!modalData) return null;
      const { type, value } = modalData;

      switch (type) {
        case "image":
          return <img src={value} alt="" style={{ maxWidth: "100%" }} />;
        case "video":
          return (
            <video width="100%" height="auto" controls>
              <source src={value} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        case "file":
          if (Array.isArray(value)) {
            return value.map((url, i) => (
              <div key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  File {i + 1}
                </a>
              </div>
            ));
          }
          return (
            <a href={value} target="_blank" rel="noopener noreferrer">
              Download File
            </a>
          );
        case "json":
          return (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "#f8f9fa",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              {JSON.stringify(value, null, 2)}
            </pre>
          );
        default:
          return null;
      }
    };

    return (
      <>
        <tr
          className={isSelected ? "table-active" : ""}
          style={isSelected ? { backgroundColor: "gold" } : {}}
          tabIndex={0}
          aria-selected={isSelected}
          onClick={(e) => onRowClick(row, rowIdx, e)}
        >
          {renderSelectCell(rowIdx)}
          {columns.map((col, cidx) => (
            <td key={cidx}>{renderValueByType(col.type, row[col.key])}</td>
          ))}
          {actions && actions.length > 0 && (
            <td>
              {actions.map((action, aidx) => (
                <button
                  key={aidx}
                  className={`btn btn-sm me-1 ${
                    action.className || "btn-outline-secondary"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(row, rowIdx);
                  }}
                  aria-label={action.label}
                  tabIndex={0}
                >
                  {action.label}
                </button>
              ))}
            </td>
          )}
        </tr>

        {/* Modal */}
        {modalData && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">View {modalData.type}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">{renderModalContent()}</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

export default TableRow;
