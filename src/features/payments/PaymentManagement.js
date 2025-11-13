import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner } from "react-bootstrap";
import { Toast } from "primereact/toast";
import { getAllPayments } from "../../services/paymentService";
import Heading from "../../components/navigation/Heading";
import { FaRupeeSign, FaUsers, FaMoneyBillWave, FaSync } from "react-icons/fa";
import { motion } from "framer-motion";
import { Timestamp } from "firebase/firestore";

/**
 * Payment Management Component
 * Admin view to see all trainers and their payment records from Firestore
 */
export default function PaymentManagement() {
  const toast = useRef(null);
  const [trainerPayments, setTrainerPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const payments = await getAllPayments();
      
      // Filter only successful payments for statistics
      const successfulPayments = payments.filter(
        p => p.status === 'success' || p.status === 'Success'
      );
      
      setAllPayments(successfulPayments);
      
      // Group payments by trainer
      const paymentsByTrainer = groupPaymentsByTrainer(successfulPayments);
      setTrainerPayments(paymentsByTrainer);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to load payment records",
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
    setRefreshing(false);
    toast.current?.show({
      severity: "success",
      summary: "Refreshed",
      detail: "Payment records updated",
      life: 2000,
    });
  };

  const groupPaymentsByTrainer = (payments) => {
    const trainerMap = {};
    
    payments.forEach((payment) => {
      const userId = payment.userId;
      if (!userId) return;
      
      if (!trainerMap[userId]) {
        trainerMap[userId] = {
          trainerId: userId,
          trainerName: payment.userName || "Unknown Trainer",
          trainerEmail: payment.userEmail || "",
          totalPayments: 0,
          totalAmount: 0,
          payments: [],
          lastPaymentDate: null,
        };
      }
      
      trainerMap[userId].totalPayments += 1;
      trainerMap[userId].totalAmount += payment.amount || 0;
      trainerMap[userId].payments.push(payment);
      
      // Update last payment date
      const paymentDate = getPaymentDate(payment.paymentDate);
      if (
        !trainerMap[userId].lastPaymentDate ||
        paymentDate > new Date(trainerMap[userId].lastPaymentDate)
      ) {
        trainerMap[userId].lastPaymentDate = paymentDate.toISOString();
      }
    });
    
    return Object.values(trainerMap);
  };

  const getPaymentDate = (dateValue) => {
    if (!dateValue) return new Date();
    
    // Handle Firestore Timestamp
    if (dateValue instanceof Timestamp) {
      return dateValue.toDate();
    }
    
    // Handle Firestore Timestamp object
    if (dateValue?.seconds) {
      return new Date(dateValue.seconds * 1000);
    }
    
    // Handle ISO string or Date
    return new Date(dateValue);
  };

  const handleViewDetails = (trainerId) => {
    if (selectedTrainer === trainerId) {
      setSelectedTrainer(null);
    } else {
      setSelectedTrainer(trainerId);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    
    const date = getPaymentDate(dateValue);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotalRevenue = () => {
    return trainerPayments.reduce((sum, trainer) => sum + (trainer.totalAmount || 0), 0);
  };

  const totalTrainers = trainerPayments.length;
  const totalPayments = allPayments.length;
  const totalRevenue = calculateTotalRevenue();

  if (loading) {
    return (
      <div className="page-container" style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
        <Container fluid className="py-4">
          <Heading pageName="Payment Management" sticky={true} />
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <div className="text-center">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading payment records...</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      <Toast ref={toast} position="top-right" />
      <Container fluid className="py-4">
        <Heading pageName="Payment Management" sticky={true} />

        {/* Summary Cards */}
        <Row className="g-3 mb-4">
          <Col md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      <FaUsers size={24} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Trainers</h6>
                      <h3 className="mb-0 fw-bold">{totalTrainers}</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      }}
                    >
                      <FaMoneyBillWave size={24} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Payments</h6>
                      <h3 className="mb-0 fw-bold">{totalPayments}</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      }}
                    >
                      <FaRupeeSign size={24} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Revenue</h6>
                      <h3 className="mb-0 fw-bold">₹{totalRevenue.toLocaleString("en-IN")}</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Trainers and Payments Table */}
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              <i className="fas fa-list me-2"></i>
              Trainers & Payment Records
            </h5>
            <div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <FaSync className="me-1" />
                    Refresh
                  </>
                )}
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {trainerPayments.length === 0 ? (
              <Alert variant="info" className="text-center">
                <i className="fas fa-info-circle me-2"></i>
                No payment records found. Payments will appear here when trainers make payments.
              </Alert>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Trainer Name</th>
                      <th>Email</th>
                      <th className="text-center">Total Payments</th>
                      <th className="text-end">Total Amount</th>
                      <th className="text-center">Last Payment</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainerPayments.map((trainer) => (
                      <React.Fragment key={trainer.trainerId}>
                        <tr
                          style={{ cursor: "pointer" }}
                          onClick={() => handleViewDetails(trainer.trainerId)}
                        >
                          <td className="fw-semibold">{trainer.trainerName}</td>
                          <td>{trainer.trainerEmail || "N/A"}</td>
                          <td className="text-center">
                            <Badge bg="primary">{trainer.totalPayments}</Badge>
                          </td>
                          <td className="text-end fw-bold text-success">
                            ₹{trainer.totalAmount.toLocaleString("en-IN")}
                          </td>
                          <td className="text-center">
                            {formatDate(trainer.lastPaymentDate)}
                          </td>
                          <td className="text-center">
                            <Button
                              variant="link"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(trainer.trainerId);
                              }}
                            >
                              {selectedTrainer === trainer.trainerId ? (
                                <i className="fas fa-chevron-up"></i>
                              ) : (
                                <i className="fas fa-chevron-down"></i>
                              )}
                            </Button>
                          </td>
                        </tr>
                        {selectedTrainer === trainer.trainerId && (
                          <tr>
                            <td colSpan={6} className="p-0">
                              <Card className="m-3 border">
                                <Card.Header className="bg-light">
                                  <h6 className="mb-0">
                                    <i className="fas fa-receipt me-2"></i>
                                    Payment Details for {trainer.trainerName}
                                  </h6>
                                </Card.Header>
                                <Card.Body>
                                  <Table size="sm" className="mb-0">
                                    <thead>
                                      <tr>
                                        <th>Payment ID</th>
                                        <th>Order ID</th>
                                        <th>Status</th>
                                        <th className="text-end">Amount</th>
                                        <th>Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {trainer.payments
                                        .sort(
                                          (a, b) =>
                                            getPaymentDate(b.paymentDate) -
                                            getPaymentDate(a.paymentDate)
                                        )
                                        .map((payment) => (
                                          <tr key={payment.id}>
                                            <td>
                                              <code className="small">
                                                {payment.paymentId
                                                  ? payment.paymentId.substring(0, 20) + "..."
                                                  : "N/A"}
                                              </code>
                                            </td>
                                            <td>
                                              <code className="small">
                                                {payment.orderId
                                                  ? payment.orderId.substring(0, 20) + "..."
                                                  : "N/A"}
                                              </code>
                                            </td>
                                            <td>
                                              {payment.status === 'success' || payment.status === 'Success' ? (
                                                <Badge bg="success">Verified</Badge>
                                              ) : (
                                                <Badge bg="warning">{payment.status || 'Unknown'}</Badge>
                                              )}
                                            </td>
                                            <td className="text-end fw-semibold">
                                              ₹{payment.amount || 0}
                                            </td>
                                            <td>{formatDate(payment.paymentDate)}</td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </Table>
                                </Card.Body>
                              </Card>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
