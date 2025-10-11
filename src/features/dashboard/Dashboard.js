import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaBell,
  FaRunning,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaDumbbell,
  FaChartLine,
  FaClipboardList,
  FaWeight,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { getDecryptedUser } from "../../components/common/CommonFunctions";

const Dashboard = () => {
  const navigate = useNavigate();
const user = getDecryptedUser();
console.log("Authenticated User:", user?.role);

  const handleAddClient = () => {
    navigate("/register-client");
  };

  const recentClients = [
    { name: "John Doe", status: "On Track", plan: "Fat Loss" },
    { name: "Sarah Lee", status: "Missed Meals", plan: "Muscle Gain" },
    { name: "Amit Kumar", status: "On Track", plan: "Strength" },
  ];

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #eaf4ff 100%)",
        minHeight: "100vh",
      }}
    >
      {/* {user?.role} */}
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark d-flex justify-content-center align-items-center gap-2">
          <FaDumbbell className="text-primary" />
          Trainer Dashboard
        </h2>
        <p className="text-muted">
          Stay in control of your clients’ fitness progress and performance
        </p>
      </div>

      {/* Stats Overview */}
      <div className="row g-4 mb-4">
        {[
          {
            title: "Total Clients",
            value: 25,
            color: "#007bff",
            icon: <FaUsers />,
          },
          {
            title: "On Track",
            value: 18,
            color: "#28a745",
            icon: <FaCheckCircle />,
          },
          {
            title: "Off Track",
            value: 7,
            color: "#dc3545",
            icon: <FaTimesCircle />,
          },
          {
            title: "Active Plans",
            value: 12,
            color: "#17a2b8",
            icon: <FaRunning />,
          },
        ].map((stat, idx) => (
          <div className="col-md-3 col-sm-6" key={idx}>
            <div
              className="card shadow-sm rounded-4 border-0 h-100"
              style={{ backgroundColor: "#fff" }}
            >
              <div className="card-body text-center">
                <div
                  className="fs-3 mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.icon}
                </div>
                <h6 className="text-muted">{stat.title}</h6>
                <h3 className="fw-bold" style={{ color: stat.color }}>
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="row g-4">
        {/* Left Side: Notifications & Quick Actions */}
        <div className="col-lg-4">
          {/* Notifications */}
          <div className="card shadow-sm rounded-4 border-0 mb-4">
            <div className="card-body">
              <h5 className="card-title text-dark mb-3 d-flex align-items-center gap-2">
                <FaBell className="text-warning" /> Notifications
              </h5>
              <ul className="list-group list-group-flush small">
                <li className="list-group-item border-0 bg-transparent px-0 py-2">
                  🔔 John's plan is expiring in <strong>3 days</strong>
                </li>
                <li className="list-group-item border-0 bg-transparent px-0 py-2">
                  ✅ 2 new clients joined this week
                </li>
                <li className="list-group-item border-0 bg-transparent px-0 py-2">
                  ⚠️ Payment pending from <strong>Sarah</strong>
                </li>
                <li className="list-group-item border-0 bg-transparent px-0 py-2">
                  💬 Rohan shared progress photos
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card shadow-sm rounded-4 border-0 text-center">
            <div className="card-body">
              <h5 className="card-title text-dark mb-4">
                ⚡ Quick Actions
              </h5>
              <div className="d-flex flex-column gap-3">
                <button
                  className="btn btn-primary rounded-pill py-2 shadow-sm"
                  onClick={handleAddClient}
                >
                  <FaUserPlus className="me-2" /> Add New Client
                </button>
                <button className="btn btn-outline-success rounded-pill py-2">
                  <FaClipboardList className="me-2" /> View Reports
                </button>
                <button className="btn btn-outline-danger rounded-pill py-2">
                  <FaChartLine className="me-2" /> Track Performance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Client Summary + Progress */}
        <div className="col-lg-8">
          <div className="card shadow-sm rounded-4 border-0 mb-4">
            <div className="card-body">
              <h5 className="card-title text-dark mb-3">👥 Recent Clients</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClients.map((client, idx) => (
                      <tr key={idx}>
                        <td className="fw-semibold">{client.name}</td>
                        <td>{client.plan}</td>
                        <td>
                          {client.status === "On Track" ? (
                            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                              On Track
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill">
                              Missed Meals
                            </span>
                          )}
                        </td>
                        <td style={{ width: "30%" }}>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className={`progress-bar ${
                                client.status === "On Track"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                              style={{
                                width:
                                  client.status === "On Track"
                                    ? "85%"
                                    : "55%",
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-end mt-3">
                <button className="btn btn-outline-primary btn-sm rounded-pill">
                  View All Clients →
                </button>
              </div>
            </div>
          </div>

          {/* Performance Section */}
          <div className="card shadow-sm rounded-4 border-0">
            <div className="card-body">
              <h5 className="card-title text-dark mb-4">
                <FaChartLine className="text-info me-2" />
                Performance Overview
              </h5>
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <FaWeight className="text-success fs-3 mb-2" />
                  <h6 className="fw-bold text-dark">Average Weight Loss</h6>
                  <p className="text-muted mb-0">2.3 kg / week</p>
                </div>
                <div className="col-md-4 mb-3">
                  <FaRunning className="text-primary fs-3 mb-2" />
                  <h6 className="fw-bold text-dark">Workout Adherence</h6>
                  <p className="text-muted mb-0">89%</p>
                </div>
                <div className="col-md-4 mb-3">
                  <FaClipboardList className="text-warning fs-3 mb-2" />
                  <h6 className="fw-bold text-dark">Diet Adherence</h6>
                  <p className="text-muted mb-0">76%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Dashboard;
