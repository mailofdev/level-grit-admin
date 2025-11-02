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
import AnimatedCard from "../../components/common/AnimatedCard";
import StaggerContainer from "../../components/common/StaggerContainer";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleAddClient = () => {
    navigate("/register-client");
  };

  const recentClients = [
    { name: "John Doe", status: "On Track", plan: "Fat Loss" },
    { name: "Sarah Lee", status: "Missed Meals", plan: "Muscle Gain" },
    { name: "Amit Kumar", status: "On Track", plan: "Strength" },
  ];

  return (
    <div className="container-fluid py-3 py-md-4 theme-transition">
      {/* Header */}
      <div className="text-center mb-3 mb-md-4">
        <div className="card border-0 shadow-sm mb-3 mb-md-4">
          <div className="card-body py-3 py-md-4 px-3 px-md-4">
            <h2 className="fw-bold d-flex justify-content-center align-items-center gap-2 mb-2 fs-4 fs-md-3">
              <FaDumbbell className="text-primary" />
              <span className="text-wrap">Trainer Dashboard</span>
            </h2>
            <p className="text-muted mb-0 small small-md-base">
              Stay in control of your clients' fitness progress and performance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <StaggerContainer className="row g-2 g-md-3 mb-3 mb-md-4" staggerDelay={0.1}>
        {[
          {
            title: "Total Clients",
            value: 25,
            color: "primary",
            icon: <FaUsers />,
          },
          {
            title: "On Track",
            value: 18,
            color: "success",
            icon: <FaCheckCircle />,
          },
          {
            title: "Off Track",
            value: 7,
            color: "danger",
            icon: <FaTimesCircle />,
          },
          {
            title: "Active Plans",
            value: 12,
            color: "info",
            icon: <FaRunning />,
          },
        ].map((stat, idx) => (
          <StaggerContainer.Item className="col-lg-3 col-md-6 col-sm-6" key={idx}>
            <AnimatedCard delay={idx * 0.1} hover className="h-100 position-relative overflow-hidden">
              <div className="position-absolute top-0 start-0 end-0" style={{ height: '4px', background: `linear-gradient(90deg, var(--bs-${stat.color}), var(--bs-${stat.color}-subtle))` }}></div>
              <div className="card-body text-center p-3 p-md-4">
                <div className={`fs-2 fs-md-3 mb-2 mb-md-3 text-${stat.color} d-inline-flex align-items-center justify-content-center rounded-circle p-3`} style={{ background: `rgba(var(--bs-${stat.color}-rgb), 0.1)` }}>
                  {stat.icon}
                </div>
                <h6 className="text-muted mb-2 mb-md-3 small fw-semibold text-uppercase letter-spacing-1">{stat.title}</h6>
                <h3 className={`fw-bold text-${stat.color} mb-0 fs-2 fs-md-1`}>
                  {stat.value}
                </h3>
              </div>
            </AnimatedCard>
          </StaggerContainer.Item>
        ))}
      </StaggerContainer>

      {/* Main Section */}
      <div className="row g-2 g-md-3">
        {/* Left Side: Notifications & Quick Actions */}
        <div className="col-lg-4">
          {/* Notifications */}
          <AnimatedCard delay={0.2} className="mb-2 mb-md-3">
            <div className="card-body p-3 p-md-4">
              <h5 className="card-title mb-3 d-flex align-items-center gap-2 fw-bold fs-5">
                <FaBell className="text-warning fs-5" /> Notifications
              </h5>
              <ul className="list-group list-group-flush small mb-0">
                <li className="list-group-item border-0 bg-transparent px-0 py-2 py-md-2 d-flex align-items-start gap-2">
                  <span className="fs-6">🔔</span>
                  <span className="flex-grow-1">John's plan is expiring in <strong className="text-warning">3 days</strong></span>
                </li>
                <li className="list-group-item border-0 bg-transparent px-0 py-2 py-md-2 d-flex align-items-start gap-2">
                  <span className="fs-6">✅</span>
                  <span className="flex-grow-1">2 new clients joined this week</span>
                </li>
                <li className="list-group-item border-0 bg-transparent px-0 py-2 py-md-2 d-flex align-items-start gap-2">
                  <span className="fs-6">⚠️</span>
                  <span className="flex-grow-1">Payment pending from <strong className="text-danger">Sarah</strong></span>
                </li>
                <li className="list-group-item border-0 bg-transparent px-0 py-2 py-md-2 d-flex align-items-start gap-2">
                  <span className="fs-6">💬</span>
                  <span className="flex-grow-1">Rohan shared progress photos</span>
                </li>
              </ul>
            </div>
          </AnimatedCard>

          {/* Quick Actions */}
          <AnimatedCard delay={0.3} className="text-center">
            <div className="card-body p-3 p-md-4">
              <h5 className="card-title mb-3 mb-md-4 fw-bold fs-5">
                ⚡ Quick Actions
              </h5>
              <div className="d-flex flex-column gap-2">
                <button
                  className="btn btn-primary rounded-pill py-2 px-3 px-md-4 shadow-sm hover-scale fw-semibold d-flex align-items-center justify-content-center gap-2"
                  onClick={handleAddClient}
                  style={{ minHeight: '48px' }}
                >
                  <FaUserPlus /> <span>Add New Client</span>
                </button>
                <button className="btn btn-outline-success rounded-pill py-2 px-3 px-md-4 hover-scale fw-semibold d-flex align-items-center justify-content-center gap-2" style={{ minHeight: '48px' }}>
                  <FaClipboardList /> <span>View Reports</span>
                </button>
                <button className="btn btn-outline-info rounded-pill py-2 px-3 px-md-4 hover-scale fw-semibold d-flex align-items-center justify-content-center gap-2" style={{ minHeight: '48px' }}>
                  <FaChartLine /> <span>Track Performance</span>
                </button>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Right Side: Client Summary + Progress */}
        <div className="col-lg-8">
          <AnimatedCard delay={0.4} className="mb-2 mb-md-3">
            <div className="card-body p-3 p-md-4">
              <h5 className="card-title mb-3 mb-md-4 fw-bold fs-5 d-flex align-items-center gap-2">
                <span>👥</span> Recent Clients
              </h5>
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="fw-semibold small text-uppercase text-muted">Name</th>
                      <th className="fw-semibold small text-uppercase text-muted d-none d-md-table-cell">Plan</th>
                      <th className="fw-semibold small text-uppercase text-muted">Status</th>
                      <th className="fw-semibold small text-uppercase text-muted w-25">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClients.map((client, idx) => (
                      <tr key={idx} className="border-bottom">
                        <td className="fw-semibold py-2 py-md-3">{client.name}</td>
                        <td className="py-2 py-md-3 d-none d-md-table-cell">{client.plan}</td>
                        <td className="py-2 py-md-3">
                          {client.status === "On Track" ? (
                            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-semibold">
                              On Track
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-semibold">
                              Missed Meals
                            </span>
                          )}
                        </td>
                        <td className="py-2 py-md-3">
                          <div className="progress" style={{ height: "10px", borderRadius: "10px" }}>
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
                                borderRadius: "10px"
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center text-md-end mt-3">
                <button className="btn btn-outline-primary rounded-pill px-4 py-2 hover-scale fw-semibold" style={{ minHeight: '44px' }}>
                  View All Clients →
                </button>
              </div>
            </div>
          </AnimatedCard>

          {/* Performance Section */}
          <AnimatedCard delay={0.5}>
            <div className="card-body p-3 p-md-4">
              <h5 className="card-title mb-3 mb-md-4 fw-bold fs-5 d-flex align-items-center gap-2">
                <FaChartLine className="text-info fs-5" />
                Performance Overview
              </h5>
              <div className="row text-center g-3 g-md-4">
                <div className="col-md-4">
                  <div className="p-3 p-md-4 rounded-4" style={{ background: 'rgba(var(--bs-success-rgb), 0.1)' }}>
                    <FaWeight className="text-success fs-2 fs-md-1 mb-2 mb-md-3" />
                    <h6 className="fw-bold mb-2">Average Weight Loss</h6>
                    <p className="text-muted mb-0 fs-5 fw-semibold">2.3 kg / week</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 p-md-4 rounded-4" style={{ background: 'rgba(var(--bs-primary-rgb), 0.1)' }}>
                    <FaRunning className="text-primary fs-2 fs-md-1 mb-2 mb-md-3" />
                    <h6 className="fw-bold mb-2">Workout Adherence</h6>
                    <p className="text-muted mb-0 fs-5 fw-semibold">89%</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 p-md-4 rounded-4" style={{ background: 'rgba(var(--bs-warning-rgb), 0.1)' }}>
                    <FaClipboardList className="text-warning fs-2 fs-md-1 mb-2 mb-md-3" />
                    <h6 className="fw-bold mb-2">Diet Adherence</h6>
                    <p className="text-muted mb-0 fs-5 fw-semibold">76%</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div> 
    </div>
  );
};

export default Dashboard;
