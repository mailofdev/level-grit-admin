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
    <div className="container py-4">
      {loading && <Loader fullScreen text="Registering client..." color="#28a745" />}
      <Toast ref={toast} position="top-right" />

      <Heading pageName="Register Client" sticky={true} />

      <Card className="shadow-lg border-0 mt-3" style={{ borderRadius: "1rem" }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h4 className="fw-bold text-success">
              <FaBullseye className="me-2" /> Client Registration
            </h4>
            <p className="text-muted mb-0">
              Fill in the details below to register a new client
            </p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Row className="gy-3">
              <Col md={6}>
                <FloatingLabel label="Full Name">
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </FloatingLabel>
              </Col>

              <Col md={6}>
                <FloatingLabel label="Email">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FloatingLabel>
              </Col>

              {/* Password field with eye toggle */}
              <Col md={6}>
                <FloatingLabel label="Password" className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <Button
                    variant="link"
                    type="button"
                    className="position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </FloatingLabel>
              </Col>

              <Col md={6}>
                <FloatingLabel label="Phone Number">
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </FloatingLabel>
              </Col>

              <Col md={6}>
                <FloatingLabel label="Date of Birth">
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>

              <Col md={6}>
                <FloatingLabel label="Height (cm)">
                  <Form.Control
                    type="number"
                    name="height"
                    placeholder="Height"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>

              <Col md={4}>
                <FloatingLabel label="Weight (kg)">
                  <Form.Control
                    type="number"
                    name="weight"
                    placeholder="Weight"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>

              <Col md={4}>
                <FloatingLabel label="Target Weight (kg)">
                  <Form.Control
                    type="number"
                    name="targetWeight"
                    placeholder="Target Weight"
                    value={formData.targetWeight}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>

              <Col md={4}>
                <FloatingLabel label="Goal">
                  <Form.Select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select goal</option>
                    <option value={0}>Muscle Gain</option>
                    <option value={1}>Fat Loss</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>

              <Col md={6}>
                <FloatingLabel label="Gender">
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Button
                type="submit"
                variant="success"
                className="px-5 fw-bold"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Client"}
              </Button>
              <Button
                variant="outline-secondary"
                className="ms-3 px-4"
                type="button"
                onClick={handleCancel}
              >
                Reset
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterClientForm;
