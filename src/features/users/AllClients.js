import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { decryptToken } from "../../utils/crypto";
import { GetClientsForTrainer } from "../../api/authAPI";
import Loader from "../../components/display/Loader";

// ✅ Decrypt user function
const getDecryptedUser = () => {
  const encryptedUserData = sessionStorage.getItem("user");
  if (!encryptedUserData) return null;
  try {
    const parsed = JSON.parse(encryptedUserData);
    const decrypted = decryptToken(parsed);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch (error) {
    console.error("Error decrypting user data:", error);
    return null;
  }
};

export default function AllClients() {
  const decryptedUser = getDecryptedUser();
  const user = decryptedUser || {};
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
    return <Loader fullScreen={true} text="Loading clients..." color="#007bff" />;
  }

  return (
    <div
      className="container-fluid py-4 px-3"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg, #e8f0ff 0%, #f5f7ff 25%, #ffffff 50%, #fef5ff 75%, #fff0f5 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient Background Effects */}
      <div
        style={{
          position: "fixed",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle at 30% 20%, rgba(0,122,255,0.08) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(255,45,85,0.06) 0%, transparent 40%), radial-gradient(circle at 50% 80%, rgba(88,86,214,0.05) 0%, transparent 40%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Unified Liquid Glass Container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          border: "1px solid rgba(255,255,255,0.4)",
          borderRadius: "32px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <div
          className="p-4"
          style={{
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
            <div>
              <h5
                className="fw-bold mb-1"
                style={{
                  fontSize: "1.5rem",
                  color: "#1d1d1f",
                  letterSpacing: "-0.02em",
                }}
              >
                👋 Welcome, {user.fullName}
              </h5>
              <small
                className="text-muted d-block"
                style={{ fontSize: "0.9rem", color: "#86868b" }}
              >
                Total Clients: <span className="fw-semibold">{clients.length}</span>
              </small>
            </div>

            <button
              className="btn px-4 py-2 fw-semibold"
              style={{
                background: "linear-gradient(135deg, #007aff 0%, #5ac8fa 100%)",
                border: "none",
                borderRadius: "20px",
                color: "white",
                fontSize: "0.95rem",
                boxShadow:
                  "0 4px 16px rgba(0,122,255,0.3), 0 2px 4px rgba(0,122,255,0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 6px 20px rgba(0,122,255,0.4), 0 3px 6px rgba(0,122,255,0.25)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 4px 16px rgba(0,122,255,0.3), 0 2px 4px rgba(0,122,255,0.2)";
              }}
              onClick={handleAddClient}
            >
              + Add Client
            </button>
          </div>

          {/* Stats Pills */}
          <div className="d-flex gap-2 flex-wrap">
            <div
              className="px-3 py-2"
              style={{
                background: "rgba(52,199,89,0.12)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                border: "1px solid rgba(52,199,89,0.2)",
              }}
            >
              <span className="fw-bold" style={{ fontSize: "1rem", color: "#34c759" }}>
                {clients.filter((c) => c.status === "on-track").length}
              </span>
              <span style={{ fontSize: "0.85rem", color: "#34c759", marginLeft: "6px" }}>
                On Track
              </span>
            </div>
            <div
              className="px-3 py-2"
              style={{
                background: "rgba(255,149,0,0.12)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                border: "1px solid rgba(255,149,0,0.2)",
              }}
            >
              <span className="fw-bold" style={{ fontSize: "1rem", color: "#ff9500" }}>
                {clients.filter((c) => c.status === "attention").length}
              </span>
              <span style={{ fontSize: "0.85rem", color: "#ff9500", marginLeft: "6px" }}>
                Need Attention
              </span>
            </div>
          </div>
        </div>

        {/* Clients Grid - Desktop */}
        <div className="row g-3 p-4 d-none d-md-flex">
          {currentClients.map((client, index) => (
            <div
              key={client.clientId}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              style={{
                animation: `fadeInUp 0.4s ease ${index * 0.04}s both`,
              }}
            >
              <div
                onClick={() => handleClientClick(client)}
                className="card border-0 h-100"
                style={{
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  borderRadius: "20px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                  overflow: "hidden",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.5)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, #007aff, #5ac8fa, #af52de)",
                    opacity: 0.5,
                  }}
                />

                <div className="card-body p-3">
                  <h5
                    className="card-title fw-bold mb-3"
                    style={{
                      fontSize: "1.1rem",
                      color: "#1d1d1f",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {client.fullName}
                  </h5>
                  <div className="d-flex flex-column gap-2">
                    <p className="mb-0 d-flex align-items-start" style={{ fontSize: "0.85rem" }}>
                      <span
                        style={{
                          color: "#86868b",
                          minWidth: "55px",
                          fontSize: "0.8rem",
                        }}
                      >
                        Email
                      </span>
                      <span
                        className="fw-medium"
                        style={{
                          color: "#1d1d1f",
                          wordBreak: "break-all",
                          flex: 1,
                        }}
                      >
                        {client.email}
                      </span>
                    </p>
                    <p className="mb-0 d-flex align-items-center" style={{ fontSize: "0.85rem" }}>
                      <span
                        style={{
                          color: "#86868b",
                          minWidth: "55px",
                          fontSize: "0.8rem",
                        }}
                      >
                        Gender
                      </span>
                      <span className="fw-medium" style={{ color: "#1d1d1f" }}>
                        {client.gender}
                      </span>
                    </p>
                    <p className="mb-0 d-flex align-items-center" style={{ fontSize: "0.85rem" }}>
                      <span
                        style={{
                          color: "#86868b",
                          minWidth: "55px",
                          fontSize: "0.8rem",
                        }}
                      >
                        Phone
                      </span>
                      <span className="fw-medium" style={{ color: "#1d1d1f" }}>
                        {client.phoneNumber}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clients List - Mobile */}
        <div className="d-md-none p-3">
          {currentClients.map((client, index) => (
            <button
              key={client.clientId}
              className="w-100 border-0 mb-2 text-start"
              style={{
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.6)",
                borderRadius: "16px",
                padding: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                animation: `fadeInUp 0.4s ease ${index * 0.04}s both`,
                transition: "all 0.3s ease",
              }}
              onClick={() => handleClientClick(client)}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6
                  className="fw-bold mb-0"
                  style={{
                    fontSize: "1.05rem",
                    color: "#1d1d1f",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {client.fullName}
                </h6>
                {client.streak && (
                  <span
                    className="badge"
                    style={{
                      background: "rgba(0,122,255,0.15)",
                      color: "#007aff",
                      padding: "0.3rem 0.7rem",
                      borderRadius: "10px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {client.streak}
                  </span>
                )}
              </div>
              <div className="d-flex flex-column gap-1">
                <p className="mb-0" style={{ fontSize: "0.8rem", color: "#86868b" }}>
                  {client.email}
                </p>
                <div className="d-flex gap-3 mt-1">
                  <small style={{ fontSize: "0.75rem", color: "#86868b" }}>
                    {client.gender}
                  </small>
                  <small style={{ fontSize: "0.75rem", color: "#86868b" }}>
                    {client.phoneNumber}
                  </small>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Pagination Footer */}
        <div
          className="d-flex justify-content-between align-items-center p-4"
          style={{
            borderTop: "1px solid rgba(0,0,0,0.06)",
            background: "linear-gradient(0deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
          }}
        >
          <button
            className="btn btn-sm fw-semibold"
            style={{
              background: currentPage === 1 ? "rgba(0,0,0,0.04)" : "rgba(0,122,255,0.12)",
              color: currentPage === 1 ? "#86868b" : "#007aff",
              border: "1px solid",
              borderColor: currentPage === 1 ? "rgba(0,0,0,0.06)" : "rgba(0,122,255,0.2)",
              borderRadius: "14px",
              padding: "0.5rem 1.25rem",
              transition: "all 0.3s ease",
            }}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <span
            className="fw-semibold"
            style={{
              fontSize: "0.9rem",
              color: "#1d1d1f",
              padding: "0.5rem 1rem",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
          >
            {currentPage} / {totalPages}
          </span>
          <button
            className="btn btn-sm fw-semibold"
            style={{
              background:
                currentPage === totalPages ? "rgba(0,0,0,0.04)" : "rgba(0,122,255,0.12)",
              color: currentPage === totalPages ? "#86868b" : "#007aff",
              border: "1px solid",
              borderColor:
                currentPage === totalPages ? "rgba(0,0,0,0.06)" : "rgba(0,122,255,0.2)",
              borderRadius: "14px",
              padding: "0.5rem 1.25rem",
              transition: "all 0.3s ease",
            }}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}