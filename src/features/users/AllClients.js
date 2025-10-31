import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GetClientsForTrainer } from "../../api/authAPI";
import Loader from "../../components/display/Loader";
import { getDecryptedUser } from "../../components/common/CommonFunctions";

export default function AllClients() {
  const user = getDecryptedUser();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 12;
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await GetClientsForTrainer();
        setClients(data);
      } catch (error) {
        console.error("❌ Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const indexOfLast = currentPage * clientsPerPage;
  const indexOfFirst = indexOfLast - clientsPerPage;
  const currentClients = clients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(clients.length / clientsPerPage);

  const handleClientClick = (client) => {
    navigate(`/client-details/${client.clientId}`, { state: { client } });
  };

  const handleAddClient = () => {
    navigate("/register-client");
  };

  if (loading) {
    return (
      <Loader
        fullScreen={true}
        text="Loading clients..."
        color="var(--color-primary)"
      />
    );
  }

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4 pb-4 theme-transition">
      {/* Main Card Container */}
      <div className="card border-0 shadow-lg theme-transition rounded-4 overflow-hidden">
        {/* Header Section */}
        <div className="card-header border-bottom bg-light-subtle py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold mb-1 fs-4 text-primary-emphasis">
                👋 Welcome, {user.fullName}
              </h5>
              <small className="text-muted d-block">
                Total Clients:{" "}
                <span className="fw-semibold text-dark">
                  {clients.length}
                </span>
              </small>
            </div>

            <button
              className="btn btn-primary px-4 py-2 fw-semibold rounded-pill hover-scale shadow-sm"
              onClick={handleAddClient}
            >
              + Add Client
            </button>
          </div>

          {/* Stats Pills */}
          <div className="d-flex gap-2 flex-wrap mt-3">
            <div className="px-3 py-2 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3">
              <span className="fw-bold text-success">
                {clients.filter((c) => c.status === "on-track").length}
              </span>
              <span className="small text-success ms-2">On Track</span>
            </div>
            <div className="px-3 py-2 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-3">
              <span className="fw-bold text-warning">
                {clients.filter((c) => c.status === "attention").length}
              </span>
              <span className="small text-warning ms-2">Need Attention</span>
            </div>
          </div>
        </div>

        {/* Clients Grid - Desktop */}
        <div className="card-body d-none d-md-block">
          <div className="row g-3">
            {currentClients.map((client) => (
              <div
                key={client.clientId}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <div
                  onClick={() => handleClientClick(client)}
                  className="card border-0 h-100 hover-shadow theme-transition cursor-pointer position-relative rounded-4"
                >
                  <div
                    className="position-absolute top-0 start-0 end-0"
                    style={{
                      height: "3px",
                      background:
                        "linear-gradient(90deg, var(--color-primary), var(--color-info), var(--color-secondary))",
                      opacity: 0.6,
                    }}
                  />
                  <div className="card-body p-3">
                    <h5 className="card-title fw-bold mb-3 fs-5">
                      {client.fullName}
                    </h5>
                    <div className="d-flex flex-column gap-2 small">
                      <p className="mb-0 d-flex align-items-start">
                        <span
                          className="text-muted me-2"
                          style={{ minWidth: "55px" }}
                        >
                          Email
                        </span>
                        <span className="fw-medium text-break flex-grow-1">
                          {client.email}
                        </span>
                      </p>
                      <p className="mb-0 d-flex align-items-center">
                        <span
                          className="text-muted me-2"
                          style={{ minWidth: "55px" }}
                        >
                          Gender
                        </span>
                        <span className="fw-medium">{client.gender}</span>
                      </p>
                      <p className="mb-0 d-flex align-items-center">
                        <span
                          className="text-muted me-2"
                          style={{ minWidth: "55px" }}
                        >
                          Phone
                        </span>
                        <span className="fw-medium">{client.phoneNumber}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clients List - Mobile */}
        <div className="card-body d-md-none">
          {currentClients.map((client) => (
            <button
              key={client.clientId}
              className="w-100 border-0 mb-2 text-start card hover-shadow theme-transition rounded-4"
              onClick={() => handleClientClick(client)}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0 fs-6 text-primary-emphasis">
                    {client.fullName}
                  </h6>
                  {client.streak && (
                    <span className="badge bg-primary bg-opacity-15 text-primary px-3 py-2 rounded-pill small">
                      {client.streak}
                    </span>
                  )}
                </div>
                <div className="d-flex flex-column gap-1">
                  <p className="mb-0 small text-muted">{client.email}</p>
                  <div className="d-flex gap-3 mt-1">
                    <small className="small text-muted">{client.gender}</small>
                    <small className="small text-muted">
                      {client.phoneNumber}
                    </small>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="card-footer border-0 bg-body-tertiary py-3 sticky-bottom">
          <div
            className="d-flex justify-content-center align-items-center gap-3 flex-nowrap text-nowrap px-2"
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            <button
              className={`btn fw-semibold rounded-pill px-3 px-sm-4 py-2 transition-all ${
                currentPage === 1
                  ? "btn-outline-secondary disabled opacity-75"
                  : "btn-primary shadow-sm"
              }`}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ← 
            </button>

            <span className="fw-semibold small px-4 py-2 bg-white border rounded-pill shadow-sm text-secondary">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className={`btn fw-semibold rounded-pill px-3 px-sm-4 py-2 transition-all ${
                currentPage === totalPages
                  ? "btn-outline-secondary disabled opacity-75"
                  : "btn-primary shadow-sm"
              }`}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
               →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
