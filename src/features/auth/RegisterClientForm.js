import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import Heading from "../../components/navigation/Heading";
import { registerClient, getClientsForTrainer } from "../../api/trainerAPI";
import Loader from "../../components/display/Loader";
import PaymentPopup from "../../components/payments/PaymentPopup";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import {
  Form,
  Button,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";
import { Eye, EyeClosed } from "lucide-react";

const RegisterClientForm = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [newClientId, setNewClientId] = useState(null);
  const [newClientName, setNewClientName] = useState("");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientData = { ...formData, role: 0 };
    setLoading(true);

    try {
      // Register client - backend will create client and return response
      const response = await registerClient(clientData);
      console.log("Register client response:", response);
      
      // Extract client ID - check multiple possible fields
      const clientId = response?.clientId 
        || response?.id 
        || response?.userId 
        || response?.data?.clientId
        || response?.data?.id;
      
      if (!clientId) {
        console.error("No client ID in response:", response);
        throw new Error("Client ID not received from server. Response: " + JSON.stringify(response));
      }

      // Check IsSubscriptionPaid status from backend response
      // Backend should set IsSubscriptionPaid = false for 2nd+ clients (requiring payment)
      // Backend should set IsSubscriptionPaid = true for 1st client (free)
      let IsSubscriptionPaid = response?.IsSubscriptionPaid;
      
      // Check nested structures
      if (IsSubscriptionPaid === undefined && response?.userInfo) {
        IsSubscriptionPaid = response.userInfo.IsSubscriptionPaid;
      }
      if (IsSubscriptionPaid === undefined && response?.data) {
        IsSubscriptionPaid = response.data.IsSubscriptionPaid;
      }
      
      // If IsSubscriptionPaid is still undefined, check client count as fallback
      if (IsSubscriptionPaid === undefined) {
        console.warn("IsSubscriptionPaid not in response, checking client count as fallback");
        try {
          const clients = await getClientsForTrainer();
          const clientCount = Array.isArray(clients) ? clients.length : 0;
          // If count > 1, this is 2nd+ client (needs payment, so IsSubscriptionPaid = false)
          IsSubscriptionPaid = clientCount <= 1; // First client is active, 2nd+ is inactive
          console.log("Determined IsSubscriptionPaid from client count:", IsSubscriptionPaid, "Count:", clientCount);
        } catch (countError) {
          console.error("Error fetching client count:", countError);
          // Default to true if we can't determine
          IsSubscriptionPaid = true;
        }
      }

      console.log("Final IsSubscriptionPaid status:", IsSubscriptionPaid, "ClientId:", clientId);

      // If client is not active (IsSubscriptionPaid === false), show payment popup
      if (IsSubscriptionPaid === false) {
        setNewClientId(clientId);
        setNewClientName(formData.fullName);
        setShowPaymentPopup(true);
        
        toast.current.show({
          severity: "success",
          summary: "Client Registered",
          detail: "Client registered successfully! Please complete payment to enable services.",
          life: 4000,
        });
      } else {
        // First client or already active - no payment needed
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Client registered successfully!",
          life: 3000,
        });
        setTimeout(() => navigate(-1), 1000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error?.response);
      
      // More detailed error message
      const errorMessage = error?.response?.data?.message 
        || error?.response?.data?.error
        || error?.message 
        || "Registration failed. Please try again.";
      
      toast.current.show({
        severity: "error",
        summary: "Registration Error",
        detail: errorMessage,
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    toast.current.show({
      severity: "success",
      summary: "Payment Successful",
      detail: "Client services have been activated successfully!",
      life: 3000,
    });
    
    // Close popup and navigate back
    setShowPaymentPopup(false);
    setTimeout(() => navigate(-1), 1500);
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
  return (
    <div className="page-container auth-page-enter">
      {loading && <Loader fullScreen text="Registering client..." color="var(--color-primary)" />}
      <Toast ref={toast} position="top-right" />

      {/* Payment Popup */}
      <PaymentPopup
        show={showPaymentPopup}
        onHide={() => {
          setShowPaymentPopup(false);
          // After closing popup (payment skipped), navigate back
          setTimeout(() => navigate(-1), 500);
        }}
        onSuccess={handlePaymentSuccess}
        clientId={newClientId}
        clientName={newClientName}
        amount={500}
      />

      <div className="container">
        <Heading pageName="Register Client" sticky={true} />
        <div className="d-flex flex-column" style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}>
          <div className="flex-grow-1 overflow-auto">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="card content-wrapper card-health p-4">

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
                    disabled={loading}
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
