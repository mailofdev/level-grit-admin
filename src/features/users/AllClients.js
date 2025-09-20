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
  const [loading, setLoading] = useState(true); // ✅ loading state

  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchClients = async () => {
      try {
        setLoading(true); // show loader
        const data = await GetClientsForTrainer();
        console.log("📌 Clients from API:", data);
        setClients(data);
      } catch (error) {
        console.error("❌ Error fetching clients:", error);
      } finally {
        setLoading(false); // hide loader
      }
    };

    fetchClients();
  }, []);

  // 🔹 Pagination logic
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

  // ✅ Loader UI
  if (loading) {
    return (
     <>
     <Loader fullScreen={true} text="Loading clients..." color="#007bff" />
     </>
    );
  }

  return (
    <div className="container-fluid p-3" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Sticky Header */}
      <div className="shadow-sm p-3 bg-white rounded-3 mb-3 sticky-top" style={{ top: "0", zIndex: 1000 }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
          <div>
            <strong className="fs-5">Welcome, {user.fullName}</strong>
            <div className="text-muted small">Clients: {clients.length}</div>
          </div>
          <div className="small mb-2 mb-md-0">
            <span className="text-success">{clients.filter(c => c.status === "on-track").length} on track</span>,{" "}
            <span className="text-warning">{clients.filter(c => c.status === "attention").length} need attention</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAddClient}>
            Add Client
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="row g-3 d-none d-md-flex">
        {currentClients.map(client => (
          <div key={client.clientId} className="col-12 col-sm-6 col-md-4">
            <div
              className={`card h-100 shadow-sm rounded-3 ${
                client.status === "on-track"
                ? "bg-light-green br-light-green text-white"
                : "bg-light-orange br-light-orange text-white"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => handleClientClick(client)}
            >
              <div className="card-body">
                <h5 className="card-title mb-2">{client.fullName}</h5>
                <p className="mb-1 small"><strong>Email:</strong> {client.email}</p>
                <p className="mb-1 small"><strong>Gender:</strong> {client.gender}</p>
                <p className="mb-1 small"><strong>Phone Number:</strong> {client.phoneNumber}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List Layout for Mobile */}
      <div className="d-md-none mt-3">
        <div className="list-group">
          {currentClients.map(client => (
            <button
              key={client.id}
              className={`list-group-item list-group-item-action ${
                  client.status === "on-track"
                ? "bg-light-green br-light-green text-white"
                : "bg-light-orange br-light-orange text-white"
              }`}
              onClick={() => handleClientClick(client)}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="mb-0">{client.fullName}</h6>
                <small>{client.streak}</small>
              </div>
                <p className="mb-1 small"><strong>Email:</strong> {client.email}</p>
                <p className="mb-1 small"><strong>Gender:</strong> {client.gender}</p>
                <p className="mb-1 small"><strong>Phone Number:</strong> {client.phoneNumber}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          &laquo; Prev
        </button>
        <span className="small text-muted">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
}
