import React from "react";
import { ProgressBar } from "react-bootstrap";
import { FaSadCry, FaFire, FaPen } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Heading from "../../components/navigation/Heading";
import { IoTimeOutline } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { SplitButton } from "primereact/splitbutton";
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
    <div className="card shadow-sm border-0 mt-3 rounded-4">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4 text-start">📊 Macro Analysis</h5>
        <div className="table-responsive">
          <table className="table table-striped align-middle text-center mb-0">
            <thead className="table-light">
              <tr>
                <th>Nutrient</th>
                <th>Target</th>
                <th>Consumed</th>
                <th>Remaining</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(macros).map(([key, val]) => {
                const remaining = calcRemaining(val.target, val.consumed);
                const percent = Math.min(
                  (val.consumed / val.target) * 100,
                  100
                );

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
                        animated
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


const client = {...location.state?.client};

  if (!client)
    return (
      <p className="text-muted mt-4 text-center">
        Select a client to view details.
      </p>
    );

  return (
    <div className="container">
       <Heading pageName={`${client.fullName}'s information`} sticky={true} />
      <div
        className="d-flex flex-column"
        style={{
          height: "calc(100vh - 160px)",
          // overflow: 'hidden'
        }}
      >
        {/* Client Info Card */}
        <div className="lex-grow-1 overflow-auto p-3 rounded shadow-sm">
          <div className="card shadow-sm rounded-4 mb-3 mt-3 border-0">
            <div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <div>
                <h4 className="fw-bold">{client.fullName}</h4>
                <p className="mb-1 text-muted small">
                  Goal: <span className="fw-semibold">{client.goal}</span> •
                  Start: {client.startDate}
                </p>
                <span
                  className={`badge px-3 py-2 ${
                    client.status === "attention" ? "bg-danger" : "bg-success"
                  }`}
                >
                  {client.status === "attention"
                    ? "Need Attention"
                    : "On Track"}
                </span>
              </div>

              <div className="text-md-end mt-3 mt-md-0">
                <div className="d-flex align-items-center justify-content-md-end mb-3">
                  <span
                    className={`fw-bold ${
                      client.streak === "Missed meal"
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {client.streak}
                  </span>
                  {client.streak === "Missed meal" ? (
                    <FaSadCry className="text-danger ms-2" />
                  ) : (
                    <FaFire className="text-success ms-2" />
                  )}
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-md-end">
       <button
  className="bg-white btn-sm p-2 d-flex align-items-center border-0 rounded-3 shadow-sm"
  onClick={() =>
    navigate(`/messages/${client.clientId}`, {
      state: { client },
    })
  }
>
  <FaMessage className="me-1" /> Message
</button>

                
        <SplitButton 
  label="Plan" 
  icon="pi pi-plus" 
  className="bg-button btn-sm border-0 rounded-3 shadow-sm"
  style={{ 
    color: "white"
  }} 
  model={[
    {
      label: "Add",
      icon: "pi pi-pencil",
      command: () =>
        navigate(`/adjust-plan/${client.clientId}`, {
          state: { client, isView: false },
        }),
    },
    {
      label: "Preview",
      icon: "pi pi-eye",
      command: () =>
        navigate(`/adjust-plan/${client.clientId}`, {
          state: { client, isView: true },
        }),
    },
  ]}
/>

                </div>
              </div>
            </div>
          </div>

          {/* Meal Plan Section */}
          <div className="card shadow-sm rounded-4 mb-3 border-0">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 text-start">🍽 Today's Meal Status</h5>
              <div className="row g-3">
                {client.meals?.map((meal, idx) => (
                  <div key={idx} className="col-12 col-sm-6 col-lg-4">
                    <div
                      className={`card h-100 rounded-3 shadow-sm text-start ${
                        meal.done
                          ? "bg-light-green br-light-green text-white"
                          : "bg-light-gray br-light-gray text-white"
                      }`}
                    >
                      {meal.done ? (
                        <IoCheckmarkCircleOutline
                          className="position-absolute top-0 end-0 m-2"
                          color="green"
                        />
                      ) : (
                        <IoTimeOutline
                          className="position-absolute top-0 end-0 m-2"
                          color="gray"
                        />
                      )}
                      <div className="card-body p-3">
                        <h6 className="fw-bold mb-2">{meal.name}</h6>
                        <small className="text-muted">
                          {meal.uploadTime
                            ? new Date(meal.uploadTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Pending"}
                        </small>
                        {/* <p className="mt-2 small">{meal.details}</p> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Macro Analysis Section */}
          <MacroAnalysis macros={client.macros} />
        </div>
      </div>
    </div>
  );
}
