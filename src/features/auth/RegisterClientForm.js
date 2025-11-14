import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import Heading from "../../components/navigation/Heading";
import { registerClient, getClientsForTrainer } from "../../api/trainerAPI";
import Loader from "../../components/display/Loader";
import RazorpayPayment from "../payments/RazorpayPayment";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import {
  checkPaymentRequirement,
  recordClientAddition,
} from "../../utils/paymentStorage";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  FloatingLabel,
  Alert,
} from "react-bootstrap";
import { Eye, EyeClosed } from "lucide-react";

const RegisterClientForm = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    targetWeight: "",
    goal: "",
    gender: "",
  });

  // Check client count and payment requirement on component mount
  useEffect(() => {
    const checkClientCount = async () => {
      try {
        setCheckingPayment(true);
        const user = getDecryptedUser();
        const trainerId = user?.userId || user?.id;
        
        if (!trainerId) {
          setPaymentRequired(false);
          setPaymentCompleted(true);
          setCheckingPayment(false);
          return;
        }

        const clients = await getClientsForTrainer();
        const count = Array.isArray(clients) ? clients.length : 0;
        setClientCount(count);
        
        // Check payment requirement using payment storage utility
        const paymentCheck = checkPaymentRequirement(trainerId, count);
        
        setPaymentRequired(paymentCheck.paymentRequired);
        setPaymentCompleted(!paymentCheck.paymentRequired);
      } catch (error) {
        console.error("Error fetching client count:", error);
        // On error, allow registration (fail open)
        setPaymentRequired(false);
        setPaymentCompleted(true);
      } finally {
        setCheckingPayment(false);
      }
    };

    checkClientCount();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if payment is required and not completed
    if (paymentRequired && !paymentCompleted) {
      toast.current.show({
        severity: "warn",
        summary: "Payment Required",
        detail: "Please complete the payment of ₹500 to register this client.",
        life: 4000,
      });
      return;
    }

    const clientData = { ...formData, role: 0 };
    setLoading(true);

    try {
      const response = await registerClient(clientData);
      const user = getDecryptedUser();
      const trainerId = user?.userId || user?.id;
      
      // Record client addition in payment storage
      // This links the payment to the client if payment was made
      if (trainerId && response?.clientId) {
        recordClientAddition(
          trainerId,
          response.clientId,
          formData.fullName
        );
      }
      
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Client registered successfully!",
        life: 3000,
      });
      setTimeout(() => navigate(-1), 1000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          error?.response?.data?.message ||
          "Registration failed. Please try again.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    setPaymentCompleted(true);
    toast.current.show({
      severity: "success",
      summary: "Payment Verified",
      detail: "You can now register your client!",
      life: 3000,
    });
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    // Payment error is already handled in RazorpayPayment component
  };

  const handlePaymentCancel = () => {
    toast.current.show({
      severity: "info",
      summary: "Payment Cancelled",
      detail: "Payment was cancelled. Please complete payment to register client.",
      life: 3000,
    });
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      dateOfBirth: "",
      height: "",
      weight: "",
      targetWeight: "",
      goal: "",
      gender: "",
    });
  };
    
  if (checkingPayment) {
    return (
      <div className="page-container auth-page-enter">
        <Loader fullScreen text="Checking payment status..." color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div className="page-container auth-page-enter">
      {loading && <Loader fullScreen text="Registering client..." color="var(--color-primary)" />}
      <Toast ref={toast} position="top-right" />

      <div className="container">
        <Heading pageName="Register Client" sticky={true} />
        <div className="d-flex flex-column" style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}>
          <div className="flex-grow-1 overflow-auto">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="card content-wrapper card-health p-4">
                  {/* Payment Required Alert */}
                  {paymentRequired && !paymentCompleted && (
                    <Alert variant="warning" className="mb-4">
                      <Alert.Heading>
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Payment Required
                      </Alert.Heading>
                      <p className="mb-2">
                        You currently have <strong>{clientCount} client(s)</strong> registered. 
                        The first client is free. To add additional clients, please complete a payment of <strong>₹500 per client</strong>.
                      </p>
                      <p className="mb-3 text-muted small">
                        <i className="fas fa-info-circle me-2"></i>
                        This payment allows you to register one additional client.
                      </p>
                      <div className="d-flex justify-content-center mt-3">
                        <RazorpayPayment
                          amount={500}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          onCancel={handlePaymentCancel}
                        />
                      </div>
                    </Alert>
                  )}

                  {/* Payment Completed Success Message */}
                  {paymentRequired && paymentCompleted && (
                    <Alert variant="success" className="mb-4">
                      <i className="fas fa-check-circle me-2"></i>
                      Payment completed! You can now register your client.
                    </Alert>
                  )}
              {/* <div className="text-center mb-4">
                <div className="position-relative d-inline-block mb-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                       style={{ width: "80px", height: "80px" }}>
                    <FaBullseye size={40} className="text-white" />
                  </div>
                  <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle border border-2 border-success opacity-25 animate-pulse"></div>
                </div>
                <h3 className="fw-bold text-primary mb-2">Client Registration</h3>
                <p className="text-muted">
                  Add a new client to your health management system
                </p>
              </div> */}

              <Form onSubmit={handleSubmit} className="needs-validation">
                <Row className="gy-4">
                  {/* Personal Information Section */}
                  <Col xs={12}>
                    <div className="card card-stats p-3 mb-3">
                      <h5 className="fw-semibold text-primary mb-3">
                        <i className="fas fa-user me-2"></i>Personal Information
                      </h5>
                      <Row className="gy-3">
                        <Col md={6}>
                          <FloatingLabel label="Full Name" className="smooth-transition">
                            <Form.Control
                              type="text"
                              name="fullName"
                              placeholder="Full Name"
                              value={formData.fullName}
                              onChange={handleChange}
                              required
                              className="smooth-transition"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={6}>
                          <FloatingLabel label="Email Address" className="smooth-transition">
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="Email Address"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="smooth-transition"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={6}>
                          <FloatingLabel label="Phone Number" className="smooth-transition">
                            <Form.Control
                              type="tel"
                              name="phoneNumber"
                              placeholder="Phone Number"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              required
                              className="smooth-transition"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={6}>
                          <FloatingLabel label="Gender" className="smooth-transition">
                            <Form.Select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              required
                              className="smooth-transition"
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </Form.Select>
                          </FloatingLabel>
                        </Col>

                        <Col md={6}>
                          <FloatingLabel label="Date of Birth" className="smooth-transition">
                            <Form.Control
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              className="smooth-transition"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={6}>
            <FloatingLabel label="Password" className="position-relative smooth-transition">

               <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="password"
                 value={formData.password}
                onChange={handleChange}
                required
                className="form-control w-100 pe-5"
                style={{ paddingRight: "40px" }} // ensure text doesn't overlap icon
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute top-50 translate-middle-y border-0 bg-transparent"
                style={{ right: "10px" }} // 👈 ensures button stays inside right end
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>

           </FloatingLabel>
                        </Col>
                      </Row>
                    </div>
                  </Col>

                  {/* Health Information Section */}
                  <Col xs={12}>
                    <div className="card card-info p-3 mb-3">
                      <h5 className="fw-semibold text-info mb-3">
                        <i className="fas fa-heartbeat me-2"></i>Health Information
                      </h5>
                      <Row className="gy-3">
                        <Col md={4}>
                          <FloatingLabel label="Height (cm)" className="smooth-transition">
                            <Form.Control
                              type="number"
                              name="height"
                              placeholder="Height"
                              value={formData.height}
                              onChange={handleChange}
                              className="smooth-transition"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={4}>
                          <FloatingLabel label="Current Weight (kg)" className="smooth-transition">
                            <Form.Control
                              type="number"
                              name="weight"
                              placeholder="Current Weight"
                              value={formData.weight}
                              onChange={handleChange}
                              className="smooth-transition"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={4}>
                          <FloatingLabel label="Target Weight (kg)" className="smooth-transition">
                            <Form.Control
                              type="number"
                              name="targetWeight"
                              placeholder="Target Weight"
                              value={formData.targetWeight}
                              onChange={handleChange}
                              className="smooth-transition"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={6}>
                          <FloatingLabel label="Fitness Goal" className="smooth-transition">
                            <Form.Select
                              name="goal"
                              value={formData.goal}
                              onChange={handleChange}
                              required
                              className="smooth-transition"
                            >
                              <option value="">Select fitness goal</option>
                              <option value={0}>Muscle Gain</option>
                              <option value={1}>Fat Loss</option>
                            </Form.Select>
                          </FloatingLabel>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>

                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-5 fw-bold smooth-transition me-3"
                    disabled={loading || (paymentRequired && !paymentCompleted)}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Registering...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Register Client
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="px-4 smooth-transition"
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <i className="fas fa-undo me-2"></i>
                    Reset Form
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterClientForm;
