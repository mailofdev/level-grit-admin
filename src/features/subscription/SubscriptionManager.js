import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Table, ProgressBar } from 'react-bootstrap';
import { FaCreditCard, FaCrown, FaCheck, FaTimes, FaCalendar, FaDownload, FaBell, FaShieldAlt, FaUsers, FaUtensils, FaChartLine } from 'react-icons/fa';

const SubscriptionManager = () => {
  const [subscription, setSubscription] = useState(null);
  const [clients, setClients] = useState([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setSubscription({
      plan: 'Professional',
      status: 'active',
      billingCycle: 'monthly',
      price: 59,
      nextBillingDate: '2024-02-20',
      clientLimit: 50,
      currentClients: 24,
      features: [
        'Up to 50 clients',
        'Advanced meal planning',
        'Detailed analytics',
        'Video messaging',
        'Priority support',
        'Custom branding'
      ],
      usage: {
        clients: 24,
        mealPlans: 45,
        messages: 1200,
        storage: 2.5 // GB
      }
    });

    setClients([
      { id: 1, name: 'Sarah Johnson', status: 'active', joinedDate: '2024-01-15', plan: 'Premium' },
      { id: 2, name: 'Mike Chen', status: 'active', joinedDate: '2024-01-10', plan: 'Standard' },
      { id: 3, name: 'Emily Davis', status: 'active', joinedDate: '2024-01-20', plan: 'Premium' },
      { id: 4, name: 'David Wilson', status: 'paused', joinedDate: '2024-01-05', plan: 'Standard' }
    ]);
  }, []);

  const plans = [
    {
      name: 'Starter',
      price: 29,
      clientLimit: 10,
      features: [
        'Up to 10 clients',
        'Basic meal planning',
        'Progress tracking',
        'Client messaging',
        'Email support'
      ],
      current: subscription?.plan === 'Starter'
    },
    {
      name: 'Professional',
      price: 59,
      clientLimit: 50,
      features: [
        'Up to 50 clients',
        'Advanced meal planning',
        'Detailed analytics',
        'Video messaging',
        'Priority support',
        'Custom branding'
      ],
      current: subscription?.plan === 'Professional',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99,
      clientLimit: -1, // unlimited
      features: [
        'Unlimited clients',
        'White-label solution',
        'API access',
        'Team management',
        '24/7 phone support',
        'Custom integrations'
      ],
      current: subscription?.plan === 'Enterprise'
    }
  ];

  const handleUpgrade = (planName) => {
    // Upgrade to plan
    setShowUpgradeModal(false);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    // Process payment logic here
    // Processing payment
    setShowPaymentModal(false);
    // Update subscription status
  };

  const getUsagePercentage = (current, limit) => {
    if (limit === -1) return 0; // unlimited
    return (current / limit) * 100;
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  return (
    <div className="page-container">
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="fw-bold text-primary mb-1">Subscription Management</h1>
                <p className="text-muted mb-0">Manage your subscription and billing preferences</p>
              </div>
              <Button 
                variant="outline-primary" 
                className="smooth-transition"
                onClick={() => setShowUpgradeModal(true)}
              >
                <FaCrown className="me-2" />
                Upgrade Plan
              </Button>
            </div>
          </Col>
        </Row>

        {subscription && (
          <>
            {/* Current Plan Overview */}
            <Row className="g-4 mb-4">
              <Col lg={8}>
                <Card className="content-wrapper card-health hover-shadow smooth-transition">
                  <Card.Header className="bg-transparent border-0 p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h4 className="fw-bold text-primary mb-1">
                          <FaCrown className="me-2" />
                          {subscription.plan} Plan
                        </h4>
                        <Badge bg="success" className="me-2">{subscription.status}</Badge>
                        <span className="text-muted">Billed {subscription.billingCycle}</span>
                      </div>
                      <div className="text-end">
                        <h3 className="fw-bold text-primary mb-0">${subscription.price}</h3>
                        <small className="text-muted">per month</small>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4 pt-0">
                    <Row className="g-4">
                      <Col md={6}>
                        <h6 className="fw-bold text-primary mb-3">Plan Features</h6>
                        <ul className="list-unstyled">
                          {subscription.features.map((feature, index) => (
                            <li key={index} className="mb-2">
                              <FaCheck className="text-success me-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h6 className="fw-bold text-primary mb-3">Usage Statistics</h6>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="small">Clients</span>
                            <span className="small">
                              {subscription.usage.clients} / {subscription.clientLimit === -1 ? '∞' : subscription.clientLimit}
                            </span>
                          </div>
                          <ProgressBar 
                            variant={getUsageColor(getUsagePercentage(subscription.usage.clients, subscription.clientLimit))}
                            now={getUsagePercentage(subscription.usage.clients, subscription.clientLimit)}
                            style={{height: '6px'}}
                          />
                        </div>
                        <div className="row g-2 small">
                          <Col xs={6}>
                            <div className="bg-light p-2 rounded text-center">
                              <FaUtensils className="text-success mb-1" />
                              <div className="fw-bold">{subscription.usage.mealPlans}</div>
                              <div className="text-muted">Meal Plans</div>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="bg-light p-2 rounded text-center">
                              <FaChartLine className="text-info mb-1" />
                              <div className="fw-bold">{subscription.usage.messages}</div>
                              <div className="text-muted">Messages</div>
                            </div>
                          </Col>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="content-wrapper card-stats hover-shadow smooth-transition">
                  <Card.Header className="bg-transparent border-0 p-4">
                    <h5 className="fw-bold text-primary mb-0">
                      <FaCalendar className="me-2" />
                      Billing Information
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4 pt-0">
                    <div className="mb-3">
                      <h6 className="fw-bold">Next Billing Date</h6>
                      <p className="text-muted mb-0">
                        {new Date(subscription.nextBillingDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mb-3">
                      <h6 className="fw-bold">Payment Method</h6>
                      <div className="d-flex align-items-center">
                        <FaCreditCard className="text-primary me-2" />
                        <span>**** **** **** 4242</span>
                      </div>
                    </div>
                    <div className="d-grid gap-2">
                      <Button variant="outline-primary" size="sm">
                        <FaCreditCard className="me-2" />
                        Update Payment Method
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <FaDownload className="me-2" />
                        Download Invoice
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Client Subscriptions */}
            <Row className="mb-4">
              <Col>
                <Card className="content-wrapper hover-shadow smooth-transition">
                  <Card.Header className="bg-transparent border-0 p-4">
                    <h4 className="fw-bold text-primary mb-0">
                      <FaUsers className="me-2" />
                      Client Subscriptions
                    </h4>
                  </Card.Header>
                  <Card.Body className="p-4 pt-0">
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Client Name</th>
                            <th>Plan</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clients.map((client) => (
                            <tr key={client.id} className="hover-lift smooth-transition">
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                                    {client.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span className="fw-semibold">{client.name}</span>
                                </div>
                              </td>
                              <td>
                                <Badge bg="info">{client.plan}</Badge>
                              </td>
                              <td>
                                <Badge bg={client.status === 'active' ? 'success' : 'warning'}>
                                  {client.status}
                                </Badge>
                              </td>
                              <td>
                                <small className="text-muted">
                                  {new Date(client.joinedDate).toLocaleDateString()}
                                </small>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button variant="outline-primary" size="sm">
                                    <FaBell />
                                  </Button>
                                  <Button variant="outline-success" size="sm">
                                    <FaCheck />
                                  </Button>
                                  <Button variant="outline-danger" size="sm">
                                    <FaTimes />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* Security & Compliance */}
        <Row>
          <Col>
            <Card className="content-wrapper card-info hover-shadow smooth-transition">
              <Card.Header className="bg-transparent border-0 p-4">
                <h4 className="fw-bold text-info mb-0">
                  <FaShieldAlt className="me-2" />
                  Security & Compliance
                </h4>
              </Card.Header>
              <Card.Body className="p-4 pt-0">
                <Row className="g-4">
                  <Col md={4}>
                    <div className="text-center">
                      <FaShieldAlt size={48} className="text-info mb-3" />
                      <h6 className="fw-bold">HIPAA Compliant</h6>
                      <p className="text-muted small">Your client data is protected with enterprise-grade security</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center">
                      <FaCreditCard size={48} className="text-success mb-3" />
                      <h6 className="fw-bold">Secure Payments</h6>
                      <p className="text-muted small">All payments are processed securely through Stripe</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center">
                      <FaDownload size={48} className="text-warning mb-3" />
                      <h6 className="fw-bold">Data Export</h6>
                      <p className="text-muted small">Export your data anytime with our data portability tools</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Upgrade Plan Modal */}
      <Modal show={showUpgradeModal} onHide={() => setShowUpgradeModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCrown className="me-2" />
            Upgrade Your Plan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-4">
            {plans.map((plan) => (
              <Col md={4} key={plan.name}>
                <Card className={`h-100 ${plan.popular ? 'border-primary shadow' : ''} ${plan.current ? 'bg-light' : ''}`}>
                  {plan.popular && (
                    <div className="position-absolute top-0 start-50 translate-middle">
                      <Badge bg="primary" className="px-3 py-2">Most Popular</Badge>
                    </div>
                  )}
                  <Card.Body className="p-4 text-center">
                    <h5 className="fw-bold mb-3">{plan.name}</h5>
                    <div className="mb-3">
                      <span className="display-4 fw-bold text-primary">${plan.price}</span>
                      <span className="text-muted">/month</span>
                    </div>
                    <ul className="list-unstyled mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="mb-2">
                          <FaCheck className="text-success me-2" />
                          <small>{feature}</small>
                        </li>
                      ))}
                    </ul>
                    {plan.current ? (
                      <Button variant="outline-secondary" disabled className="w-100">
                        Current Plan
                      </Button>
                    ) : (
                      <Button 
                        variant={plan.popular ? "primary" : "outline-primary"} 
                        className="w-100"
                        onClick={() => handleUpgrade(plan.name)}
                      >
                        {subscription && plan.price > subscription.price ? 'Upgrade' : 'Downgrade'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCreditCard className="me-2" />
            Complete Payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <FaShieldAlt className="me-2" />
            Your payment information is secure and encrypted.
          </Alert>
          <p>Complete your subscription upgrade by entering your payment details below.</p>
          {/* Payment form would go here */}
          <div className="bg-light p-4 rounded text-center">
            <FaCreditCard size={48} className="text-muted mb-3" />
            <p className="text-muted">Payment form integration would be implemented here</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePayment}>
            Complete Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubscriptionManager;
