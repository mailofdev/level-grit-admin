// src/features/users/ClientList.js
import React, { useState } from "react";
import { FaCircle, FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function ClientList({ clients, selectedClient, onSelect }) {
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 7;

  // Pagination logic
  const indexOfLast = currentPage * clientsPerPage;
  const indexOfFirst = indexOfLast - clientsPerPage;
  const currentClients = clients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(clients.length / clientsPerPage);


  const navigate = useNavigate();

  const handleAddClient = () => {
      navigate('/register-client', { state: { selectedClient } });
  };
  return (
    <div className="card shadow-sm rounded-4 p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0 mx-2">Clients</h5>
        <button className="btn btn-primary" onClick={handleAddClient}>
          <FaPlus />
        </button>
      </div>

      <p className="small">
        <span className="text-success">{clients.filter(c => c.status === "on-track").length} on track</span>,{" "}
        <span className="text-danger">{clients.filter(c => c.status === "attention").length} need attention</span>
      </p>

      <ul
        className="list-unstyled mt-3"
        style={{ maxHeight: "65vh", overflowY: "auto" }}
      >
        {currentClients.map((client) => (
          <li
            key={client.id}
            onClick={() => onSelect(client)}
            className={`d-flex align-items-center mb-3 p-2 rounded ${
              selectedClient?.id === client.id
                ? "bg-light border border-primary"
                : "bg-white border"
            }`}
            style={{ cursor: "pointer" }}
          >
            <img
              src={client.avatar}
              alt={client.name}
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <div className="flex-grow-1">
              <strong>{client.name}</strong>
              <div
                className={`small ${
                  client.status === "attention" ? "text-danger" : "text-muted"
                }`}
              >
                {client.streak}
              </div>
            </div>
            <span
              className={`badge rounded-circle p-2 ${
                client.status === "attention" ? "bg-danger" : "bg-success"
              }`}
            ></span>
            <span>
              <FaCircle
                className={`${
                  client.status === "attention" ? "text-danger" : "text-success"
                }`}
              />
            </span>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-2">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="small">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
