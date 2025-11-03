import React from "react";
import { FaUsers, FaUserTie, FaClipboardList, FaChartLine, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";
import AnimatedCard from "../../components/common/AnimatedCard";
import StaggerContainer from "../../components/common/StaggerContainer";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Clients",
      value: "250",
      icon: <FaUsers />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#667eea"
    },
    {
      title: "Total Trainers",
      value: "45",
      icon: <FaUserTie />,
      gradient: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
      color: "#28a745"
    },
    {
      title: "Active Plans",
      value: "120",
      icon: <FaClipboardList />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      color: "#f5576c"
    },
    {
      title: "Platform Growth",
      value: "+15%",
      icon: <FaChartLine />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      color: "#4facfe"
    }
  ];

  return (
    <div className="container-fluid py-4 py-md-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <motion.div 
        className="text-center mb-4 mb-md-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="fw-bold text-dark d-flex justify-content-center align-items-center gap-2 mb-3">
          <FaUserTie className="text-success" size={32} />
          <span>Administrator Dashboard</span>
        </h2>
        <p className="text-muted mb-0 fs-5">
          Manage trainers, clients, and monitor platform activities
        </p>
      </motion.div>

      {/* Stats Overview */}
      <StaggerContainer className="row g-3 g-md-4 mb-4 mb-md-5" staggerDelay={0.1}>
        {stats.map((stat, idx) => (
          <StaggerContainer.Item key={idx} className="col-md-3 col-sm-6">
            <AnimatedCard delay={idx * 0.1} hover>
              <motion.div
                className="border-0 shadow-lg h-100 position-relative overflow-hidden"
                style={{
                  background: stat.gradient,
                  borderRadius: "1rem",
                  color: "#ffffff",
                  padding: 0
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-body text-center p-4 position-relative">
                  <div
                    className="position-absolute top-0 end-0"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                      transform: "translate(25px, -25px)",
                    }}
                  />
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: 56,
                      height: 56,
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      fontSize: "1.5rem",
                    }}
                  >
                    {stat.icon}
                  </div>
                  <h6 className="text-white-50 mb-2 fw-semibold" style={{ fontSize: "0.9rem" }}>
                    {stat.title}
                  </h6>
                  <h3 className="fw-bold mb-0" style={{ fontSize: "2.25rem" }}>
                    {stat.value}
                  </h3>
                </div>
              </motion.div>
            </AnimatedCard>
          </StaggerContainer.Item>
        ))}
      </StaggerContainer>

      {/* Main Section */}
      <div className="row g-4">
        {/* Left: Notifications */}
        <motion.div 
          className="col-lg-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatedCard delay={0.4}>
            <div className="card shadow-lg rounded-4 border-0">
              <div className="card-body p-4">
                <h5 className="card-title text-dark mb-4 d-flex align-items-center gap-2 fw-bold">
                  <span style={{ fontSize: "1.5rem" }}>🔔</span>
                  <span>Notifications</span>
                </h5>
                <ul className="list-group list-group-flush">
                  {[
                    { text: "New trainer registration request received", icon: "📢" },
                    { text: "Client milestone achieved", icon: "✅" },
                    { text: "System maintenance scheduled tonight", icon: "⚠️" }
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="list-group-item border-0 px-0 py-3 bg-transparent border-bottom"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                      style={{ borderBottomColor: "rgba(0,0,0,0.05) !important" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                        <span className="text-dark">{item.text}</span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Right: Quick Actions */}
        <motion.div 
          className="col-lg-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <AnimatedCard delay={0.5}>
            <div className="card shadow-lg rounded-4 border-0 text-center" style={{ background: "linear-gradient(135deg, #f1fcf8 0%, #e8f5e9 100%)" }}>
              <div className="card-body p-4">
                <h5 className="card-title text-dark mb-4 fw-bold">
                  <span style={{ fontSize: "1.5rem" }}>⚡</span> Quick Actions
                </h5>
                <div className="d-grid gap-3">
                  {[
                    { label: "Add Trainer", icon: <FaUserTie />, variant: "primary" },
                    { label: "View Clients", icon: <FaUsers />, variant: "success" },
                    { label: "Admin Settings", icon: <FaCog />, variant: "warning" }
                  ].map((action, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button 
                        className={`btn btn-${action.variant} btn-lg rounded-pill w-100 shadow-sm`}
                        style={{ minHeight: '48px' }}
                      >
                        <span className="me-2">{action.icon}</span>
                        {action.label}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
}
