import React from "react";
import { ProgressBar } from "react-bootstrap";
import { FaSadCry, FaFire, FaAccessibleIcon, FaPen } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Heading from "../../components/navigation/Heading";
import logo from "../../assets/images/ss5.png";
import { FaMessage } from "react-icons/fa6";
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
    <div className="card shadow-sm border-0 mt-2">
      <div className="card-body rounded-4 shadow-sm">
        <h5 className="fw-bold mb-3 text-secondary">Macro Analysis</h5>
        <div className="table-responsive">
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
    </div>
  );
}

export default function ClientDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const client = location.state?.client;

  if (!client)
    return <p className="text-muted mt-4">Select a client from the list to view details.</p>;

  return (
    <div className="container-fluid px-2 px-md-4 mt-2">
      <Heading pageName="View Client" sticky={true} />
   {/* <img
            src={logo}
            alt="Level Grit Logo"
            style={{ height: "550px", width: "850px" }}
          /> */}
      {/* Client Info */}
      <div className="card shadow-sm rounded-4 p-3 p-md-4 mb-3 mt-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div className="mb-3 mb-md-0">
          <h4 className="fw-bold text-dark">{client.fullName}</h4>
          <p className="mb-1 text-muted small">
            Goal: <span className="fw-semibold">{client.goal || "N/A"}</span> • Start: {client.startDate || "N/A"}
          </p>
          <span
            className={`badge px-3 py-2 ${
              client.status === "attention" ? "bg-danger" : "bg-success"
            }`}
          >
            {client.status === "attention" ? "Need Attention" : "On Track"}
          </span>
        </div>

        <div className="text-md-end">
          <div className="d-flex align-items-center justify-content-md-end mb-2">
            <span className={`fw-bold ${client.streak === "Missed meal" ? "text-danger" : "text-success"}`}>
              {client.streak}
            </span>
            {client.streak === "Missed meal" ? (
              <FaSadCry className="text-danger ms-1" />
            ) : (
              <FaFire className="text-danger ms-1" />
            )}
          </div>
          <div className="d-flex flex-wrap gap-2 justify-content-md-end">
            <button
              className="bg-white btn-sm p-2 d-flex align-items-center border-0 rounded-3 shadow-sm"
              onClick={() => navigate("/messages")}
            >
              <FaMessage className="me-1" /> Message
            </button>

            <button
              className="bg-button btn-sm p-2 d-flex align-items-center border-0 rounded-3 shadow-sm"
              onClick={() => navigate("/adjust-plan")}
              style={{color: 'white' }}
            >
              <FaPen className="me-1" /> Adjust Plan
            </button>
          </div>
        </div>
      </div>

      {/* Meal Plan */}
      <div className="card shadow-sm my-3">
        <div className="card-body">
          <h5 className="fw-bold text-secondary mb-3">Today's Meal status</h5>
          <div className="row g-3">
            {client.meals?.map((meal, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-4">
                <div
                  className={`card h-100 shadow-sm rounded-3 border-1 ${
                    meal.done === true
                      ? "bg-light-green br-light-green text-white"
                      : "bg-light-orange br-light-orange text-white"
                  }`}
                >
                  <div className="card-body text-center p-3">
                    <h6 className="fw-bold text-dark">{meal.name}</h6>
                    <p className="small text-muted mb-1">
                      {meal.uploadTime
                        ? new Date(meal.uploadTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Macro Analysis */}
      <MacroAnalysis macros={client.macros} />
    </div>
  );
}
