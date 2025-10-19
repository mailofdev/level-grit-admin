import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import Heading from "../../components/navigation/Heading";
import { RegisterClient } from "../../api/authAPI";
import Loader from "../../components/display/Loader";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  FloatingLabel,
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaWeight,
  FaBullseye,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const RegisterClientForm = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      await RegisterClient(clientData);
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

  const handleCancel = () =>
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

  return (
    <div className="page-container auth-page-enter">
      {loading && <Loader fullScreen text="Registering client..." color="var(--color-primary)" />}
      <Toast ref={toast} position="top-right" />

      <div className="container">
          <Heading pageName="Register Client" sticky={true} />
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="card content-wrapper card-health p-4">
              <div className="text-center mb-4">
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
              </div>

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
                              placeholder="Password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              minLength={6}
                              style={{ paddingRight: "2.5rem" }}
                              className="smooth-transition"
                            />
                            <Button
                              variant="link"
                              type="button"
                              className="position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-muted"
                              onClick={() => setShowPassword(!showPassword)}
                              tabIndex={-1}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
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
                    size="lg"
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
                    size="lg"
                    className="px-4 smooth-transition"
                    type="button"
                    onClick={handleCancel}
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
  );
};

export default RegisterClientForm;
