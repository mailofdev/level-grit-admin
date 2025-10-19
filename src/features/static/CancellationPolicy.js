import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const CancellationPolicy = () => {
  return (
    <div className="page-container">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Card className="content-wrapper card-health">
              <Card.Header className="text-center py-4">
                <h1 className="fw-bold text-primary mb-3">
                  <i className="fas fa-undo me-3"></i>
                  Cancellation and Refund Policy
                </h1>
                <p className="text-muted mb-0">Last updated: {new Date().toLocaleDateString()}</p>
              </Card.Header>
              
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">1. Subscription Cancellation</h2>
                  <p className="text-muted">
                    You may cancel your Level Grit subscription at any time. Cancellation requests can be made through your account dashboard or by contacting our support team.
                  </p>
                  
                  <div className="card card-info p-3 mb-3">
                    <h5 className="fw-semibold text-info mb-2">
                      <i className="fas fa-info-circle me-2"></i>How to Cancel
                    </h5>
                    <ul className="text-muted mb-0">
                      <li>Log into your Level Grit account</li>
                      <li>Navigate to Account Settings → Billing</li>
                      <li>Click "Cancel Subscription"</li>
                      <li>Follow the confirmation prompts</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">2. Effective Date of Cancellation</h2>
                  <p className="text-muted">
                    Your subscription will remain active until the end of your current billing period. You will continue to have full access to all platform features until that time.
                  </p>
                  
                  <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Important:</strong> Cancellation requests made after your billing date will not prevent the next billing cycle. 
                    You will be charged for the upcoming period and retain access until the end of that period.
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">3. Refund Policy</h2>
                  
                  <h5 className="fw-semibold text-secondary mb-2">Monthly Subscriptions</h5>
                  <p className="text-muted">
                    Monthly subscriptions are non-refundable once the billing period has begun. However, we offer a 7-day money-back guarantee for new subscribers.
                  </p>

                  <h5 className="fw-semibold text-secondary mb-2 mt-3">Annual Subscriptions</h5>
                  <p className="text-muted">
                    Annual subscriptions may be eligible for a prorated refund if cancelled within the first 30 days. After 30 days, no refunds will be provided for annual subscriptions.
                  </p>

                  <h5 className="fw-semibold text-secondary mb-2 mt-3">Free Trial</h5>
                  <p className="text-muted">
                    If you cancel during your free trial period, you will not be charged. No refund is necessary as no payment was processed.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">4. Refund Processing</h2>
                  <p className="text-muted">
                    Approved refunds will be processed within 5-10 business days to the original payment method used for the subscription. 
                    Processing times may vary depending on your financial institution.
                  </p>
                  
                  <div className="card card-stats p-3">
                    <h5 className="fw-semibold text-primary mb-2">
                      <i className="fas fa-clock me-2"></i>Refund Timeline
                    </h5>
                    <ul className="text-muted mb-0">
                      <li>Credit Cards: 3-5 business days</li>
                      <li>PayPal: 1-3 business days</li>
                      <li>Bank Transfer: 5-10 business days</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">5. Data Retention After Cancellation</h2>
                  <p className="text-muted">
                    After your subscription ends, your account and data will be retained for 30 days to allow for reactivation. 
                    During this period, you can reactivate your subscription without losing any data.
                  </p>
                  
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Data Export:</strong> Before your data is permanently deleted, you can export your client information, 
                    meal plans, and progress reports through your account dashboard.
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">6. Special Circumstances</h2>
                  
                  <h5 className="fw-semibold text-secondary mb-2">Technical Issues</h5>
                  <p className="text-muted">
                    If you experience significant technical issues that prevent you from using the platform effectively, 
                    we may provide a full or partial refund at our discretion.
                  </p>

                  <h5 className="fw-semibold text-secondary mb-2 mt-3">Billing Errors</h5>
                  <p className="text-muted">
                    If you are charged incorrectly due to a billing error on our part, we will provide a full refund 
                    and correct the error immediately.
                  </p>

                  <h5 className="fw-semibold text-secondary mb-2 mt-3">Service Interruption</h5>
                  <p className="text-muted">
                    In the event of extended service interruptions (more than 24 hours), we may provide account credits 
                    or refunds proportional to the downtime.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">7. Chargeback Policy</h2>
                  <p className="text-muted">
                    If you initiate a chargeback or dispute with your bank or credit card company, we will immediately 
                    suspend your account until the dispute is resolved. We encourage you to contact our support team 
                    first to resolve any billing issues.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">8. Reactivation</h2>
                  <p className="text-muted">
                    You can reactivate your subscription at any time within 30 days of cancellation. 
                    Reactivation will restore full access to your account and all previously stored data.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">9. Contact for Refunds</h2>
                  <p className="text-muted">
                    To request a refund or discuss cancellation options, please contact our billing support team:
                  </p>
                  
                  <div className="bg-light p-3 rounded">
                    <p className="mb-1"><strong>Email:</strong> billing@levelgrit.com</p>
                    <p className="mb-1"><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p className="mb-1"><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
                    <p className="mb-0"><strong>Response Time:</strong> Within 24 hours</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">10. Changes to This Policy</h2>
                  <p className="text-muted">
                    We reserve the right to modify this cancellation and refund policy at any time. 
                    Changes will be effective immediately upon posting. Continued use of our service 
                    after changes constitutes acceptance of the new policy.
                  </p>
                </div>

                <div className="text-center mt-5">
                  <div className="card card-health p-4">
                    <h4 className="fw-bold text-primary mb-3">
                      <i className="fas fa-heart me-2"></i>
                      We Value Your Feedback
                    </h4>
                    <p className="text-muted mb-3">
                      If you're considering cancelling, we'd love to hear why. Your feedback helps us improve our platform.
                    </p>
                    <p className="text-muted mb-0">
                      Contact us at <strong>feedback@levelgrit.com</strong> to share your thoughts.
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CancellationPolicy;
