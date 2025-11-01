import React from "react";
import { Card, Col } from "react-bootstrap";
import Heading from "../../components/navigation/Heading";

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Eligibility",
      content: [
        "You must be 18 years or older to create an account.",
        "Minors can use the platform under parental or guardian supervision.",
      ],
    },
    {
      title: "2. Account Responsibilities",
      content: [
        "You’re responsible for maintaining the confidentiality of your account credentials.",
        "Coaches must ensure their certifications are valid and up to date.",
        "Clients must provide honest, accurate health and nutrition details for effective guidance.",
      ],
    },
    {
      title: "3. Our Services",
      content: [
        "Level Grit provides tools for:",
        "• Coaches to manage clients, track progress, and communicate effectively.",
        "• Clients to log meals, track macros, stay consistent, and celebrate progress.",
        "Level Grit is not a healthcare provider. All fitness or nutrition guidance is given by certified professionals, not medical practitioners.",
      ],
    },
    {
      title: "4. Payments & Subscriptions",
      content: [
        "Certain features may require paid subscriptions.",
        "All pricing and billing terms are displayed clearly before purchase.",
        "Subscriptions can be canceled anytime in the app or by contacting billing@levelgrit.com.",
      ],
    },
    {
      title: "5. Ownership & Content",
      content: [
        "You own the photos, data, and content you upload.",
        "Level Grit may use anonymized data to improve app features.",
        "Copying, reverse engineering, or reselling our platform is prohibited.",
      ],
    },
    {
      title: "6. Code of Conduct",
      content: [
        "You agree not to:",
        "• Post or share offensive or false information.",
        "• Spam, harass, or impersonate others.",
        "• Upload copyrighted or illegal content.",
        "We reserve the right to remove content or terminate accounts violating our guidelines.",
      ],
    },
    {
      title: "7. Disclaimers",
      content: [
        "Level Grit and its coaches provide guidance, not medical diagnosis.",
        "Consult your doctor before making health or dietary changes.",
      ],
    },
    {
      title: "8. Limitation of Liability",
      content: [
        "While we aim to provide accurate and reliable tools, Level Grit is not liable for indirect or incidental damages resulting from the use of the app.",
      ],
    },
    {
      title: "9. Termination",
      content: [
        "We may suspend or terminate accounts that violate these terms, misuse the platform, or engage in fraudulent activity.",
      ],
    },
    {
      title: "10. Contact",
      content: [
        "For questions, concerns, or disputes, please email support@levelgrit.com.",
      ],
    },
  ];

  return (
    <div className="container py-3">
      <Heading pageName="Terms & Conditions" />
      <div
        className="d-flex flex-column"
        style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}
      >
        <div className="flex-grow-1 overflow-auto">
          <Col>
            <Card className="border-0 shadow-sm rounded-4 mb-3">
              <Card.Body className="p-4">
                <h5 className="text-secondary mb-4">
                  Welcome to{" "}
                  <span className="fw-bold text-primary">Level Grit</span>, a
                  platform that connects clients and certified fitness coaches
                  to help you build sustainable habits and real results.
                  <br />
                  <br />
                  By signing up or using the app, you agree to these Terms &
                  Conditions.
                </h5>

                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="pb-3 mb-4 border-bottom border-2 border-dashed"
                    style={{ borderColor: "#dee2e6" }}
                  >
                    <h2 className="h5 fw-bold text-primary mb-2">
                      {section.title}
                    </h2>
                    {section.content.map((line, i) => (
                      <p key={i} className="text-muted mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                ))}

                <div className="mt-4 bg-light p-3 rounded-3 border-start border-4 border-primary">
                  Email:
                  <a
                    href="mailto:support@levelgrit.com"
                    className="text-decoration-none text-primary"
                  >
                    support@levelgrit.com
                  </a>
                  <p className="mb-0 text-muted">
                    Thank you for being part of the Level Grit community.
                  </p>
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
