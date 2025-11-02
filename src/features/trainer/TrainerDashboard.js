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
  FaDumbbell,
  FaHeartbeat,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import { getTrainerDashboardThunk } from "./trainerThunks";
import {
  selectTrainerLoading,
  selectTrainerError,
  selectDashboardData,
  clearError,
} from "./trainerSlice";

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

  // Map goal breakdowns
  const muscleGain =
    goalsBreakdown.find((g) =>
      g.goal.toLowerCase().includes("muscle")
    )?.count || 0;
  const weightLoss =
    goalsBreakdown.find((g) =>
      g.goal.toLowerCase().includes("weight")
    )?.count || 0;

  const cards = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: <FaUsers />,
      gradient: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
      textColor: "#0d6efd",
    },
    {
      title: "On Track Clients",
      value: onTrackClients,
      icon: <FaChartLine />,
      gradient: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
      textColor: "#198754",
    },
    {
      title: "Need Attention",
      value: needAttentionClients,
      icon: <FaExclamationTriangle />,
      gradient: "linear-gradient(135deg, #fff8e1, #ffecb3)",
      textColor: "#ffc107",
    },
    {
      title: "Goal: Muscle Gain",
      value: muscleGain,
      icon: <FaDumbbell />,
      gradient: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
      textColor: "#0dcaf0",
    },
    {
      title: "Goal: Weight Loss",
      value: weightLoss,
      icon: <FaHeartbeat />,
      gradient: "linear-gradient(135deg, #ffebee, #ffcdd2)",
      textColor: "#dc3545",
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
            <Button
              variant="primary"
              className="shadow-sm"
              onClick={() => navigate("/register-client")}
            >
              + Add Client
            </Button>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="g-4">
          {cards.map((card, i) => (
            <Col lg={4} md={6} key={i}>
              <Card
                className="border-0 shadow-sm h-100"
                style={{
                  background: card.gradient,
                  borderRadius: "1rem",
                  color: card.textColor,
                }}
              >
                <Card.Body className="d-flex align-items-center justify-content-between p-4">
                  <div>
                    <h6 className="fw-semibold mb-1">{card.title}</h6>
                    <h2 className="fw-bold mb-0">{card.value}</h2>
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 55,
                      height: 55,
                      background: "rgba(255,255,255,0.6)",
                      fontSize: "1.5rem",
                      color: card.textColor,
                    }}
                  >
                    {card.icon}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Progress Section */}
        <Card className="border-0 shadow-sm mt-5 p-4">
          <h5 className="fw-bold text-primary mb-3">Overall Progress</h5>
          <p className="text-muted mb-2">
            {overallProgressPercent}% of your clients are on track with their goals.
          </p>
          <ProgressBar now={overallProgressPercent} variant="success" animated />
        </Card>

        {/* Clients Needing Attention */}
        <Card className="border-0 shadow-sm mt-4 p-4">
          <h5 className="fw-bold text-danger mb-3">Clients Needing Attention</h5>
          <Row className="g-3">
            {clientsNeedingAttention.length > 0 ? (
              clientsNeedingAttention.map((client) => (
                <Col md={6} lg={4} key={client.clientId}>
                  <Card className="border-0 shadow-sm p-3 h-100">
                    <div className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0">{client.fullName}</h6>
                        <Badge bg="warning" text="dark">
                          Attention Needed
                        </Badge>
                      </div>
                      <p className="mb-1 text-muted">
                        <strong>Reason:</strong> {client.reason}
                      </p>
                      <p className="mb-1 small text-muted">
                        <strong>Email:</strong> {client.email}
                      </p>
                      <p className="mb-1 small text-muted">
                        <strong>Phone:</strong> {client.phoneNumber}
                      </p>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mt-2 align-self-start"
                        onClick={() => navigate(`/client/${client.clientId}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-muted">All clients are on track 🎯</p>
              </Col>
            )}
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default TrainerDashboard;
