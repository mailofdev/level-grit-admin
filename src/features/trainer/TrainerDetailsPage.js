import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button, Row, Col, Modal, Form } from "react-bootstrap";
import { getClientDashboardThunk } from "../client/clientThunks";
import { getClientsForTrainer } from "../../api/trainerAPI";
import Loader from "../../components/display/Loader";
import Heading from "../../components/navigation/Heading";
import Alert from "../../components/common/Alert";
import PaymentPopup from "../../components/payments/PaymentPopup";
import { Toast } from "primereact/toast";
import { FaCheckCircle, FaCamera, FaCalendar, FaFire, FaComment, FaUtensils, FaHistory } from "react-icons/fa";
import { FiCameraOff } from "react-icons/fi";
/**
 * Trainer Details Page - Mobile-First PWA-Optimized
 * 
 * Displays client details with:
 * - Client name and status badge
 * - Action buttons (Chat, Assign Meals, View History)
 * - Today's Meals section
 * - Nutrition summary (Calories, Protein, Carbs, Fats)
 */
export default function TrainerDetailsPage() {
  const { clientId: clientIdFromUrl } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state - use the same client slice as ClientDashboardView
  const { dashboard, loading, error } = useSelector((state) => state.client);
  
  const [clientData, setClientData] = useState(null);
  const [clientCategory, setClientCategory] = useState("total");
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const toast = useRef(null);

  // Check if selected date is today
  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  // Get client ID from URL or location state
  const clientId =
    clientIdFromUrl ||
    location.state?.client?.clientId ||
    location.state?.client?.id;

  /**
   * Calculate days since last meal logging
   */
  const getDaysSinceLastMeal = useCallback((lastMealDate) => {
    if (!lastMealDate) return null;
    const lastMeal = new Date(lastMealDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastMeal.setHours(0, 0, 0, 0);
    const diffTime = today - lastMeal;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  /**
   * Determine client category for status badge
   */
  const determineCategory = useCallback(
    (dashboard, client) => {
    if (!dashboard) {
        return "total"; // Newly added, no dashboard data
      }

      const currentStreakDays =
        dashboard.currentStreakDays || dashboard.streakDays || 0;
      const lastMealDate =
        dashboard.lastMealDate || dashboard.lastMealLogDate || null;
      const hasMealPlan =
        (dashboard.plannedMeals && dashboard.plannedMeals.length > 0) ||
        (dashboard.mealPlan && dashboard.mealPlan.length > 0) ||
        false;

    // Newly Added: No meal plan assigned yet
    if (!hasMealPlan) {
        return "total";
    }

    // Check days since last meal
    const daysSinceLastMeal = getDaysSinceLastMeal(lastMealDate);
    
    // Inactive: No meal logging for 15+ days
    if (daysSinceLastMeal !== null && daysSinceLastMeal >= 15) {
        return "inactive";
    }

    // Consistent: 7+ day streak
    if (currentStreakDays >= 7) {
      // But check if streak is broken (3 days no logging)
      if (daysSinceLastMeal !== null && daysSinceLastMeal >= 3) {
          return "inconsistent";
      }
        return "consistent";
    }

    // Inconsistent: Has meal plan but streak < 7 or broken streak
      return "inconsistent";
    },
    [getDaysSinceLastMeal]
  );

  /**
   * Fetch client data (only once on initial load)
   */
  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId || clientData) return;

      try {
        const clients = await getClientsForTrainer();
        const client = Array.isArray(clients) 
          ? clients.find(
              (c) =>
                (c.clientId || c.id) === clientId ||
                (c.clientId || c.id)?.toString() === clientId?.toString()
            )
          : null;

        if (client) {
          setClientData(client);
        } else if (location.state?.client) {
          setClientData(location.state.client);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching client data:", error);
        }
      }
    };

    fetchClientData();
  }, [clientId, location.state, clientData]);

  /**
   * Fetch dashboard data using Redux thunk (same as ClientDashboardView)
   */
  useEffect(() => {
    if (!clientId) return;

    if (isToday) {
      // For today, don't send date
      dispatch(getClientDashboardThunk({ clientId }));
    } else {
      // For other dates, send dateTime in ISO format
      const dateTime = new Date(selectedDate).toISOString();
      dispatch(getClientDashboardThunk({ clientId, dateTime }));
    }
  }, [dispatch, clientId, selectedDate, isToday]);

  /**
   * Update client category when dashboard data changes
   */
  useEffect(() => {
    if (dashboard) {
      const category = determineCategory(
        dashboard,
        clientData || location.state?.client
      );
      setClientCategory(category);
    } else {
      // No dashboard data - newly added client
      setClientCategory("total");
    }
  }, [dashboard, clientData, location.state, determineCategory]);

  /**
   * Parse macro strings from "consumed/target" format (same as ClientDashboardView)
   */
  const parseMacro = useCallback((macroString) => {
    if (!macroString) return { value: 0, target: 0 };
    const [value, target] = macroString.split("/").map(parseFloat);
    return { value: value || 0, target: target || 0 };
  }, []);

  /**
   * Get status badge label
   */
  const getStatusBadge = useMemo(() => {
    switch (clientCategory) {
      case "consistent":
        return {
          label: "Consistent",
          color: "rgba(138, 43, 226, 0.15)",
          textColor: "#8A2BE2",
        };
      case "inconsistent":
        return {
          label: "Inconsistent",
          color: "rgba(255, 193, 7, 0.15)",
          textColor: "#FFC107",
        };
      case "inactive":
        return {
          label: "Inactive",
          color: "rgba(220, 53, 69, 0.15)",
          textColor: "#DC3545",
        };
      default:
        return null; // No badge for 'total'
    }
  }, [clientCategory]);

  /**
   * Prepare client and dashboard data from API response (same as ClientDashboardView)
   */
  const client = dashboard
    ? {
        clientId: dashboard.clientId || clientId,
        trainerId: dashboard.trainerId,
        clientName: dashboard.clientName,
        fullName: dashboard.clientName,
        goal: "",
        startDate: new Date().toLocaleDateString(),
        status: dashboard.currentStreakDays >= 3 ? "on-track" : "attention",
        streak:
          dashboard.currentStreakDays > 0
            ? `${dashboard.currentStreakDays} days`
            : "Missed meal",
      }
    : clientData || location.state?.client || null;

  /**
   * Prepare dashboard data from API response (same as ClientDashboardView)
   */
  const dashboardData = dashboard
    ? {
        user: {
          name: dashboard.clientName || "Client",
          streak: dashboard.currentStreakDays || 0,
        },
        macros: {
          calories: parseMacro(dashboard.totalMacros?.calories),
          protein: parseMacro(dashboard.totalMacros?.protein),
          carbs: parseMacro(dashboard.totalMacros?.carbs),
          fat: parseMacro(dashboard.totalMacros?.fat),
        },
        streakProgress: { current: dashboard.currentStreakDays || 0, goal: 20 },
        meals: [],
        reminders: [],
        water: { current: 6, goal: 8 },
      }
    : null;

  /**
   * Match uploaded meals with planned meals (same as ClientDashboardView)
   */
  if (dashboard && dashboardData) {
    const uploadedMealsMap = {};
    (dashboard.meals || []).forEach((meal) => {
      uploadedMealsMap[meal.mealName?.toLowerCase().trim()] = meal;
    });

    dashboardData.meals = (dashboard.plannedMeals || []).map(
      (planned, index) => {
        const uploadedMeal =
          uploadedMealsMap[planned.mealName?.toLowerCase().trim()];

        return {
          id: planned.id || index,
          name: `Meal ${index + 1}${
            planned.mealName ? ` (${planned.mealName})` : ""
          }`,
          mealName: planned.mealName,
          uploadId: planned.uploadId,
          plannedMealId: planned.id || planned.uploadId,
          // Show uploaded image if completed, otherwise show planned image
          image: uploadedMeal?.base64Image
            ? `data:image/jpeg;base64,${uploadedMeal.base64Image}`
            : planned.base64Image
            ? `data:image/jpeg;base64,${planned.base64Image}`
            : null,
          // Show actual consumed values if completed, otherwise show planned values
          calories: uploadedMeal
            ? Math.round(uploadedMeal.calories)
            : Math.round(planned.calories || 0),
          protein: uploadedMeal
            ? Math.round(uploadedMeal.protein)
            : Math.round(planned.protein || 0),
          carbs: uploadedMeal
            ? Math.round(uploadedMeal.carbs)
            : Math.round(planned.carbs || 0),
          fat: uploadedMeal
            ? Math.round(uploadedMeal.fat)
            : Math.round(planned.fat || 0),
          completed: !!uploadedMeal,
          // Store both planned and actual for reference
          plannedCalories: Math.round(planned.calories || 0),
          plannedProtein: Math.round(planned.protein || 0),
          plannedCarbs: Math.round(planned.carbs || 0),
          plannedFat: Math.round(planned.fat || 0),
        };
      }
    );
  }

  /**
   * Get client name
   */
  const clientName =
    client?.fullName ||
    client?.name ||
    client?.clientName ||
    dashboard?.clientName ||
    "Client";

  /**
   * Helper function to get placeholder image for incomplete meals
   */
  const getMealPlaceholderImage = useCallback(() => {
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="var(--color-card-bg-alt)"/><circle cx="100" cy="80" r="30" fill="none" stroke="var(--color-border)" stroke-width="3" stroke-dasharray="5,5"/><path d="M 70 120 L 130 120" stroke="var(--color-border)" stroke-width="3" stroke-linecap="round"/><path d="M 70 140 L 130 140" stroke="var(--color-border)" stroke-width="3" stroke-linecap="round"/><path d="M 70 160 L 110 160" stroke="var(--color-border)" stroke-width="3" stroke-linecap="round"/><text x="100" y="190" font-family="Arial" font-size="14" fill="var(--color-muted)" text-anchor="middle">Pending</text></svg>`;
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml;charset=utf-8,${encoded}`;
  }, []);

  /**
   * Get today's meals from dashboardData (already matched in dashboardData.meals)
   */
  const todayMeals = useMemo(() => {
    if (!dashboardData?.meals) return [];
    return dashboardData.meals;
  }, [dashboardData]);

  /**
   * Get nutrition totals from dashboardData (already parsed)
   */
  const nutritionTotals = useMemo(() => {
    if (!dashboardData?.macros) {
      return {
        calories: { value: 0, target: 0 },
        protein: { value: 0, target: 0 },
        carbs: { value: 0, target: 0 },
        fat: { value: 0, target: 0 },
      };
    }

    return dashboardData.macros;
  }, [dashboardData]);

  /**
   * CircularProgress component for displaying macros (same as ClientDashboardView)
   */
  const CircularProgress = useCallback(
    ({ value, max, label, current, target, color = "success" }) => {
      const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
      const circumference = 2 * Math.PI * 45;
      const strokeDasharray = `${
        (percentage / 100) * circumference
      } ${circumference}`;

      return (
        <div className="text-center">
          <div className="position-relative d-inline-block mb-2">
            <svg width="120" height="120" className="transform-rotate-neg90">
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke={
                  color === "success"
                    ? "var(--color-primary)"
                    : color === "info"
                    ? "var(--color-primary)"
                    : "var(--color-warning)"
                }
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dasharray 0.3s ease",
                }}
              />
            </svg>
            <div className="position-absolute top-50 start-50 translate-middle">
              <div className="fw-bold text-theme-dark">
                {percentage}%
              </div>
            </div>
          </div>
          <h6 className="mb-1 text-capitalize fw-semibold small text-theme-dark">
            {label}
          </h6>
          <small className="text-muted">
            {Math.round(current)} / {target}
          </small>
        </div>
      );
    },
    []
  );

  /**
   * Handle action buttons
   */
  const handleChat = useCallback(() => {
    navigate(`/messages/${clientId}`);
  }, [navigate, clientId]);

  const handleAssignMeals = useCallback(() => {
    navigate(`/adjust-plan/${clientId}`);
  }, [navigate, clientId]);

  const handleViewHistory = useCallback(() => {
    // Open date selection modal for viewing meal plan history
    setShowDateModal(true);
  }, []);

  const handleDateConfirm = useCallback(() => {
    if (!selectedDate) {
      return;
    }
    
    // Navigate to adjust plan page with selected date
    navigate(`/adjust-plan/${clientId}`, {
      state: {
        client: client || clientData,
        initialDate: selectedDate,
        isView: false, // Allow editing
      },
    });
    
    setShowDateModal(false);
  }, [navigate, clientId, selectedDate, clientData]);

  const handleDateModalClose = useCallback(() => {
    setShowDateModal(false);
  }, []);

  // Handle date picker for viewing different dates
  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate);
    setShowDatePickerModal(false);
  }, []);

  const handleDatePickerOpen = useCallback(() => {
    setShowDatePickerModal(true);
  }, []);

  const goBack = () => {
    navigate("/trainer-dashboard", { replace: false });
  };

  /**
   * Check if client is paid - must be before early returns (React Hooks rule)
   */
  const isPaid = useMemo(() => {
    const client = clientData || location.state?.client;
    return client?.isSubscriptionPaid ?? client?.IsSubscriptionPaid ?? true;
  }, [clientData, location.state]);

  /**
   * Handle payment success
   */
  const handlePaymentSuccess = useCallback(() => {
    toast.current?.show({
      severity: "success",
      summary: "Payment Successful",
      detail: "Client services have been activated successfully!",
      life: 4000,
    });
    
    // Refresh client data
    if (clientId) {
      const fetchClientData = async () => {
        try {
          const clients = await getClientsForTrainer();
          const client = Array.isArray(clients)
            ? clients.find(
                (c) =>
                  (c.clientId || c.id) === clientId ||
                  (c.clientId || c.id)?.toString() === clientId?.toString()
              )
            : null;
          if (client) {
            setClientData(client);
          }
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error refreshing client data:", error);
          }
        }
      };
      fetchClientData();
    }
    
    setShowPaymentPopup(false);
  }, [clientId]);

  // Loading state (same as ClientDashboardView)
  if (loading && !dashboard) {
    return (
      <div className="container">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "60vh" }}
        >
      <Loader
            size="120px"
            color="var(--color-primary)"
        text="Loading client details..."
          />
        </div>
      </div>
    );
  }

  // Error state (same as ClientDashboardView)
  if (error) {
    return (
      <div className="container">
        <div>
          <Alert
            type="error"
            title="Error Loading Dashboard"
            message={error}
            dismissible={false}
            position="inline"
            className="mt-5 mb-3"
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              if (isToday) {
                dispatch(getClientDashboardThunk({ clientId }));
              } else {
                const dateTime = new Date(selectedDate).toISOString();
                dispatch(getClientDashboardThunk({ clientId, dateTime }));
              }
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No dashboard data state
  if (!dashboardData || !client) {
    return (
      <div className="container">
        <p className="text-muted mt-4 text-center">Loading dashboard data...</p>
      </div>
    );
  }

  // Calculate completed and remaining meals (same as ClientDashboardView)
  const completedMeals = dashboardData.meals.filter((m) => m.completed).length;
  const remainingMeals = dashboardData.meals.length - completedMeals;

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <PaymentPopup
        show={showPaymentPopup}
        onHide={() => setShowPaymentPopup(false)}
        onSuccess={handlePaymentSuccess}
        clientId={clientId}
        clientName={clientName}
        amount={500}
      />
      <style>{`
        .trainer-details-heading-override .heading-container {
          position: fixed !important;
          top: 67px !important;
          z-index: 1040 !important;
          pointer-events: auto !important;
        }
        .trainer-details-heading-override .heading-spacer {
          display: none !important;
        }
        .trainer-details-heading-override .btn-back {
          pointer-events: auto !important;
          cursor: pointer !important;
          z-index: 1041 !important;
        }
        .transform-rotate-neg90 {
          transform: rotate(-90deg);
        }
      `}</style>

      {/* Loading overlay when date changes (loading && dashboard exists) */}
      {loading && dashboard && (
        <Loader
          fullScreen={true}
          text="Loading dashboard..."
          color="var(--color-primary)"
        />
      )}

      {/* Fixed Heading at Top - Positioned below Topbar */}
      <div className="trainer-details-heading-override">
        <Heading pageName="Client Details" sticky={true} onBack={goBack} />
      </div>

      {/* Main Content Container - Positioned below fixed heading */}
      <Container
        fluid
        className="px-3 py-3 position-fixed w-100 bg-theme"
        style={{
          top: "122px",
          bottom: 0,
          left: 0,
          right: 0,
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: 1,
        }}
      >
        {/* Client Header Card - Social Media Style */}
        <div className="card mb-3 border-0 rounded-4 action-btn-card">
          <div className="card-body p-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                  style={{
                    width: "56px",
                    height: "56px",
                    fontSize: "1.5rem",
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                  }}
                >
                  {clientName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-theme-dark">{client.fullName}</h4>
        {getStatusBadge && (
            <span
                      className="badge rounded-pill px-2 py-1 small"
              style={{
                backgroundColor: getStatusBadge.color,
                color: getStatusBadge.textColor,
              }}
            >
              {getStatusBadge.label}
            </span>
                  )}
                </div>
          </div>
              {isPaid === false && (
                <Button
                  variant="primary"
                  className="rounded-pill fw-semibold"
                  onClick={() => setShowPaymentPopup(true)}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.375rem 0.75rem",
                  }}
                >
                  Pay ₹500
                </Button>
              )}
            </div>

            {/* Action Buttons - Social Media Style */}
            <Row className="g-2">
          <Col xs={4}>
            <Button
              variant="light"
                  className="w-100 rounded-pill fw-semibold border action-btn d-flex align-items-center justify-content-center gap-2"
              onClick={handleChat}
                  disabled={isPaid === false}
              style={{
                    fontSize: "clamp(0.75rem, 3vw, 0.875rem)",
                    minHeight: "44px",
                    backgroundColor: isPaid === false ? "var(--color-surface-variant)" : "var(--color-card-bg)",
                  }}
                >
                  <FaComment />
                  <span className="d-none d-sm-inline">Chat</span>
            </Button>
          </Col>
          <Col xs={4}>
            <Button
              variant="light"
                  className="w-100 rounded-pill fw-semibold border action-btn d-flex align-items-center justify-content-center gap-2"
              onClick={handleAssignMeals}
                  disabled={isPaid === false}
              style={{
                    fontSize: "clamp(0.75rem, 3vw, 0.875rem)",
                    minHeight: "44px",
                    backgroundColor: isPaid === false ? "var(--color-surface-variant)" : "var(--color-card-bg)",
                  }}
                >
                  <FaUtensils />
                  <span className="d-none d-sm-inline">Meals</span>
            </Button>
          </Col>
          <Col xs={4}>
            <Button
              variant="light"
                  className="w-100 rounded-pill fw-semibold border action-btn d-flex align-items-center justify-content-center gap-2"
              onClick={handleViewHistory}
                  disabled={isPaid === false}
              style={{
                    fontSize: "clamp(0.75rem, 3vw, 0.875rem)",
                    minHeight: "44px",
                    backgroundColor: isPaid === false ? "var(--color-surface-variant)" : "var(--color-card-bg)",
                  }}
                >
                  <FaHistory />
                  <span className="d-none d-sm-inline">History</span>
            </Button>
          </Col>
        </Row>
          </div>
        </div>

        {/* Today's Meals Card - Social Media Style */}
        <div className="card mb-3 border-0 rounded-4">
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h5 className="card-title fw-bold mb-0 text-theme-dark">
                {isToday
                  ? "Today's Meals"
                  : `${new Date(selectedDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })} Meals`}
              </h5>
              <div className="d-flex gap-2 flex-wrap">
                <span className="fw-semibold small text-success">
                  {completedMeals} completed
                </span>
                <span className="fw-semibold small text-danger">
                  {remainingMeals} remaining
                </span>
              </div>
            </div>

            {(dashboardData.meals || []).length === 0 ? (
              <div className="text-center py-5">
                <FaCamera className="mb-3 display-4 text-muted" />
                <p className="mb-0 text-muted">
                  No meals planned for{" "}
                  {isToday
                    ? "today"
                    : new Date(selectedDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                </p>
              </div>
            ) : (
              <div className="row g-2">
                {dashboardData.meals.map((meal, idx) => (
                  <div key={idx} className="col-6">
                    <div
                      className={`h-100 p-2 position-relative rounded-3 meal-card ${
                        meal.completed ? "border border-success" : "border border-theme"
                      } ${meal.completed ? "bg-light" : "bg-card"} ${
                        meal.completed ? "" : "cursor-pointer"
                      }`}
          style={{
                        cursor: meal.completed ? "default" : "pointer",
                        pointerEvents: meal.completed ? "none" : "auto",
                        backgroundColor: meal.completed
                          ? "rgba(0, 100, 0, 0.05)"
                          : undefined,
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="fw-semibold mb-0 small text-theme-dark">
                          {meal.mealName}
                        </h6>
                      </div>

                      <div
                        className="overflow-hidden mb-2 position-relative d-flex align-items-center justify-content-center rounded-3"
                        style={{
                          minHeight: "80px",
                          maxHeight: "200px",
                          backgroundColor: "var(--color-card-bg-alt)",
                        }}
                      >
                        {meal.image ? (
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className="img-fluid"
                            style={{
                              opacity: meal.completed ? 1 : 0.6,
                              maxHeight: "120px",
                              width: "100%",
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              // If image fails to load, replace with placeholder
                              e.target.onerror = null; // Prevent infinite loop
                              e.target.src = getMealPlaceholderImage();
                              e.target.style.opacity = 0.8;
                              e.target.style.filter = meal.completed ? "none" : "grayscale(100%)";
                            }}
                          />
                        ) : (
                          <img
                            src={getMealPlaceholderImage()}
                            alt="Meal not completed"
                            className="img-fluid"
                  style={{
                              opacity: 0.8,
                              filter: meal.completed ? "none" : "grayscale(100%)",
                              maxHeight: "200px",
                              width: "100%",
                              objectFit: "contain",
                            }}
                          />
                        )}
                        {!meal.completed && (
                          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-3 bg-light bg-opacity-50">
                            <div className="text-center">
                              <FaCamera className="mb-2 display-6 text-muted" />
                              <div className="small fw-semibold text-muted">
                                Pending
                              </div>
                            </div>
            </div>
          )}
        </div>

                      <p className="mb-1 small text-muted">
                        {meal.calories} calories
                        {meal.completed && meal.plannedCalories && (
                          <span className="ms-1 text-success">
                            (Target: {meal.plannedCalories})
                  </span>
                        )}
                      </p>
                      <div className="small text-muted">
                        P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                      </div>
                    </div>
                </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Macros Card - Social Media Style */}
        <div className="card mb-3 border-0 rounded-4">
          <div className="card-body p-3">
            <h5 className="card-title fw-bold mb-3 text-theme-dark">
              {isToday
                ? "Today's Macros"
                : `${new Date(selectedDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })} Macros`}
            </h5>
            <div className="row g-2 mt-2">
              {Object.entries(nutritionTotals).map(([key, value], index) => (
                <div key={key} className="col-6 mb-2">
                  <CircularProgress
                    current={value.value}
                    target={value.target}
                    label={key}
                    color={
                      index === 0 ? "success" : index === 1 ? "info" : "warning"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
              </div>

        {/* Streak Card - Social Media Style */}
        <div className="col-lg-4 mb-2">
          <div className="card h-100 border-0 rounded-4 macro-card">
            <div className="card-body text-center d-flex flex-column p-3">
              <div className="mb-3">
                <div className="mb-2 rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ 
                  width: "60px", 
                  height: "60px",
                  background: "linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1))"
                }}>
                  <FaFire className="text-warning" style={{ fontSize: "1.5rem" }} />
                </div>
                <h6 className="fw-bold mb-1 text-theme-dark">Streak Progress</h6>
              </div>
              <div className="flex-grow-1 d-flex flex-column justify-content-center">
                <h3 className="mb-2 fw-bold text-primary" style={{ fontSize: "1.8rem" }}>
                  {dashboardData.streakProgress.current}
                  <small className="ms-1 fw-normal text-muted" style={{ fontSize: "1rem" }}>
                    / {dashboardData.streakProgress.goal}
                  </small>
                </h3>
                <p className="mb-3 small text-muted">days</p>
                <div className="progress mb-3 rounded-pill" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-primary rounded-pill"
                  style={{
                      width: `${
                        (dashboardData.streakProgress.current /
                          dashboardData.streakProgress.goal) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </Container>

      {/* Date Picker Modal - For viewing different dates */}
      <Modal
        show={showDatePickerModal}
        onHide={() => setShowDatePickerModal(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold">Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-3">
            <Form.Label className="fw-semibold mb-2">
              Choose a date to view dashboard
            </Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              min={
                new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                  .toISOString()
                  .split("T")[0]
              }
              className="form-control-lg"
              style={{ minHeight: "48px" }}
            />
            <Form.Text className="text-muted small d-block mt-2">
              Select a date to view the client's dashboard (up to 1 year ago)
            </Form.Text>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-top">
          <Button
            variant="outline-secondary"
            onClick={() => setShowDatePickerModal(false)}
            className="rounded-pill px-4"
            style={{ minHeight: "44px" }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Date Selection Modal - For viewing meal plan history */}
      <Modal
        show={showDateModal}
        onHide={handleDateModalClose}
        centered
        backdrop="static"
        keyboard={false}
        className="date-picker-modal"
      >
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold">Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-3">
            <Form.Label className="fw-semibold mb-2">
              Choose a date to view meal plan
            </Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              min={
                new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                  .toISOString()
                  .split("T")[0]
              }
              className="form-control-lg"
              style={{ minHeight: "48px" }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="border-top">
          <Button
            variant="outline-secondary"
            onClick={handleDateModalClose}
            className="rounded-pill px-4"
            style={{ minHeight: "44px" }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDateConfirm}
            className="rounded-pill px-4"
            disabled={!selectedDate}
            style={{ minHeight: "44px" }}
          >
            View Meal Plan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
