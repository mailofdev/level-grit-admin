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
  selectTrainerStats,
  selectTrainerLoading,
  selectTrainerError,
  selectDashboardData,
  clearError,
} from "./trainerSlice";

const TrainerDashboard = () => {
  const user = getDecryptedUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const stats = useSelector(selectTrainerStats);
  const loading = useSelector(selectTrainerLoading);
  const error = useSelector(selectTrainerError);
  const dashboardData = useSelector(selectDashboardData);

  // Fetch dashboard data on component mount
  useEffect(() => {
    dispatch(getTrainerDashboardThunk());
  }, [dispatch]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [error, dispatch]);

  const cards = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: <FaUsers />,
      gradient: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
      textColor: "#0d6efd",
    },
    {
      title: "On Track Clients",
      value: stats.onTrackClients,
      icon: <FaChartLine />,
      gradient: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
      textColor: "#198754",
    },
    {
      title: "Need Attention",
      value: stats.needAttention,
      icon: <FaExclamationTriangle />,
      gradient: "linear-gradient(135deg, #fff8e1, #ffecb3)",
      textColor: "#ffc107",
    },
    {
      title: "Goal: Muscle Gain",
      value: stats.muscleGain,
      icon: <FaDumbbell />,
      gradient: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
      textColor: "#0dcaf0",
    },
    {
      title: "Goal: Weight Loss",
      value: stats.weightLoss,
      icon: <FaHeartbeat />,
      gradient: "linear-gradient(135deg, #ffebee, #ffcdd2)",
      textColor: "#dc3545",
    },
  ];

  const progress = stats.totalClients > 0 
    ? Math.round((stats.onTrackClients / stats.totalClients) * 100) 
    : 0;

  // Loading state
  if (loading) {
    return (
      <div className="trainer-dashboard min-vh-100 py-4 d-flex align-items-center justify-content-center">
        <Container>
          <div className="text-center">
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Loading dashboard data...</p>
          </div>
        </Container>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="trainer-dashboard min-vh-100 py-4">
        <Container>
          <Alert variant="danger" className="mt-4">
            <Alert.Heading>Error Loading Dashboard</Alert.Heading>
            <p>{error}</p>
            <hr />
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
      </div>
    );
  }

  return (
    <div className="trainer-dashboard min-vh-100 py-4">
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold text-secondary mb-1">{user?.fullName}'s Dashboard</h2>
            <p className="text-muted mb-0">
              Quick overview of your clients and their goals
            </p>
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
            {progress}% of your clients are on track with their goals.
          </p>
          <ProgressBar now={progress} variant="success" animated />
        </Card>

        {/* Need Attention List */}
        <Card className="border-0 shadow-sm mt-4 p-4">
          <h5 className="fw-bold text-danger mb-3">Clients Needing Attention</h5>
          <Row className="g-3">
            {["Rohit Sharma", "Sarah Johnson", "Mark Patel"].map((client, idx) => (
              <Col md={4} key={idx}>
                <Card className="border-0 shadow-sm p-3 h-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">{client}</h6>
                      <Badge bg="warning" text="dark">
                        Missed Check-in
                      </Badge>
                    </div>
                    <Button variant="outline-primary" size="sm">
                      View
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default TrainerDashboard;
