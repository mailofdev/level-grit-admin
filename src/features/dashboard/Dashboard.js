import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();

  const handleAddClient = () => {
    navigate('/register-client'); // route to Clients page
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Trainer Dashboard</h2>
        <p className="text-muted">Overview of your clients and plans</p>
      </div>

      {/* Stats Section */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6 className="card-title">👥 Total Clients</h6>
              <p className="display-6 fw-bold text-primary">25</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6 className="card-title">🏋️ Active Plans</h6>
              <p className="display-6 fw-bold text-success">12</p>
            </div>
          </div>
        </div>
        {/* <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6 className="card-title">💳 Pending Payments</h6>
              <p className="display-6 fw-bold text-danger">5</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6 className="card-title">💰 Earnings This Month</h6>
              <p className="display-6 fw-bold text-warning">₹18,500</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Notifications & Quick Actions */}
      <div className="row">
        {/* Notifications */}
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm rounded-4 rounded-4 h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">🔔 Notifications</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">John’s plan is expiring in 3 days</li>
                <li className="list-group-item">2 new clients added this week</li>
                <li className="list-group-item">Payment pending from Sarah</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm rounded-4 rounded-4 h-100">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">⚡ Quick Actions</h5>
              <button className="btn btn-primary me-2" onClick={handleAddClient}>
                ➕ Add Client
              </button>
              {/* <button className="btn btn-success">
                ➕ Create Plan
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
