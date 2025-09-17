import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleAddClient = () => {
    navigate('/register-client');
  };

  return (
    <div className="container py-5" style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      {/* Header */}
      <div className="mb-5 text-center">
        <h2 className="fw-bold text-dark">Trainer Dashboard</h2>
        <p className="text-muted">Monitor your clients’ health and meal plans</p>
      </div>

      {/* Stats Section */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-4 h-100 border-0">
            <div className="card-body text-center">
              <h6 className="card-title text-secondary mb-3">👥 Total Clients</h6>
              <p className="display-5 fw-bold text-primary">25</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm rounded-4 h-100 border-0">
            <div className="card-body text-center">
              <h6 className="card-title text-secondary mb-3">🏋️ Active Plans</h6>
              <p className="display-5 fw-bold text-success">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Quick Actions */}
      <div className="row g-4">
        {/* Notifications */}
        <div className="col-md-6">
          <div className="card shadow-sm rounded-4 h-100 border-0">
            <div className="card-body">
              <h5 className="card-title text-dark mb-4">🔔 Notifications</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0 px-0 py-2 bg-transparent">John’s plan is expiring in 3 days</li>
                <li className="list-group-item border-0 px-0 py-2 bg-transparent">2 new clients added this week</li>
                <li className="list-group-item border-0 px-0 py-2 bg-transparent">Payment pending from Sarah</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-md-6">
          <div className="card shadow-sm rounded-4 h-100 border-0 d-flex align-items-center justify-content-center">
            <div className="card-body text-center">
              <h5 className="card-title text-dark mb-4">⚡ Quick Actions</h5>
              <button 
                className="btn btn-primary px-4 py-2 rounded-pill shadow-sm"
                onClick={handleAddClient}
                style={{ transition: "transform 0.2s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                ➕ Add Client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
