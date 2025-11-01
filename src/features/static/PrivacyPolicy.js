import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import Heading from "../../components/navigation/Heading";

const PrivacyPolicy = () => {
  return (
    <div className="container">
      <Heading pageName="Privacy Policy" />
      <div
        className="d-flex flex-column"
        style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}
      >
        <div className="flex-grow-1 overflow-auto">
          <Row className="justify-content-center">
            <Col>
              <Card className="content-wrapper card-health border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  
                  {/* 1. Intro */}
                  <div className="mb-4 pb-3" style={{ borderBottom: "1px dashed rgba(108,117,125,0.4)" }}>
                    <h2 className="h4 fw-bold text-primary mb-3">
                      At Level Grit, Your Privacy Matters
                    </h2>
                    <p className="text-muted">
                      Your privacy and trust are our top priorities. We’re committed to protecting your
                      personal information while helping you achieve your fitness goals with real,
                      certified coaches.
                    </p>
                  </div>

                  {/* 2. Information We Collect */}
                  <div className="mb-4 pb-3" style={{ borderBottom: "1px dashed rgba(108,117,125,0.4)" }}>
                    <h2 className="h4 fw-bold text-primary mb-3">
                      1. Information We Collect
                    </h2>
                    <p className="text-muted">
                      We collect only what’s necessary to deliver a seamless coaching experience:
                    </p>
                    <ul className="text-muted">
                      <li>
                        <strong>Account Information:</strong> Name, email, phone number, gender, age
                        (optional).
                      </li>
                      <li>
                        <strong>Health & Fitness Data:</strong> Meal photos, macro details, weight logs,
                        workout data, and progress metrics.
                      </li>
                      <li>
                        <strong>Coach Interactions:</strong> Chat messages, progress notes, and feedback
                        exchanges.
                      </li>
                      <li>
                        <strong>Device & Usage Data:</strong> App activity, browser type, and limited
                        cookies to improve performance and user experience.
                      </li>
                    </ul>
                  </div>

                  {/* 3. How We Use Your Information */}
                  <div className="mb-4 pb-3" style={{ borderBottom: "1px dashed rgba(108,117,125,0.4)" }}>
                    <h2 className="h4 fw-bold text-primary mb-3">
                      2. How We Use Your Information
                    </h2>
                    <p className="text-muted">
                      Your information helps us:
                    </p>
                    <ul className="text-muted">
                      <li>Connect you with certified coaches</li>
                      <li>Track and visualize your nutrition and fitness progress</li>
                      <li>Send reminders, check-ins, and motivational nudges</li>
                      <li>Enhance our app features and overall user experience</li>
                    </ul>
                    <p className="text-muted mb-0">
                      We never sell your data to advertisers.
                    </p>
                  </div>

                  {/* 4. Data Protection */}
                  <div className="mb-4 pb-3" style={{ borderBottom: "1px dashed rgba(108,117,125,0.4)" }}>
                    <h2 className="h4 fw-bold text-primary mb-3">3. Data Protection</h2>
                    <p className="text-muted">
                      We use secure servers, encryption, and restricted access to safeguard your data.
                      Your information is stored only as long as needed to provide our services.
                    </p>
                  </div>

                  {/* 5. Information Sharing */}
                  <div className="mb-4 pb-3" style={{ borderBottom: "1px dashed rgba(108,117,125,0.4)" }}>
                    <h2 className="h4 fw-bold text-primary mb-3">
                      4. Information Sharing
                    </h2>
                    <p className="text-muted">
                      We share your data only when:
                    </p>
                    <ul className="text-muted">
                      <li>
                        You connect with a coach — relevant progress details are visible to them.
                      </li>
                      <li>
                        Required by law or for legal compliance.
                      </li>
                      <li>
                        Partnered services (like cloud storage or analytics) operate under strict
                        confidentiality agreements.
                      </li>
                    </ul>
                  </div>

                  {/* 6. Your Rights */}
                  <div className="mb-4 pb-3" style={{ borderBottom: "1px dashed rgba(108,117,125,0.4)" }}>
                    <h2 className="h4 fw-bold text-primary mb-3">5. Your Rights</h2>
                    <p className="text-muted">
                      You have full control over your information. You can:
                    </p>
                    <ul className="text-muted">
                      <li>Access or update your data anytime in the app.</li>
                      <li>
                        Request account deletion by emailing{" "}
                        <a href="mailto:support@levelgrit.com" className="text-decoration-none text-primary">
                          support@levelgrit.com
                        </a>
                        .
                      </li>
                      <li>
                        Withdraw consent for data usage (note: this may limit app functionality).
                      </li>
                    </ul>
                  </div>

                  {/* 7. Cookies */}
                  <div className="mb-4 pb-3" style={{ borderBottom: "1px dashed rgba(108,117,125,0.4)" }}>
                    <h2 className="h4 fw-bold text-primary mb-3">6. Cookies</h2>
                    <p className="text-muted">
                      Level Grit uses limited cookies and analytics tools to measure usage trends and
                      performance. No tracking or marketing cookies are used.
                    </p>
                  </div>

                  {/* 8. Contact Us */}
                  <div className="mb-2 pb-3" style={{ borderBottom: "1px dashed rgba(108,117,125,0.4)" }}>
                    <h2 className="h4 fw-bold text-primary mb-3">7. Contact Us</h2>
                    <p className="text-muted">
                      For privacy-related questions or data requests, reach out to us at:
                    </p>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-1">
                        <strong>Email:</strong>{" "}
                        <a href="mailto:support@levelgrit.com" className="text-decoration-none text-primary">
                          support@levelgrit.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <p className="text-muted small mt-4 mb-0 text-center">
                    <em>Last updated: November 2025</em>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
