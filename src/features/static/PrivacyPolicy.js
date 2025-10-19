import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const PrivacyPolicy = () => {
  return (
    <div className="page-container">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Card className="content-wrapper card-health">
              <Card.Header className="text-center py-4">
                <h1 className="fw-bold text-primary mb-3">
                  <i className="fas fa-shield-alt me-3"></i>
                  Privacy Policy
                </h1>
                <p className="text-muted mb-0">Last updated: {new Date().toLocaleDateString()}</p>
              </Card.Header>
              
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">1. Introduction</h2>
                  <p className="text-muted">
                    Level Grit ("we," "our," or "us") is committed to protecting your privacy and the privacy of your clients. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our fitness training platform.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">2. Information We Collect</h2>
                  
                  <h5 className="fw-semibold text-secondary mb-2">Personal Information</h5>
                  <p className="text-muted">
                    We collect information you provide directly to us, such as when you create an account, including:
                  </p>
                  <ul className="text-muted">
                    <li>Name, email address, and phone number</li>
                    <li>Professional credentials and certifications</li>
                    <li>Payment and billing information</li>
                    <li>Profile information and preferences</li>
                  </ul>

                  <h5 className="fw-semibold text-secondary mb-2 mt-3">Client Information</h5>
                  <p className="text-muted">
                    As a trainer, you may input client information including:
                  </p>
                  <ul className="text-muted">
                    <li>Client personal details and contact information</li>
                    <li>Health and fitness data (weight, height, goals)</li>
                    <li>Meal plans and nutritional information</li>
                    <li>Progress photos and measurements</li>
                    <li>Communication logs and notes</li>
                  </ul>

                  <h5 className="fw-semibold text-secondary mb-2 mt-3">Usage Information</h5>
                  <p className="text-muted">
                    We automatically collect certain information about your use of our platform:
                  </p>
                  <ul className="text-muted">
                    <li>Device information and IP address</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on platform</li>
                    <li>Features used and interactions</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">3. How We Use Your Information</h2>
                  <p className="text-muted">
                    We use the information we collect to:
                  </p>
                  <ul className="text-muted">
                    <li>Provide and maintain our fitness training platform</li>
                    <li>Process payments and manage subscriptions</li>
                    <li>Send important updates and notifications</li>
                    <li>Improve our services and develop new features</li>
                    <li>Provide customer support</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">4. Information Sharing and Disclosure</h2>
                  <p className="text-muted">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                  </p>
                  <ul className="text-muted">
                    <li><strong>With your consent:</strong> When you explicitly authorize us to share information</li>
                    <li><strong>Service providers:</strong> With trusted third parties who assist in platform operations</li>
                    <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business transfers:</strong> In connection with mergers or acquisitions</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">5. Data Security</h2>
                  <p className="text-muted">
                    We implement appropriate technical and organizational measures to protect your information:
                  </p>
                  <ul className="text-muted">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication</li>
                    <li>Secure data centers and infrastructure</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">6. Your Rights and Choices</h2>
                  <p className="text-muted">
                    Depending on your location, you may have the following rights:
                  </p>
                  <ul className="text-muted">
                    <li><strong>Access:</strong> Request access to your personal information</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request transfer of your data</li>
                    <li><strong>Objection:</strong> Object to certain processing activities</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">7. Health Information (HIPAA Compliance)</h2>
                  <p className="text-muted">
                    When handling health information, we comply with applicable health privacy laws:
                  </p>
                  <ul className="text-muted">
                    <li>We act as a Business Associate under HIPAA when applicable</li>
                    <li>Health information is encrypted and access-controlled</li>
                    <li>We maintain audit logs of health data access</li>
                    <li>We provide breach notification as required by law</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">8. International Data Transfers</h2>
                  <p className="text-muted">
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers, including standard contractual clauses and adequacy decisions.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">9. Data Retention</h2>
                  <p className="text-muted">
                    We retain your information for as long as necessary to provide our services and comply with legal obligations. Client data is retained according to your instructions and applicable professional requirements.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">10. Children's Privacy</h2>
                  <p className="text-muted">
                    Our platform is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">11. Changes to This Policy</h2>
                  <p className="text-muted">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">12. Contact Us</h2>
                  <p className="text-muted">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="bg-light p-3 rounded">
                    <p className="mb-1"><strong>Privacy Officer:</strong> privacy@levelgrit.com</p>
                    <p className="mb-1"><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p className="mb-0"><strong>Address:</strong> 123 Fitness Street, Health City, HC 12345</p>
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

export default PrivacyPolicy;
