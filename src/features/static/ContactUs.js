import React, { useState } from "react";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import Heading from "../../components/navigation/Heading";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    trainerType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        trainerType: "",
      });
    }, 2000);
  };

  return (
    <div className="container py-3">
      <Heading pageName="Contact Us" />
      <div
        className="d-flex flex-column"
        style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}
      >
        <div className="flex-grow-1 overflow-auto">
          <Row className="justify-content-center">
            <Col>
              <Card className="border-0 shadow-sm rounded-4 mb-3">
                <Card.Body className="p-4">
                  {/* Intro */}
                  <div className="mb-4 border-bottom border-2 border-dashed pb-3">
                    <h5 className="text-secondary mb-2">
                      We’re always happy to hear from you! Whether you have
                      questions about{" "}
                      <span className="fw-bold text-primary">Level Grit</span>,
                      need help, or just want to share feedback, our team is
                      here to assist.
                    </h5>
                  </div>

                  <Row className="g-4">
                    {/* Contact Form */}
                    <Col lg={8}>
                      <div className="mb-3 pb-3 border-bottom border-dashed">
                        <h3 className="fw-bold text-primary mb-2">
                          <i className="fas fa-paper-plane me-2"></i>
                          Send us a Message
                        </h3>
                        <p className="text-muted">
                          Fill out the form below — we usually respond within 24
                          hours on business days.
                        </p>
                      </div>

                      {submitStatus === "success" && (
                        <Alert variant="success" className="mb-4">
                          <i className="fas fa-check-circle me-2"></i>
                          Thank you for your message! We’ll get back to you
                          soon.
                        </Alert>
                      )}

                      <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">
                                <i className="fas fa-user text-primary me-2"></i>
                                Full Name *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">
                                <i className="fas fa-envelope text-primary me-2"></i>
                                Email Address *
                              </Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">
                                <i className="fas fa-tag text-primary me-2"></i>
                                Subject *
                              </Form.Label>
                              <Form.Select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Select a subject</option>
                                <option value="technical">
                                  Technical Support
                                </option>
                                <option value="billing">
                                  Billing & Payments
                                </option>
                                <option value="feature">
                                  Feature Request
                                </option>
                                <option value="partnership">
                                  Partnership Inquiry
                                </option>
                                <option value="general">
                                  General Question
                                </option>
                                <option value="other">Other</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">
                                <i className="fas fa-dumbbell text-primary me-2"></i>
                                Trainer Type
                              </Form.Label>
                              <Form.Select
                                name="trainerType"
                                value={formData.trainerType}
                                onChange={handleChange}
                              >
                                <option value="">Select your specialty</option>
                                <option value="personal">
                                  Personal Trainer
                                </option>
                                <option value="nutrition">Nutritionist</option>
                                <option value="strength">Strength Coach</option>
                                <option value="cardio">Cardio Specialist</option>
                                <option value="yoga">Yoga Instructor</option>
                                <option value="other">Other</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>

                          <Col xs={12}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">
                                <i className="fas fa-comment text-primary me-2"></i>
                                Message *
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={5}
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="Please describe your question or issue in detail..."
                              />
                            </Form.Group>
                          </Col>

                          <Col xs={12}>
                            <Button
                              type="submit"
                              variant="primary"
                              size="lg"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                  ></span>
                                  Sending Message...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-paper-plane me-2"></i>
                                  Send Message
                                </>
                              )}
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Col>

                    {/* Contact Info */}
                    <Col lg={4}>
                      <div className="bg-light p-4 rounded-3 border-start border-4 border-primary h-100">
                        <h4 className="fw-bold text-primary mb-3">
                          <i className="fas fa-headset me-2"></i>Get in Touch
                        </h4>

                        <div className="mb-4 pb-3 border-bottom border-dashed">
                          <h6 className="fw-semibold text-dark">
                            <i className="fas fa-phone me-2 text-primary"></i>
                            Phone Support
                          </h6>
                          <p className="text-muted small mb-1">
                            Mon–Fri: 9:00 AM - 6:00 PM EST
                          </p>
                          <p className="text-muted small mb-0">
                            +1 (555) 123-4567
                          </p>
                        </div>

                        <div className="mb-4 pb-3 border-bottom border-dashed">
                          <h6 className="fw-semibold text-dark">
                            <i className="fas fa-envelope me-2 text-primary"></i>
                            Email Support
                          </h6>
                          <p className="text-muted small mb-1">
                            General: support@levelgrit.com
                          </p>
                          <p className="text-muted small mb-0">
                            Technical: tech@levelgrit.com
                          </p>
                        </div>

                        <div className="mb-4 pb-3 border-bottom border-dashed">
                          <h6 className="fw-semibold text-dark">
                            <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                            Office Address
                          </h6>
                          <p className="text-muted small mb-0">
                            123 Fitness Street <br />
                            Health City, HC 12345 <br />
                            United States
                          </p>
                        </div>

                        <div>
                          <h6 className="fw-semibold text-dark">
                            <i className="fas fa-clock me-2 text-primary"></i>
                            Response Time
                          </h6>
                          <p className="text-muted small mb-0">
                            We typically reply within 24 hours during business
                            days.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* FAQ Section */}
                  <div className="mt-5">
                    <h3 className="fw-bold text-primary mb-4">
                      <i className="fas fa-question-circle me-2"></i>Frequently
                      Asked Questions
                    </h3>

                    <Row className="g-4">
                      {[
                        {
                          q: "How do I get started?",
                          a: "Sign up for an account, complete your trainer profile, and begin adding clients. Our onboarding will guide you step-by-step.",
                        },
                        {
                          q: "What payment methods do you accept?",
                          a: "We accept major credit cards, PayPal, and bank transfers. Payments are securely processed.",
                        },
                        {
                          q: "Is my client data secure?",
                          a: "Yes, we use enterprise-grade encryption and comply with privacy laws to protect your data.",
                        },
                        {
                          q: "Can I cancel my subscription anytime?",
                          a: "Yes, you can cancel anytime. You’ll retain access until the end of your billing period.",
                        },
                      ].map((faq, index) => (
                        <Col md={6} key={index}>
                          <div className="p-3 border-bottom border-dashed">
                            <h6 className="fw-semibold text-primary mb-2">
                              {faq.q}
                            </h6>
                            <p className="text-muted small mb-0">{faq.a}</p>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
