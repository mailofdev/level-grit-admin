import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    trainerType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        trainerType: ''
      });
    }, 2000);
  };

  return (
    <div className="page-container">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Card className="content-wrapper card-health">
              <Card.Header className="text-center py-4">
                <h1 className="fw-bold text-primary mb-3">
                  <i className="fas fa-envelope me-3"></i>
                  Contact Us
                </h1>
                <p className="text-muted mb-0">Get in touch with our support team</p>
              </Card.Header>
              
              <Card.Body className="p-4">
                <Row className="g-4">
                  {/* Contact Form */}
                  <Col lg={8}>
                    <div className="mb-4">
                      <h3 className="fw-bold text-primary mb-3">Send us a Message</h3>
                      <p className="text-muted">
                        Have questions about our platform? Need technical support? We're here to help! 
                        Fill out the form below and we'll get back to you within 24 hours.
                      </p>
                    </div>

                    {submitStatus === 'success' && (
                      <Alert variant="success" className="mb-4">
                        <i className="fas fa-check-circle me-2"></i>
                        Thank you for your message! We'll get back to you soon.
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-user text-primary me-2"></i>Full Name *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="smooth-transition"
                              placeholder="Enter your full name"
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-envelope text-primary me-2"></i>Email Address *
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="smooth-transition"
                              placeholder="Enter your email"
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-tag text-primary me-2"></i>Subject *
                            </Form.Label>
                            <Form.Select
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              required
                              className="smooth-transition"
                            >
                              <option value="">Select a subject</option>
                              <option value="technical">Technical Support</option>
                              <option value="billing">Billing & Payments</option>
                              <option value="feature">Feature Request</option>
                              <option value="partnership">Partnership Inquiry</option>
                              <option value="general">General Question</option>
                              <option value="other">Other</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-dumbbell text-primary me-2"></i>Trainer Type
                            </Form.Label>
                            <Form.Select
                              name="trainerType"
                              value={formData.trainerType}
                              onChange={handleChange}
                              className="smooth-transition"
                            >
                              <option value="">Select your specialty</option>
                              <option value="personal">Personal Trainer</option>
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
                              <i className="fas fa-comment text-primary me-2"></i>Message *
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={5}
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                              className="smooth-transition"
                              placeholder="Please describe your question or issue in detail..."
                            />
                          </Form.Group>
                        </Col>

                        <Col xs={12}>
                          <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="smooth-transition"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
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

                  {/* Contact Information */}
                  <Col lg={4}>
                    <div className="card card-info p-4 h-100">
                      <h4 className="fw-bold text-info mb-4">
                        <i className="fas fa-info-circle me-2"></i>
                        Get in Touch
                      </h4>

                      <div className="mb-4">
                        <h5 className="fw-semibold text-primary mb-2">
                          <i className="fas fa-phone me-2"></i>Phone Support
                        </h5>
                        <p className="text-muted mb-1">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                        <p className="text-muted mb-0">+1 (555) 123-4567</p>
                      </div>

                      <div className="mb-4">
                        <h5 className="fw-semibold text-primary mb-2">
                          <i className="fas fa-envelope me-2"></i>Email Support
                        </h5>
                        <p className="text-muted mb-1">General Inquiries</p>
                        <p className="text-muted mb-1">support@levelgrit.com</p>
                        <p className="text-muted mb-1">Technical Issues</p>
                        <p className="text-muted mb-0">tech@levelgrit.com</p>
                      </div>

                      <div className="mb-4">
                        <h5 className="fw-semibold text-primary mb-2">
                          <i className="fas fa-map-marker-alt me-2"></i>Office Address
                        </h5>
                        <p className="text-muted mb-0">
                          123 Fitness Street<br />
                          Health City, HC 12345<br />
                          United States
                        </p>
                      </div>

                      <div className="mb-4">
                        <h5 className="fw-semibold text-primary mb-2">
                          <i className="fas fa-clock me-2"></i>Response Time
                        </h5>
                        <p className="text-muted mb-0">
                          We typically respond to all inquiries within 24 hours during business days.
                        </p>
                      </div>

                      <div>
                        <h5 className="fw-semibold text-primary mb-2">
                          <i className="fas fa-headset me-2"></i>Live Chat
                        </h5>
                        <p className="text-muted mb-2">
                          Available Monday - Friday, 9:00 AM - 5:00 PM EST
                        </p>
                        <Button variant="outline-info" size="sm" className="smooth-transition">
                          <i className="fas fa-comments me-2"></i>
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* FAQ Section */}
                <div className="mt-5">
                  <h3 className="fw-bold text-primary mb-4">
                    <i className="fas fa-question-circle me-2"></i>
                    Frequently Asked Questions
                  </h3>
                  
                  <Row className="g-4">
                    <Col md={6}>
                      <div className="card card-stats p-3">
                        <h5 className="fw-semibold text-primary mb-2">How do I get started?</h5>
                        <p className="text-muted small">
                          Simply sign up for an account, complete your trainer profile, and start adding clients. 
                          Our onboarding process will guide you through each step.
                        </p>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="card card-stats p-3">
                        <h5 className="fw-semibold text-primary mb-2">What payment methods do you accept?</h5>
                        <p className="text-muted small">
                          We accept all major credit cards, PayPal, and bank transfers. 
                          All payments are processed securely through our payment partners.
                        </p>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="card card-stats p-3">
                        <h5 className="fw-semibold text-primary mb-2">Is my client data secure?</h5>
                        <p className="text-muted small">
                          Yes, we use enterprise-grade encryption and comply with HIPAA regulations 
                          to ensure your client data is always protected.
                        </p>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="card card-stats p-3">
                        <h5 className="fw-semibold text-primary mb-2">Can I cancel my subscription anytime?</h5>
                        <p className="text-muted small">
                          Yes, you can cancel your subscription at any time. 
                          You'll continue to have access until the end of your billing period.
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
