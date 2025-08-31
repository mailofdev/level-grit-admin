// src/features/users/ClientDetails.js
import React from "react";
import { ProgressBar } from "react-bootstrap";
import { FaSadCry } from "react-icons/fa";
import { FaFire, FaMessage, FaPen, FaRegFaceSadTear } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function MacroAnalysis({ macros }) {
  if (!macros) return null;

  const calcRemaining = (target, consumed) => target - consumed;

  const colors = {
    calories: "success",
    protein: "primary",
    carbs: "warning",
    fat: "info",
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 mt-4">
      <div className="card-body">
        <h5 className="fw-bold mb-3 text-secondary">Macro Analysis</h5>
        <table className="table table-striped align-middle text-center mb-0">
          <thead className="table-light">
            <tr>
              <th>Nutrient</th>
              <th>Target</th>
              <th>Consumed</th>
              <th>Remaining</th>
              <th style={{ width: "30%" }}>Progress</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(macros).map(([key, val]) => {
              const remaining = calcRemaining(val.target, val.consumed);
              const percent = Math.min((val.consumed / val.target) * 100, 100);

              return (
                <tr key={key}>
                  <td className="text-capitalize fw-semibold">{key}</td>
                  <td>{val.target}</td>
                  <td>{val.consumed}</td>
                  <td className={remaining < 0 ? "text-danger" : ""}>
                    {remaining}
                  </td>
                  <td>
                    <ProgressBar
                      now={percent}
                      variant={colors[key] || "secondary"}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ClientDetails({ client }) {
   const navigate = useNavigate();
  if (!client)
    return <p className="text-muted">Select a client to view details</p>;

  return (
    <div className="container-fluid px-0">
      {/* User Info Card */}
      <div className="card shadow-sm">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div>
            <h4 className="fw-bold text-dark">{client.name}</h4>
            <p className="mb-1 text-muted small">
              Goal: <span className="fw-semibold">{client.goal || "N/A"}</span>{" "}
              • Start: {client.startDate || "N/A"}
            </p>
            <span
              className={`badge px-3 py-2 ${
                client.status === "attention" ? "bg-danger" : "bg-success"
              }`}
            >
              {client.status === "attention" ? "Need Attention" : "On Track"}
            </span>
          </div>
          <div>
            <span
              className={`fw-bold ${
                client.streak === "Missed meal" ? "text-danger" : "text-success"
              }`}
            >
              {client.streak}
            </span>
            {client.streak === "Missed meal" ? (
              <FaRegFaceSadTear className="text-danger ms-1" />
            ) : (
              <FaFire className="text-danger ms-1" />
            )}
          </div>
 <div className="d-flex align-items-center justify-content-between">
      <div>
        <button
          className="btn btn-outline-warning br-8 btn-sm p-2 me-2"
          onClick={() => navigate("/messages")}
        >
          <FaMessage className="me-1" /> Message
        </button>

        <button
          className="btn btn-success br-8 btn-sm p-2"
          onClick={() => navigate("/adjust-plan")}
        >
          <FaPen className="me-1" /> Adjust Plan
        </button>
      </div>
    </div>
        </div>
      </div>

      {/* Meal Plan Card */}
      <div className="card shadow-sm my-3">
        <div className="card-body">
          <h5 className="fw-bold text-secondary mb-3">Today's Meal Plan</h5>
          <div className="row g-3">
            {client.meals?.map((meal, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-4">
                <div
                  className={`card h-100 shadow-sm border-1 rounded-3 
                  ${meal.uploadTime ? "border-success" : "border-danger"}`}
                >
                  <div className="card-body m-2 text-center p-3">
                    <h6 className="fw-bold text-dark">{meal.name}</h6>
                    <p className="small text-muted mb-1">
                      {meal.uploadTime
                        ? new Date(meal.uploadTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Pending"}
                    </p>
                    <p className="small text-secondary">{meal.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Macro Analysis Card */}
      <div className="card shadow-sm">
      <MacroAnalysis macros={client.macros} />
      </div>
    </div>
  );
}
