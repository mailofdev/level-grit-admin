import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getClientsForTrainer } from "../../api/trainerAPI";
import Loader from "../../components/display/Loader";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import AnimatedCard from "../../components/common/AnimatedCard";
import StaggerContainer from "../../components/common/StaggerContainer";
import PaymentPopup from "../../components/payments/PaymentPopup";
import { FaDumbbell, FaWeight, FaPhone } from "react-icons/fa";
import { Toast } from "primereact/toast";

export default function AllClients() {
  const user = getDecryptedUser();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 12;
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await getClientsForTrainer();
        setClients(Array.isArray(data) ? data : []);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching clients:", error);
        }
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error?.response?.data?.message || "Unable to load data. Check your internet connection or try again.",
          life: 4000,
        });
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const { currentClients, totalPages } = useMemo(() => {
    const indexOfLast = currentPage * clientsPerPage;
    const indexOfFirst = indexOfLast - clientsPerPage;
    return {
      currentClients: clients.slice(indexOfFirst, indexOfLast),
      totalPages: Math.ceil(clients.length / clientsPerPage)
    };
  }, [clients, currentPage, clientsPerPage]);

  const handleClientClick = useCallback((client) => {
    const isPaid = client.isSubscriptionPaid ?? client.IsSubscriptionPaid ?? true;
    if (isPaid === false) {
      return;
    }
    navigate(`/client-details/${client.clientId}`, { state: { client } });
  }, [navigate]);

  const handleAddClient = useCallback(() => {
    navigate("/register-client");
  }, [navigate]);

  const handlePayNow = useCallback((client, e) => {
    e.stopPropagation();
    setSelectedClient(client);
    setShowPaymentPopup(true);
  }, []);

  const handlePaymentSuccess = useCallback((paymentData) => {
    toast.current?.show({
      severity: "success",
      summary: "Payment Successful",
      detail: "Client services have been activated successfully!",
      life: 4000,
    });
    
    const fetchClients = async () => {
      try {
        const data = await getClientsForTrainer();
        setClients(Array.isArray(data) ? data : []);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching clients after payment:", error);
        }
        toast.current?.show({
          severity: "warn",
          summary: "Warning",
          detail: "Payment successful but failed to refresh client list. Please refresh the page.",
          life: 4000,
        });
      }
    };
    fetchClients();
    
    setShowPaymentPopup(false);
    setSelectedClient(null);
  }, []);

  if (loading) {
    return (
      <Loader
        fullScreen={true}
        text="Loading clients..."
        color="var(--color-primary)"
      />
    );
  }

  return (
    <div className="bg-theme min-vh-100 w-100 overflow-x-hidden p-3">
      <Toast ref={toast} position="top-right" />
      
      <PaymentPopup
        show={showPaymentPopup}
        onHide={() => {
          setShowPaymentPopup(false);
          setSelectedClient(null);
        }}
        onSuccess={handlePaymentSuccess}
        clientId={selectedClient?.clientId}
        clientName={selectedClient?.fullName}
        amount={500}
      />

      {/* Main Card Container - Centered */}
      <div className="mx-auto d-flex flex-column" style={{ maxWidth: "1400px", width: "100%", height: "calc(100vh - 2rem)", maxHeight: "calc(100vh - 2rem)" }}>
        <div className="card border-0 bg-card d-flex flex-column h-100 overflow-hidden rounded-3 shadow-sm" style={{ border: "1px solid var(--color-border)" }}>
          {/* Sticky Header Section */}
          <div className="card-header border-bottom bg-card border-theme position-sticky top-0 flex-shrink-0 py-2 px-3" style={{ zIndex: 10 }}>
            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap w-100">
              <div className="d-flex align-items-center flex-shrink-0">
                <span className="fw-semibold text-theme-dark text-nowrap" style={{ fontSize: "clamp(0.75rem, 2vw, 0.9rem)" }}>
                  Total: <span className="text-primary">{clients.length}</span>
                </span>
              </div>

              <div className="d-flex align-items-center gap-1 flex-shrink-0">
                <div className="px-2 py-1 rounded-pill text-nowrap" style={{ backgroundColor: "rgba(0, 100, 0, 0.1)", border: "1px solid rgba(0, 100, 0, 0.2)", fontSize: "clamp(0.7rem, 1.8vw, 0.75rem)" }}>
                  <span className="fw-bold text-success">
                    {clients.filter((c) => c.status === "on-track").length}
                  </span>
                  <span className="ms-1 text-success">On Track</span>
                </div>
                <div className="px-2 py-1 rounded-pill text-nowrap" style={{ backgroundColor: "rgba(255, 193, 7, 0.1)", border: "1px solid rgba(255, 193, 7, 0.2)", fontSize: "clamp(0.7rem, 1.8vw, 0.75rem)" }}>
                  <span className="fw-bold text-warning">
                    {clients.filter((c) => c.status === "attention").length}
                  </span>
                  <span className="ms-1 text-warning">Attention</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  className="btn btn-primary px-3 py-1 fw-semibold rounded-pill d-flex align-items-center justify-content-center gap-1 touch-target text-nowrap"
                  onClick={handleAddClient}
                  style={{ fontSize: "clamp(0.75rem, 2vw, 0.85rem)" }}
                >
                  <span>+ Add</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Clients Grid - Desktop */}
          <div className="card-body d-none d-md-block p-3 overflow-y-auto overflow-x-hidden flex-fill" style={{ minHeight: 0 }}>
            {clients.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-4" style={{ fontSize: "4rem" }}>
                  👥
                </div>
                <h5 className="fw-bold mb-2 text-theme-dark" style={{ fontSize: "1.1rem" }}>No clients yet</h5>
                <p className="mb-4 text-muted" style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
                  You don't have any clients yet. Tap "Add Client" to start adding your first client.
                </p>
                <button
                  className="btn btn-primary px-4 py-2 fw-semibold rounded-pill touch-target"
                  onClick={handleAddClient}
                  style={{ fontSize: "0.85rem" }}
                >
                  <span>+</span> <span>Add Your First Client</span>
                </button>
              </div>
            ) : (
              <div className="row g-3 m-0">
                {currentClients.map((client, idx) => {
                  const isPaid = client.isSubscriptionPaid ?? client.IsSubscriptionPaid ?? true;
                  
                  return (
                    <div
                      key={client.clientId}
                      className="col-12 col-sm-6 col-md-4 col-lg-3"
                      style={{ padding: 0 }}
                    >
                      <AnimatedCard
                        delay={idx * 0.05}
                        hover={isPaid !== false}
                        onClick={() => handleClientClick(client)}
                        className="h-100 position-relative"
                        style={{
                          borderRadius: "0.875rem",
                          border: "1px solid var(--color-border)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          backgroundColor: "var(--color-card-bg)",
                          filter: isPaid === false ? "grayscale(0.3)" : "none",
                          transition: "all 0.2s ease",
                          cursor: isPaid !== false ? "pointer" : "default"
                        }}
                      >
                        <div
                          className="position-absolute top-0 start-0 end-0"
                          style={{
                            height: "3px",
                            background: isPaid === false ? "var(--color-danger)" : "var(--color-primary)",
                            borderRadius: "0.875rem 0.875rem 0 0",
                          }}
                        />
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="card-title fw-bold mb-0" style={{ 
                              fontSize: "0.9rem",
                              color: "var(--color-text-dark)",
                              lineHeight: "1.3"
                            }}>
                              {client.fullName}
                            </h5>

                            {isPaid === false ? (
                              <span className="badge px-2 py-1 rounded-pill small" style={{
                                backgroundColor: "rgba(220, 53, 69, 0.1)",
                                color: "var(--color-danger)",
                                fontSize: "0.7rem"
                              }}>
                                <i className="fas fa-lock me-1"></i>
                                Inactive
                              </span>
                            ) : (
                              client.goal !== undefined && (
                                <span
                                  className="badge d-flex align-items-center gap-1 px-2 py-1 rounded-pill small"
                                  style={{
                                    backgroundColor: client.goal === 0 
                                      ? "rgba(0, 100, 0, 0.1)" 
                                      : "rgba(220, 53, 69, 0.1)",
                                    color: client.goal === 0 
                                      ? "var(--color-success)" 
                                      : "var(--color-danger)",
                                    fontSize: "0.7rem"
                                  }}
                                >
                                  {client.goal === 0 ? (
                                    <>
                                      <FaDumbbell /> Muscle Gain
                                    </>
                                  ) : (
                                    <>
                                      <FaWeight /> Weight Loss
                                    </>
                                  )}
                                </span>
                              )
                            )}
                          </div>

                          <div className="d-flex flex-column gap-1" style={{ fontSize: "0.8rem" }}>
                            <p className="mb-0 d-flex align-items-start">
                              <span className="me-2 text-muted" style={{ minWidth: "50px", fontSize: "0.75rem" }}>
                                Email
                              </span>
                              <span className="fw-medium text-break flex-grow-1 text-theme-dark" style={{ fontSize: "0.8rem" }}>
                                {client.email}
                              </span>
                            </p>
                            <p className="mb-0 d-flex align-items-center">
                              <span className="me-2 text-muted" style={{ minWidth: "50px", fontSize: "0.75rem" }}>
                                Gender
                              </span>
                              <span className="fw-medium text-theme-dark" style={{ fontSize: "0.8rem" }}>{client.gender}</span>
                            </p>
                            <p className="mb-0 d-flex align-items-center">
                              <span className="me-2 text-muted" style={{ minWidth: "50px", fontSize: "0.75rem" }}>
                                Phone
                              </span>
                              <span className="fw-medium text-theme-dark" style={{ fontSize: "0.8rem" }}>{client.phoneNumber}</span>
                            </p>
                          </div>

                          {isPaid === false && (
                            <div className="mt-2 pt-2 border-top border-theme">
                              <button
                                className="btn btn-primary w-100 fw-semibold rounded-pill d-flex align-items-center justify-content-center gap-1"
                                onClick={(e) => handlePayNow(client, e)}
                                style={{ 
                                  minHeight: "36px", 
                                  fontSize: "0.75rem",
                                  padding: "0.375rem 0.75rem"
                                }}
                              >
                                <i className="fas fa-credit-card" style={{ fontSize: "0.7rem" }}></i>
                                <span>Pay ₹500</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </AnimatedCard>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Clients List - Mobile - Centered & Enhanced */}
          <div className="card-body d-md-none p-3 overflow-y-auto overflow-x-hidden flex-fill d-flex flex-column" style={{ minHeight: 0 }}>
            {clients.length === 0 ? (
              <div className="text-center py-5 my-auto">
                <div className="mb-4" style={{ fontSize: "4rem" }}>
                  👥
                </div>
                <h5 className="fw-bold mb-2 text-theme-dark" style={{ fontSize: "1.1rem" }}>No clients yet</h5>
                <p className="mb-4 text-muted" style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
                  You don't have any clients yet. Tap "Add Client" to start adding your first client.
                </p>
                <button
                  className="btn btn-primary px-4 py-2 fw-semibold rounded-pill w-100 touch-target"
                  onClick={handleAddClient}
                  style={{ fontSize: "0.85rem" }}
                >
                  <span>+</span> <span>Add Your First Client</span>
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center gap-3 w-100" style={{ maxWidth: "600px", margin: "0 auto" }}>
                {currentClients.map((client, idx) => {
                  const isPaid = client.isSubscriptionPaid ?? client.IsSubscriptionPaid ?? true;
                  
                  return (
                    <AnimatedCard
                      key={client.clientId}
                      delay={idx * 0.05}
                      hover={isPaid !== false}
                      onClick={() => handleClientClick(client)}
                      className="w-100 position-relative"
                      style={{
                        borderRadius: "1rem",
                        border: "1px solid var(--color-border)",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        backgroundColor: "var(--color-card-bg)",
                        cursor: isPaid !== false ? "pointer" : "default",
                        filter: isPaid === false ? "grayscale(0.3)" : "none",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        opacity: isPaid === false ? 0.75 : 1,
                        overflow: "hidden"
                      }}
                    >
                      {/* Top Accent Bar */}
                      <div
                        className="position-absolute top-0 start-0 end-0"
                        style={{
                          height: "4px",
                          background: isPaid === false 
                            ? "linear-gradient(90deg, var(--color-danger) 0%, rgba(220, 53, 69, 0.5) 100%)" 
                            : "linear-gradient(90deg, var(--color-primary) 0%, rgba(0, 160, 128, 0.5) 100%)",
                        }}
                      />
                      
                      <div className="card-body p-3">
                        {/* Header Row */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1 text-theme-dark" style={{ 
                              fontSize: "1rem",
                              lineHeight: "1.3",
                              letterSpacing: "-0.01em"
                            }}>
                              {client.fullName}
                            </h6>
                            <p className="mb-0 text-muted small" style={{ 
                              fontSize: "0.8rem",
                              lineHeight: "1.4"
                            }}>
                              {client.email}
                            </p>
                          </div>

                          {isPaid === false ? (
                            <span className="badge px-2 py-1 rounded-pill flex-shrink-0" style={{
                              backgroundColor: "rgba(220, 53, 69, 0.15)",
                              color: "var(--color-danger)",
                              fontSize: "0.7rem",
                              fontWeight: "600",
                              border: "1px solid rgba(220, 53, 69, 0.2)"
                            }}>
                              <i className="fas fa-lock me-1"></i>
                              Inactive
                            </span>
                          ) : (
                            client.goal !== undefined && (
                              <span
                                className="badge d-flex align-items-center gap-1 px-2 py-1 rounded-pill flex-shrink-0"
                                style={{
                                  backgroundColor: client.goal === 0 
                                    ? "rgba(0, 100, 0, 0.15)" 
                                    : "rgba(220, 53, 69, 0.15)",
                                  color: client.goal === 0 
                                    ? "var(--color-success)" 
                                    : "var(--color-danger)",
                                  fontSize: "0.7rem",
                                  fontWeight: "600",
                                  border: client.goal === 0 
                                    ? "1px solid rgba(0, 100, 0, 0.2)" 
                                    : "1px solid rgba(220, 53, 69, 0.2)"
                                }}
                              >
                                {client.goal === 0 ? (
                                  <>
                                    <FaDumbbell size={10} /> Muscle Gain
                                  </>
                                ) : (
                                  <>
                                    <FaWeight size={10} /> Weight Loss
                                  </>
                                )}
                              </span>
                            )
                          )}
                        </div>

                        {/* Details Row */}
                        <div className="d-flex gap-3 pt-2 border-top border-theme">
                          <div className="d-flex align-items-center gap-1">
                            <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                              {client.gender}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <FaPhone size={12} className="text-muted" />
                            <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                              {client.phoneNumber}
                            </span>
                          </div>
                        </div>

                        {/* Payment Button */}
                        {isPaid === false && (
                          <div className="mt-3 pt-3 border-top border-theme">
                            <button
                              className="btn btn-primary w-100 fw-semibold rounded-pill d-flex align-items-center justify-content-center gap-2 touch-target"
                              onClick={(e) => handlePayNow(client, e)}
                              style={{ 
                                minHeight: "44px", 
                                fontSize: "0.85rem",
                                boxShadow: "0 2px 8px rgba(0, 160, 128, 0.25)"
                              }}
                            >
                              <i className="fas fa-credit-card"></i>
                              <span>Pay ₹500 to Activate</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </AnimatedCard>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {clients.length > 0 && (
            <div className="card-footer border-0 py-3" style={{ 
              backgroundColor: "var(--color-card-bg)",
              borderTop: "1px solid var(--color-border)",
              flexShrink: 0
            }}>
              <div
                className="d-flex justify-content-center align-items-center gap-3 flex-wrap"
                style={{
                  width: "100%",
                  maxWidth: "100%"
                }}
              >
                <button
                  className={`btn fw-semibold rounded-pill px-3 px-sm-4 py-2 d-flex align-items-center justify-content-center ${
                    currentPage === 1
                      ? "btn-outline-secondary disabled opacity-75"
                      : "btn-primary"
                  }`}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  style={{ minHeight: '44px', minWidth: '44px', fontSize: "0.85rem" }}
                  aria-label="Previous page"
                >
                  ← 
                </button>

                <span className="fw-semibold small px-3 px-sm-4 py-2 rounded-pill d-flex align-items-center" style={{ 
                  minHeight: '44px',
                  fontSize: "0.85rem",
                  backgroundColor: "var(--color-card-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)"
                }}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className={`btn fw-semibold rounded-pill px-3 px-sm-4 py-2 d-flex align-items-center justify-content-center ${
                    currentPage === totalPages
                      ? "btn-outline-secondary disabled opacity-75"
                      : "btn-primary"
                  }`}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{ minHeight: '44px', minWidth: '44px', fontSize: "0.85rem" }}
                  aria-label="Next page"
                >
                   →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
