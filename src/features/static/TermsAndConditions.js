import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Heading from '../../components/navigation/Heading';
const TermsAndConditions = () => {
  return (
    <div className="container">
         <Heading pageName="Terms and Conditions" />
          <div className="d-flex flex-column" style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}>
        <div className="flex-grow-1 overflow-auto">
          <Col>
            <Card className="content-wrapper card-health">
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">1. Acceptance of Terms</h2>
                  <p className="text-muted">
                    By accessing and using Level Grit Trainer Platform ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">2. Description of Service</h2>
                  <p className="text-muted">
                    Level Grit is a comprehensive fitness training platform that provides trainers with tools to manage clients, create personalized meal plans, track progress, and communicate with clients. Our platform includes:
                  </p>
                  <ul className="text-muted">
                    <li>Client registration and profile management</li>
                    <li>Personalized meal plan creation and tracking</li>
                    <li>Progress monitoring and reporting</li>
                    <li>Integrated messaging system</li>
                    <li>Subscription-based access to premium features</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">3. Trainer Responsibilities</h2>
                  <p className="text-muted">
                    As a trainer using our platform, you agree to:
                  </p>
                  <ul className="text-muted">
                    <li>Provide accurate and professional fitness and nutrition advice</li>
                    <li>Maintain client confidentiality and data privacy</li>
                    <li>Comply with all applicable health and fitness regulations</li>
                    <li>Use the platform in accordance with professional standards</li>
                    <li>Maintain current certifications and qualifications</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">4. Client Data and Privacy</h2>
                  <p className="text-muted">
                    You are responsible for ensuring that all client data is collected, stored, and used in compliance with applicable privacy laws, including GDPR, CCPA, and HIPAA where applicable. You must obtain proper consent from clients before collecting their personal and health information.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">5. Subscription and Payment</h2>
                  <p className="text-muted">
                    Our platform operates on a subscription basis. By subscribing, you agree to:
                  </p>
                  <ul className="text-muted">
                    <li>Pay all fees associated with your subscription plan</li>
                    <li>Automatic renewal unless cancelled before the renewal date</li>
                    <li>Price changes with 30 days notice</li>
                    <li>No refunds for partial months or unused features</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">6. Intellectual Property</h2>
                  <p className="text-muted">
                    The Level Grit platform, including its design, functionality, and content, is protected by intellectual property laws. You may not copy, modify, or distribute any part of the platform without written permission.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">7. Limitation of Liability</h2>
                  <p className="text-muted">
                    Level Grit shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">8. Termination</h2>
                  <p className="text-muted">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">9. Changes to Terms</h2>
                  <p className="text-muted">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold text-primary mb-3">10. Contact Information</h2>
                  <p className="text-muted">
                    If you have any questions about these Terms and Conditions, please contact us at:
                  </p>
                  <div className="bg-light p-3 rounded">
                    <p className="mb-1"><strong>Email:</strong> legal@levelgrit.com</p>
                    <p className="mb-1"><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p className="mb-0"><strong>Address:</strong> 123 Fitness Street, Health City, HC 12345</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
      </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
