import React from "react";
import { Card, Col } from "react-bootstrap";
import Heading from "../../components/navigation/Heading";

const CancellationPolicy = () => {
  const sections = [
    {
      title: "1. Subscription Cancellations",
      content: [
        "You can cancel your subscription anytime from within your Level Grit account settings or by emailing billing@levelgrit.com.",
        "When canceled, your plan remains active until the end of the current billing cycle.",
      ],
    },
    {
      title: "2. Refund Eligibility",
      content: [
        "Refunds are available in cases such as:",
        "• Duplicate or incorrect charges.",
        "• Verified technical issues preventing app use.",
        "• Coach unavailability without a suitable replacement.",
        "Partial refunds for mid-cycle cancellations are generally not available once a billing period has started.",
      ],
    },
    {
      title: "3. Refund Process",
      content: [
        "Refund requests must be submitted within 7 days of the transaction.",
        "Approved refunds are processed to your original payment method within 5–10 business days.",
      ],
    },
    {
      title: "4. Contact",
      content: [
        "For billing, refund, or cancellation support, email billing@levelgrit.com.",
        "Our team will review your request and get back to you promptly.",
      ],
    },
  ];

  return (
    <div className="container py-3">
      <Heading pageName="Cancellation & Refund Policy" />

      <div
        className="d-flex flex-column"
        style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}
      >
        <div className="flex-grow-1 overflow-auto">
          <Col>
            <Card className="border-0 shadow-sm rounded-4 mb-3">
              <Card.Body className="p-4">
                <h5 className="text-secondary mb-4">
                  We want your experience with{" "}
                  <span className="fw-bold text-primary">Level Grit</span> to be
                  smooth and fair. If something isn’t right, we’ll do our best to
                  make it right.
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
                  <p className="mb-1 fw-semibold text-dark">
                    Email: billing@levelgrit.com
                  </p>
                  <p className="mb-0 text-muted">
                    Our billing team typically responds within 24 hours on
                    business days.
                  </p>
                </div>

                <div className="text-center mt-5">
                  <div className="card border-0 shadow-sm p-4 rounded-4">
                    <h4 className="fw-bold text-primary mb-3">
                      <i className="fas fa-heart me-2"></i>We Value Your Feedback
                    </h4>
                    <p className="text-muted mb-2">
                      If you're considering cancelling, we'd love to hear why.
                      Your feedback helps us improve our platform.
                    </p>
                    <p className="text-muted mb-0">
                      Contact us at{" "}
                      <a
                        href="mailto:billing@levelgrit.com"
                        className="text-decoration-none text-primary"
                      >
                        billing@levelgrit.com
                      </a>
                      <strong></strong> to share your
                      thoughts.
                    </p>
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

export default CancellationPolicy;
