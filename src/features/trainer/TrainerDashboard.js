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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import { getTrainerDashboardThunk } from "./trainerThunks";
import {
  selectTrainerLoading,
  selectTrainerError,
  selectDashboardData,
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
const dashboardData = useSelector(selectDashboardData);

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

  // Handler for client navigation - same as AllClients
  const handleViewClient = (client) => {
    const clientId = client.clientId || client.id;
    if (!clientId) {
      console.error("Client ID not found in client object:", client);
      return;
    }
    navigate(`/client-details/${clientId}`, { state: { client } });
  };

  // Essential stats cards - only showing key metrics
  const cards = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: <FaUsers />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textColor: "#ffffff",
      description: "Active clients",
    },
    {
      title: "On Track",
      value: onTrackClients,
      icon: <FaChartLine />,
      gradient: "linear-gradient(135deg, #007AFF 0%, #0056b3 100%)",
      textColor: "#ffffff",
      description: `${totalClients > 0 ? Math.round((onTrackClients / totalClients) * 100) : 0}% of total`,
    },
    {
      title: "Need Attention",
      value: needAttentionClients,
      icon: <FaExclamationTriangle />,
      gradient: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
      textColor: "#ffffff",
      description: "Requires follow-up",
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
            <Button variant="outline-danger" onClick={() => dispatch(getTrainerDashboardThunk())}>
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // --- Main UI ---
  return (
    <div className="trainer-dashboard min-vh-100 py-4">
      <Container>
        {/* Header */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="fw-bold text-secondary mb-1">{user?.fullName}'s Dashboard</h2>
            <p className="text-muted mb-0">Quick overview of your clients and goals</p>
          </Col>
          <Col xs="auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="primary"
                className="shadow-sm rounded-pill px-4"
                onClick={() => navigate("/register-client")}
                style={{ minHeight: '44px' }}
              >
                + Add Client
              </Button>
            </motion.div>
          </Col>
        </Row>

        {/* Stats Cards - Essential Metrics Only */}
        <StaggerContainer className="row g-3 g-md-4 mb-4" staggerDelay={0.1}>
          {cards.map((card, i) => (
            <StaggerContainer.Item key={i} className="col-lg-4 col-md-4 col-sm-6">
              <AnimatedCard delay={i * 0.1} hover>
                <motion.div
                  className="border-0 shadow-lg h-100 position-relative overflow-hidden"
                  style={{
                    background: card.gradient,
                    borderRadius: "1rem",
                    color: card.textColor,
                    cursor: "default",
                    padding: 0
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 h-100 bg-transparent">
                <div
                  className="position-absolute top-0 end-0"
                  style={{
                    width: "100px",
                    height: "100px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    transform: "translate(30px, -30px)",
                  }}
                />
                <Card.Body className="p-4 position-relative">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-2 opacity-90" style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>
                        {card.title}
                      </h6>
                      <h2 className="fw-bold mb-1" style={{ fontSize: "2.5rem" }}>
                        {card.value}
                      </h2>
                      {card.description && (
                        <p className="mb-0 small opacity-75" style={{ fontSize: "0.85rem" }}>
                          {card.description}
                        </p>
                      )}
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: 64,
                        height: 64,
                        background: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(10px)",
                        fontSize: "1.75rem",
                        color: card.textColor,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      {card.icon}
                    </div>
                  </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </AnimatedCard>
            </StaggerContainer.Item>
          ))}
          {/* Goals Breakdown Section */}
{/* Goals Breakdown Section */}
{goalsBreakdown.length > 0 && (
  <>
    <StaggerContainer className="row g-3 g-md-4 mb-4" staggerDelay={0.1}>
      {goalsBreakdown.map((item, i) => {
        // Rotate between a few nice gradients
        const gradients = [
          "linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)",
          "linear-gradient(135deg, #66bb6a 0%, #43a047 100%)",
          "linear-gradient(135deg, #ffb74d 0%, #f57c00 100%)",
          "linear-gradient(135deg, #ba68c8 0%, #8e24aa 100%)",
          "linear-gradient(135deg, #26c6da 0%, #00acc1 100%)",
        ];
        const gradient = gradients[i % gradients.length];

        return (
          <StaggerContainer.Item key={i} className="col-lg-4 col-md-4 col-sm-6">
            <AnimatedCard delay={i * 0.1} hover>
              <motion.div
                className="border-0 shadow-lg h-100 position-relative overflow-hidden"
                style={{
                  background: gradient,
                  borderRadius: "1rem",
                  color: "#fff",
                  cursor: "default",
                  padding: 0,
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 h-100 bg-transparent">
                  <div
                    className="position-absolute top-0 end-0"
                    style={{
                      width: "100px",
                      height: "100px",
                      background: "rgba(255,255,255,0.15)",
                      borderRadius: "50%",
                      transform: "translate(30px, -30px)",
                    }}
                  />
                  <Card.Body className="p-4 position-relative">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="flex-grow-1">
                        <h6
                          className="fw-semibold mb-2 opacity-90"
                          style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}
                        >
                          {item.goal}
                        </h6>
                        <h2
                          className="fw-bold mb-1"
                          style={{ fontSize: "2.5rem" }}
                        >
                          {item.count}
                        </h2>
                        <p
                          className="mb-0 small opacity-75"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {item.count === 1 ? "Client" : "Clients"}
                        </p>
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                        style={{
                          width: 64,
                          height: 64,
                          background: "rgba(255,255,255,0.25)",
                          backdropFilter: "blur(10px)",
                          fontSize: "1.75rem",
                          color: "#fff",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      >
                        <FaChartLine />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </AnimatedCard>
          </StaggerContainer.Item>
        );
      })}
    </StaggerContainer>
  </>
)}


        </StaggerContainer>

        {/* Progress Section - Only show if there are clients */}
        {totalClients > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatedCard delay={0.3}>
              <Card className="border-0 shadow-lg mt-4 p-4" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", borderRadius: "1rem" }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="fw-bold text-primary mb-1">Overall Progress</h5>
                <p className="text-muted mb-0 small">
                  {onTrackClients} out of {totalClients} clients are on track
                </p>
              </div>
              <div className="text-end">
                <h3 className="fw-bold text-success mb-0">{overallProgressPercent}%</h3>
                <small className="text-muted">Success Rate</small>
              </div>
            </div>
            <ProgressBar 
              now={overallProgressPercent} 
              variant="success" 
              animated 
              style={{ height: '12px', borderRadius: '10px' }}
            />
              </Card>
            </AnimatedCard>
          </motion.div>
        )}

        {/* Clients Needing Attention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatedCard delay={0.4}>
            <Card className="border-0 shadow-lg mt-4 p-4" style={{ borderRadius: "1rem" }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-danger mb-0 d-flex align-items-center gap-2">
              <FaExclamationTriangle /> Clients Needing Attention
            </h5>
            {clientsNeedingAttention.length > 0 && (
              <Badge bg="warning" className="px-3 py-2">
                {clientsNeedingAttention.length} {clientsNeedingAttention.length === 1 ? 'Client' : 'Clients'}
              </Badge>
            )}
          </div>

          {clientsNeedingAttention.length > 0 ? (
            <div
              className="d-flex flex-row flex-nowrap overflow-auto pb-2"
              style={{ 
                gap: "1rem", 
                scrollSnapType: "x mandatory",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0,0,0,0.2) transparent"
              }}
            >
              {clientsNeedingAttention.map((client, idx) => (
                <motion.div
                  key={client.clientId || client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card
                    className="border-0 shadow-sm p-3 flex-shrink-0 position-relative"
                    style={{
                      width: "320px",
                      minWidth: "320px",
                      borderRadius: "1rem",
                      scrollSnapAlign: "start",
                      background: "linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)",
                      border: "1px solid rgba(255, 193, 7, 0.3)",
                      cursor: "pointer"
                    }}
                    onClick={() => handleViewClient(client)}
                  >
                  <div className="d-flex flex-column h-100">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                        {client.fullName || client.name || 'Unknown Client'}
                      </h6>
                      <Badge bg="warning" text="dark" className="px-2 py-1">
                        <small>Needs Attention</small>
                      </Badge>
                    </div>
                    
                    {client.reason && (
                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">Reason:</small>
                        <p className="mb-0 fw-medium text-dark small">{client.reason}</p>
                      </div>
                    )}
                    
                    <div className="mt-auto pt-2 border-top">
                      {client.email && (
                        <div className="mb-1">
                          <small className="text-muted d-flex align-items-center gap-1">
                            <span>📧</span> {client.email}
                          </small>
                        </div>
                      )}
                      {client.phoneNumber && (
                        <div className="mb-2">
                          <small className="text-muted d-flex align-items-center gap-1">
                            <span>📱</span> {client.phoneNumber}
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
                        style={{ minHeight: '36px', fontSize: '0.875rem' }}
                      >
                        View Details →
                      </Button>
                    </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mb-3" style={{ fontSize: '3rem' }}>🎯</div>
              <p className="text-muted mb-0">All clients are on track!</p>
              <small className="text-muted">Great job keeping everyone motivated.</small>
            </div>
          )}
            </Card>
          </AnimatedCard>
        </motion.div>

      </Container>
    </div>
  );
};

export default TrainerDashboard;
