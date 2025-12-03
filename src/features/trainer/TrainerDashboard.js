import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { 
  FaUsers, 
  FaChartLine, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaPercent
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import { getTrainerDashboardThunk } from "./trainerThunks";
import {
  selectTrainerLoading,
  selectTrainerError,
  selectdashboard,
  clearError,
} from "./trainerSlice";
import AnimatedCard from "../../components/common/AnimatedCard";
import StaggerContainer from "../../components/common/StaggerContainer";

const TrainerDashboard = () => {
  const user = getDecryptedUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(selectTrainerLoading);
  const error = useSelector(selectTrainerError);
  const dashboardData = useSelector(selectdashboard);

  useEffect(() => {
    dispatch(getTrainerDashboardThunk());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (error) dispatch(clearError());
    };
  }, [error, dispatch]);

  // Extract API Data safely
  const {
    totalClients = 0,
    onTrackClients = 0,
    needAttentionClients = 0,
    overallProgressPercent = 0,
    goalsBreakdown = [],
    clientsNeedingAttention = [],
  } = dashboardData || {};

  // Calculate additional metrics
  const offTrackClients = totalClients - onTrackClients;
  const successRate = totalClients > 0 ? Math.round((onTrackClients / totalClients) * 100) : 0;
  const attentionRate = totalClients > 0 ? Math.round((needAttentionClients / totalClients) * 100) : 0;

  // Handler for client navigation - same as AllClients
  const handleViewClient = (client) => {
    const clientId = client.clientId || client.id;
    if (!clientId) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Client ID not found in client object:", client);
      }
      return;
    }
    navigate(`/client-details/${clientId}`, { state: { client } });
  };

  // Compact stats cards - HealthifyMe-inspired theme
  const statsCards = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: <FaUsers />,
      bgColor: "var(--color-card-bg)",
      iconBg: "rgba(10, 77, 60, 0.1)",
      iconColor: "var(--color-primary)",
      textColor: "var(--color-text-dark)",
      change: null,
    },
    {
      title: "On Track",
      value: onTrackClients,
      icon: <FaCheckCircle />,
      bgColor: "var(--color-card-bg)",
      iconBg: "rgba(0, 100, 0, 0.1)",
      iconColor: "var(--color-success)",
      textColor: "var(--color-text-dark)",
      change: `${successRate}%`,
      changeType: "positive",
    },
    {
      title: "Need Attention",
      value: needAttentionClients,
      icon: <FaExclamationTriangle />,
      bgColor: "var(--color-card-bg)",
      iconBg: "rgba(255, 193, 7, 0.1)",
      iconColor: "var(--color-warning)",
      textColor: "var(--color-text-dark)",
      change: `${attentionRate}%`,
      changeType: "warning",
    },
    {
      title: "Success Rate",
      value: `${overallProgressPercent}%`,
      icon: <FaPercent />,
      bgColor: "var(--color-card-bg)",
      iconBg: "rgba(10, 77, 60, 0.1)",
      iconColor: "var(--color-primary)",
      textColor: "var(--color-text-dark)",
      change: `${onTrackClients}/${totalClients}`,
      changeType: "info",
    },
  ];

  // --- Loading State ---
  if (loading) {
    return (
      <div className="trainer-dashboard min-vh-100 d-flex align-items-center justify-content-center">
        <Container className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading dashboard data...</p>
        </Container>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Dashboard</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button
              variant="outline-danger"
              onClick={() => dispatch(getTrainerDashboardThunk())}
            >
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // --- Main UI ---
  return (
    <div className="trainer-dashboard min-vh-100" style={{ padding: "0.5rem", backgroundColor: "var(--color-bg)" }}>
      <Container fluid className="px-0">
        {/* Compact Header - Space-saving */}
        <div className="d-flex align-items-center justify-content-between gap-2 mb-2" style={{ flexWrap: "wrap" }}>
          <div className="d-flex align-items-center gap-2" style={{ flex: "1 1 auto", minWidth: "150px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: "600",
                flexShrink: 0,
              }}
            >
              {user?.fullName?.charAt(0)?.toUpperCase() || "T"}
            </div>
            <div style={{ minWidth: 0, flex: "1 1 auto" }}>
              <h2 className="fw-bold mb-0" style={{ 
                fontSize: "clamp(1rem, 3vw, 1.25rem)", 
                color: "var(--color-text-dark)",
                lineHeight: "1.3",
                wordBreak: "break-word"
              }}>
                {user?.fullName}'s Dashboard
              </h2>
              <p className="mb-0" style={{ 
                fontSize: "0.75rem", 
                lineHeight: "1.4",
                color: "var(--color-text-secondary)"
              }}>
                {totalClients} {totalClients === 1 ? 'client' : 'clients'} • {successRate}% success
              </p>
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="primary"
                className="rounded-pill"
                onClick={() => navigate("/register-client")}
                style={{ 
                  minHeight: "40px", 
                  fontSize: "0.8rem", 
                  paddingLeft: "1rem", 
                  paddingRight: "1rem",
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                }}
              >
                + Add Client
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Stats Cards - HealthifyMe Theme */}
        <Row className="g-2 mb-2">
          {statsCards.map((card, i) => (
            <Col xs={6} sm={6} lg={3} key={i}>
              <motion.div
                className="card border-0 h-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: card.bgColor,
                  color: card.textColor,
                  borderRadius: "0.875rem",
                  cursor: "default",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <Card.Body className="p-2">
                  <div className="d-flex align-items-start justify-content-between">
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <h6 className="fw-semibold mb-1" style={{ 
                        fontSize: "0.7rem", 
                        lineHeight: "1.3",
                        color: "var(--color-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        {card.title}
                      </h6>
                      <h3 className="fw-bold mb-0" style={{ 
                        fontSize: "1.3rem", 
                        lineHeight: "1.2",
                        color: card.textColor
                      }}>
                        {card.value}
                      </h3>
                      {card.change && (
                        <p className="mb-0" style={{ 
                          fontSize: "0.65rem", 
                          marginTop: "0.2rem",
                          color: "var(--color-text-secondary)"
                        }}>
                          {card.change}
                        </p>
                      )}
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: card.iconBg,
                        fontSize: "1rem",
                        color: card.iconColor,
                      }}
                    >
                      {card.icon}
                    </div>
                  </div>
                </Card.Body>
              </motion.div>
            </Col>
          ))}
        </Row>

        
        {/* Overall Progress with Visual Chart */}
        {totalClients > 0 && (
          <Row className="g-2 mb-2">
            <Col xs={12} lg={6}>
              <Card
                className="border-0 h-100"
                style={{
                  background: "var(--color-card-bg)",
                  borderRadius: "0.875rem",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <Card.Body className="p-3">
                  <h6 className="fw-bold mb-3" style={{ 
                    fontSize: "0.9rem", 
                    color: "var(--color-text-dark)",
                    lineHeight: "1.3"
                  }}>
                    Overall Progress
                  </h6>
                  <div className="d-flex align-items-center gap-3">
                    {/* Donut Chart */}
                    <div style={{ position: "relative", width: "100px", height: "100px", flexShrink: 0 }}>
                      <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="var(--color-border)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="var(--color-primary)"
                          strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgressPercent / 100)}`}
                          strokeLinecap="round"
                          style={{ transition: "stroke-dashoffset 0.5s ease" }}
                        />
                      </svg>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          textAlign: "center",
                        }}
                      >
                        <div className="fw-bold" style={{ fontSize: "1.1rem", color: "var(--color-primary)" }}>
                          {overallProgressPercent}%
                        </div>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              background: "var(--color-primary)",
                            }}
                          />
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-dark)" }}>On Track</span>
                        </div>
                        <span className="fw-bold" style={{ fontSize: "0.85rem" }}>{onTrackClients}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              background: "var(--color-border)",
                            }}
                          />
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-dark)" }}>Off Track</span>
                        </div>
                        <span className="fw-bold" style={{ fontSize: "0.85rem" }}>{offTrackClients}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              background: "var(--color-warning)",
                            }}
                          />
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-dark)" }}>Need Attention</span>
                        </div>
                        <span className="fw-bold" style={{ fontSize: "0.85rem" }}>{needAttentionClients}</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            {/* Goals Breakdown Chart */}
            {goalsBreakdown.length > 0 && (
              <Col xs={12} lg={6}>
                <Card
                  className="border-0 h-100"
                  style={{
                    background: "var(--color-card-bg)",
                    borderRadius: "0.875rem",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <Card.Body className="p-3">
                    <h6 className="fw-bold mb-3" style={{ 
                      fontSize: "0.9rem", 
                      color: "var(--color-text-dark)",
                      lineHeight: "1.3"
                    }}>
                      Goals Distribution
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      {goalsBreakdown.slice(0, 4).map((item, i) => {
                        const maxCount = Math.max(...goalsBreakdown.map(g => g.count), 1);
                        const percentage = (item.count / maxCount) * 100;
                        const colors = ["#42a5f5", "#66bb6a", "#ffb74d", "#ba68c8"];
                        const color = colors[i % colors.length];
                        
                        return (
                          <div key={i}>
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <span style={{ fontSize: "0.75rem", color: "var(--color-text-dark)", fontWeight: "500" }}>
                                {item.goal}
                              </span>
                              <span className="fw-bold" style={{ fontSize: "0.8rem", color: color }}>
                                {item.count}
                              </span>
                            </div>
                            <div
                              style={{
                                height: "8px",
                                borderRadius: "4px",
                                background: "var(--color-border)",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${percentage}%`,
                                  background: color,
                                  borderRadius: "4px",
                                  transition: "width 0.5s ease",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        )}

        {/* Quick Actions - Enhanced */}
        {totalClients > 0 && (
          <Card
            className="border-0 mb-2"
            style={{
              background: "var(--color-card-bg)",
              borderRadius: "0.875rem",
              border: "1px solid var(--color-border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between gap-2" style={{ flexWrap: "wrap" }}>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="flex-grow-1 rounded-pill"
                  onClick={() => navigate("/AllClients")}
                  style={{ 
                    minHeight: "44px", 
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    borderWidth: "1.5px",
                    minWidth: "140px",
                  }}
                >
                  <FaUsers className="me-2" /> View All Clients
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="flex-grow-1 rounded-pill"
                  onClick={() => navigate("/register-client")}
                  style={{ 
                    minHeight: "44px", 
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    borderWidth: "1.5px",
                    minWidth: "140px",
                  }}
                >
                  <FaUsers className="me-2" /> Add New Client
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Empty State - Enhanced */}
        {totalClients === 0 && (
          <Card
            className="border-0 mb-2"
            style={{
              background: "var(--color-card-bg)",
              borderRadius: "0.875rem",
              border: "1px solid var(--color-border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Card.Body className="p-4 text-center">
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(10, 77, 60, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "2.5rem",
                }}
              >
                📊
              </div>
              <h6 className="fw-bold mb-2" style={{ 
                fontSize: "1rem",
                color: "var(--color-text-dark)"
              }}>
                No client data yet
              </h6>
              <p className="mb-3" style={{ 
                fontSize: "0.85rem",
                color: "var(--color-text-secondary)",
                lineHeight: "1.5"
              }}>
                Add your first client to start tracking progress and insights
              </p>
              <Button
                variant="primary"
                size="sm"
                className="rounded-pill"
                onClick={() => navigate("/register-client")}
                style={{ 
                  minHeight: "44px", 
                  fontSize: "0.85rem", 
                  paddingLeft: "1.5rem", 
                  paddingRight: "1.5rem",
                  fontWeight: "500",
                }}
              >
                + Add Your First Client
              </Button>
            </Card.Body>
          </Card>
        )}

        {/* Clients Needing Attention - Enhanced Design */}
        <Card
          className="border-0 mb-2"
          style={{ 
            borderRadius: "0.875rem",
            border: "1px solid var(--color-border)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            background: "var(--color-card-bg)",
          }}
        >
          <Card.Body className="p-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ fontSize: "0.9rem", color: "var(--color-danger)" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(220, 53, 69, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaExclamationTriangle style={{ fontSize: "0.9rem", color: "var(--color-danger)" }} />
                </div>
                <span>Clients Needing Attention</span>
              </h6>
              {clientsNeedingAttention.length > 0 && (
                <Badge 
                  bg="warning" 
                  className="px-2 py-1" 
                  style={{ 
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    borderRadius: "0.5rem",
                  }}
                >
                  {clientsNeedingAttention.length}
                </Badge>
              )}
            </div>

            {clientsNeedingAttention.length > 0 ? (
              <div
                className="d-flex flex-row gap-2 clients-scroll"
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  paddingBottom: "0.5rem",
                  marginLeft: "-0.5rem",
                  marginRight: "-0.5rem",
                  paddingLeft: "0.5rem",
                  paddingRight: "0.5rem",
                  scrollSnapType: "x mandatory",
                }}
              >
                {clientsNeedingAttention.map((client, idx) => (
                  <motion.div
                    key={client.clientId || client.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flexShrink: 0,
                      width: "calc(100vw - 2.5rem)",
                      maxWidth: "280px",
                      minWidth: "240px",
                      scrollSnapAlign: "start",
                    }}
                  >
                    <Card
                      className="border-0 p-3 position-relative h-100"
                      style={{
                        width: "100%",
                        borderRadius: "0.875rem",
                        background: "var(--color-card-bg)",
                        border: "1px solid var(--color-border)",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => handleViewClient(client)}
                    >
                      <div className="d-flex flex-column h-100">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6
                            className="fw-bold mb-0 text-dark"
                            style={{ fontSize: "0.9rem", lineHeight: "1.3" }}
                          >
                            {client.fullName || client.name || "Unknown Client"}
                          </h6>
                          <Badge bg="warning" text="dark" className="px-1 py-0" style={{ fontSize: "0.65rem" }}>
                            Alert
                          </Badge>
                        </div>

                        {client.reason && (
                          <div className="mb-2">
                            <p className="mb-0 fw-medium text-dark" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                              {client.reason}
                            </p>
                          </div>
                        )}

                        <div className="mt-auto pt-2 border-top">
                          {client.email && (
                            <div className="mb-1">
                              <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                                📧 {client.email.length > 20 ? client.email.substring(0, 20) + '...' : client.email}
                              </small>
                            </div>
                          )}
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-100 rounded-pill"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewClient(client);
                            }}
                            style={{ 
                              minHeight: "44px", 
                              fontSize: "0.8rem", 
                              padding: "0.5rem 0.75rem",
                              fontWeight: "500",
                            }}
                          >
                            View Details →
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : totalClients === 0 ? null : (
              <div className="text-center py-2">
                <div className="mb-2" style={{ fontSize: "1.5rem" }}>🎯</div>
                <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>All clients are on track!</p>
                <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                  Great job keeping everyone motivated.
                </small>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TrainerDashboard;
