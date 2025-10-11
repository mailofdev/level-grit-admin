import React from "react";
import { FaUsers, FaUserTie, FaClipboardList, FaChartLine, FaCog } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#f7f8f8", minHeight: "100vh" }}>
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark d-flex justify-content-center align-items-center gap-2">
          <FaUserTie className="text-success" />
          Administrator Dashboard
        </h2>
        <p className="text-muted mb-0">
          Manage trainers, clients, and monitor platform activities
        </p>
      </div>

      {/* Stats Overview */}
      <div className="row g-4 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card shadow-sm rounded-4 border-0 h-100" style={{ backgroundColor: "#f1fcf8" }}>
            <div className="card-body text-center">
              <FaUsers className="fs-3 text-primary mb-2" />
              <h6 className="text-muted">Total Clients</h6>
              <h3 className="fw-bold text-dark">250</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card shadow-sm rounded-4 border-0 h-100" style={{ backgroundColor: "#f1fdf4" }}>
            <div className="card-body text-center">
              <FaUserTie className="fs-3 text-success mb-2" />
              <h6 className="text-muted">Total Trainers</h6>
              <h3 className="fw-bold text-success">45</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card shadow-sm rounded-4 border-0 h-100" style={{ backgroundColor: "#fff5f5" }}>
            <div className="card-body text-center">
              <FaClipboardList className="fs-3 text-danger mb-2" />
              <h6 className="text-muted">Active Plans</h6>
              <h3 className="fw-bold text-danger">120</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card shadow-sm rounded-4 border-0 h-100" style={{ backgroundColor: "#e7f1ff" }}>
            <div className="card-body text-center">
              <FaChartLine className="fs-3 text-primary mb-2" />
              <h6 className="text-muted">Platform Growth</h6>
              <h3 className="fw-bold text-primary">+15%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="row g-4">
        {/* Left: Notifications */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 border-0">
            <div className="card-body">
              <h5 className="card-title text-dark mb-3 d-flex align-items-center gap-2">
                🔔 Notifications
              </h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0 px-0 py-2 bg-transparent">
                  📢 New trainer registration request received
                </li>
                <li className="list-group-item border-0 px-0 py-2 bg-transparent">
                  ✅ Client milestone achieved
                </li>
                <li className="list-group-item border-0 px-0 py-2 bg-transparent">
                  ⚠️ System maintenance scheduled tonight
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 border-0 text-center" style={{ backgroundColor: "#f1fcf8" }}>
            <div className="card-body">
              <h5 className="card-title text-dark mb-4">⚡ Quick Actions</h5>
              <div className="d-grid gap-3">
                <button className="btn btn-primary btn-lg rounded-pill">
                  <FaUserTie className="me-2" /> Add Trainer
                </button>
                <button className="btn btn-success btn-lg rounded-pill">
                  <FaUsers className="me-2" /> View Clients
                </button>
                <button className="btn btn-warning btn-lg rounded-pill">
                  <FaCog className="me-2" /> Admin Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
