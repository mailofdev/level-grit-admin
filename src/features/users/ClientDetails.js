import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getClientDashboardThunk } from "../client/clientThunks";
import {
  selectClientDashboardData,
  selectClientDashboardLoading,
  selectClientDashboardError,
} from "../client/clientSlice";
import {
  FaFire,
  FaCheckCircle,
  FaCamera,
  FaSadCry,
  FaShareAlt,
  FaTimes,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { SplitButton } from "primereact/splitbutton";
import Heading from "../../components/navigation/Heading";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get client from location state
  const client = location.state?.client ? { ...location.state.client } : null;
  
  // Redux state for client dashboard
  const dashboard = useSelector(selectClientDashboardData);
  const loading = useSelector(selectClientDashboardLoading);
  const error = useSelector(selectClientDashboardError);

  // Fetch client dashboard data when component mounts or clientId changes
  useEffect(() => {
    if (client?.clientId) {
      dispatch(getClientDashboardThunk(client.clientId));
    }
  }, [client?.clientId, dispatch]);

  // Parse macro strings from "consumed/target" format
  const parseMacro = (macroString) => {
    if (!macroString) return { value: 0, target: 0 };
    const [value, target] = macroString.split("/").map(parseFloat);
    return { value: value || 0, target: target || 0 };
  };

  // Prepare client data from API response or use existing client
  const clientData = dashboard
    ? {
        clientId: dashboard.clientId || client?.clientId,
        trainerId: dashboard.trainerId || client?.trainerId,
        clientName: dashboard.clientName || client?.clientName || client?.fullName,
        fullName: dashboard.clientName || client?.fullName || "Client",
        goal: client?.goal || "- - -",
        startDate: client?.startDate || new Date().toLocaleDateString(),
        status: dashboard.currentStreakDays >= 3 ? "on-track" : "attention",
        streak:
          dashboard.currentStreakDays > 0
            ? `${dashboard.currentStreakDays} days`
            : "Missed meal",
      }
    : client ? {
        ...client,
        status: "attention",
        streak: "Missed meal",
      } : null;

  // Prepare dashboard data from API response
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

  // Match uploaded meals with planned meals
  if (dashboard) {
    const uploadedMealsMap = {};
    (dashboard.meals || []).forEach((meal) => {
      uploadedMealsMap[meal.mealName.toLowerCase().trim()] = meal;
    });

    dashboardData.meals = (dashboard.plannedMeals || []).map(
      (planned, index) => {
        const uploadedMeal =
          uploadedMealsMap[planned.mealName.toLowerCase().trim()];

        return {
          name: `Meal ${index + 1} (${planned.mealName})`,
          mealName: planned.mealName,
          uploadId: planned.uploadId,
          // Show uploaded image if completed, otherwise show planned image or placeholder
          image: uploadedMeal?.base64Image
            ? `data:image/jpeg;base64,${uploadedMeal.base64Image}`
            : planned.base64Image
            ? `data:image/jpeg;base64,${planned.base64Image}`
            : null, // Will use placeholder in UI
          hasImage: !!(uploadedMeal?.base64Image || planned.base64Image),
          // Show actual consumed values if completed, otherwise show planned values
          calories: uploadedMeal
            ? Math.round(uploadedMeal.calories)
            : Math.round(planned.calories),
          protein: uploadedMeal
            ? Math.round(uploadedMeal.protein)
            : Math.round(planned.protein),
          carbs: uploadedMeal
            ? Math.round(uploadedMeal.carbs)
            : Math.round(planned.carbs),
          fat: uploadedMeal
            ? Math.round(uploadedMeal.fat)
            : Math.round(planned.fat),
          completed: !!uploadedMeal,
          // Store both planned and actual for reference
          plannedCalories: Math.round(planned.calories),
          plannedProtein: Math.round(planned.protein),
          plannedCarbs: Math.round(planned.carbs),
          plannedFat: Math.round(planned.fat),
        };
      }
    );
  }

  if (loading && !dashboard) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p className="text-danger text-center mt-5">{error}</p>
      </div>
    );
  }

  if (!dashboardData || !clientData) {
    return (
      <div className="container">
        <p className="text-muted mt-4 text-center">Loading dashboard data...</p>
      </div>
    );
  }

  const completedMeals = dashboardData.meals.filter((m) => m.completed).length;
  const remainingMeals = dashboardData.meals.length - completedMeals;

  // Helper function to get placeholder image for incomplete meals
  const getMealPlaceholderImage = () => {
    // Create a simple SVG placeholder that indicates incomplete meal
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f8f9fa"/><circle cx="100" cy="80" r="30" fill="none" stroke="#dee2e6" stroke-width="3" stroke-dasharray="5,5"/><path d="M 70 120 L 130 120" stroke="#dee2e6" stroke-width="3" stroke-linecap="round"/><path d="M 70 140 L 130 140" stroke="#dee2e6" stroke-width="3" stroke-linecap="round"/><path d="M 70 160 L 110 160" stroke="#dee2e6" stroke-width="3" stroke-linecap="round"/><text x="100" y="190" font-family="Arial" font-size="14" fill="#6c757d" text-anchor="middle">Pending</text></svg>`;
    // Encode SVG for data URL
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml;charset=utf-8,${encoded}`;
  };

  const CircularProgress = ({
    value,
    max,
    label,
    current,
    target,
    color = "success",
  }) => {
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
              stroke="#e9ecef"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={
                color === "success"
                  ? "#28a745"
                  : color === "info"
                  ? "#17a2b8"
                  : "#ffc107"
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
            <div className="fw-bold fs-5">{percentage}%</div>
          </div>
        </div>
        <h6 className="mb-1 text-capitalize fw-semibold">{label}</h6>
        <small className="text-muted">
          {Math.round(current)} / {target}
        </small>
      </div>
    );
  };

 

  return (
    <div className="container">
      <div className="d-flex flex-column">
        <div className="flex-grow-1 overflow-auto p-3 rounded shadow-sm">
          {/* Client Info Card */}
          <Heading pageName="details" sticky={true} />
          <div className="card shadow-sm rounded-4 mb-3 mt-3 border-0">
            <div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <div>
                <h4 className="fw-bold">{clientData.fullName}</h4>
                <p className="mb-1 text-muted small">
                  Goal: <span className="fw-semibold">{clientData.goal}</span> •
                  Start: {clientData.startDate}
                </p>
                <span
                  className={`badge px-3 py-2 ${
                    clientData.status === "attention" ? "bg-danger" : "bg-success"
                  }`}
                >
                  {clientData.status === "attention"
                    ? "Need Attention"
                    : "On Track"}
                </span>
              </div>

              <div className="text-md-end mt-3 mt-md-0">
                <div className="d-flex align-items-center justify-content-md-end mb-3">
                  <span
                    className={`fw-bold ${
                      clientData.streak === "Missed meal"
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {dashboardData.streakProgress.current} day streak
                  </span>
                  {clientData.streak === "Missed meal" ? (
                    <FaSadCry className="text-danger ms-2" />
                  ) : (
                    <FaFire className="text-success ms-2" />
                  )}
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                  <button
                    className="bg-white fs-6 btn-sm p-2 d-flex align-items-center border-0 rounded-3 shadow-sm"
                    onClick={() =>
                      navigate(`/messages/${clientData.clientId}`, {
                        state: { 
                          client: clientData,
                          clientId: clientData.clientId,
                        },
                      })
                    }
                  >
                    <FaMessage className="me-1" /> Message
                  </button>

                  <SplitButton
                    label="Plan"
                    icon="pi pi-plus"
                    className="bg-button fs-6 text-secondary btn-sm border-0 rounded-3 shadow-sm"
                    style={{
                      color: "white",
                    }}
                    model={[
                      {
                        label: "Add",
                        icon: "pi pi-pencil",
                        command: () =>
                          navigate(`/adjust-plan/${clientData.clientId}`, {
                            state: { client: clientData, isView: false },
                          }),
                      },
                      {
                        label: "Preview",
                        icon: "pi pi-eye",
                        command: () =>
                          navigate(`/adjust-plan/${clientData.clientId}`, {
                            state: { client: clientData, isView: true },
                          }),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-2 bg-gray">
            <div className="col-lg-8 mb-3">
              <div className="card rounded-4 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <h5 className="card-title mb-0 fw-bold">Today's Macros</h5>
                  </div>
                  <div className="row">
                    {Object.entries(dashboardData.macros).map(
                      ([key, value], index) => (
                        <div key={key} className="col-12 col-sm-3 mb-3">
                          <CircularProgress
                            current={value.value}
                            target={value.target}
                            label={key}
                            color={
                              index === 0
                                ? "success"
                                : index === 1
                                ? "info"
                                : "warning"
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-3">
              <div className="card rounded-4 shadow-sm h-100">
                <div className="card-body text-center d-flex flex-column">
                  <div className="mb-3">
                    <FaFire className="text-warning fs-2 mb-2" />
                    <h6 className="fw-bold">Streak Progress</h6>
                  </div>
                  <div className="flex-grow-1 d-flex flex-column justify-content-center">
                    <h4 className="text-primary mb-3">
                      {dashboardData.streakProgress.current} /{" "}
                      {dashboardData.streakProgress.goal}
                      <small className="text-muted ms-1">days</small>
                    </h4>
                    <div className="progress mb-4" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-gradient"
                        style={{
                          width: `${
                            (dashboardData.streakProgress.current /
                              dashboardData.streakProgress.goal) *
                            100
                          }%`,
                          background:
                            "linear-gradient(90deg, #28a745, #20c997)",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Plan Section */}
          <div className="card rounded-4 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title fw-bold mb-0">Today's Meals</h5>
                <div>
                  <span className="text-success fw-semibold me-2">
                    {completedMeals} completed
                  </span>
                  <span className="text-danger fw-semibold">
                    {remainingMeals} remaining
                  </span>
                </div>
              </div>

              <div className="row g-3">
                {dashboardData.meals.map((meal, idx) => (
                  <div key={idx} className="col-12 col-md-4 col-lg-4">
                    <div
                      className={`h-100 rounded-4 p-3 position-relative ${
                        meal.completed
                          ? "br-light-green-2"
                          : "br-light-gray-dotted"
                      }`}
                      style={{
                        cursor: meal.completed ? "default" : "pointer",
                        pointerEvents: meal.completed ? "none" : "auto",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-semibold mb-1">{meal.name}</h6>
                        {meal.completed ? (
                          <FaCheckCircle className="text-success fs-5" />
                        ) : (
                          <FaCamera className="text-secondary fs-5" />
                        )}
                      </div>

                      <div
                        className="rounded-3 overflow-hidden mb-2 position-relative"
                        style={{ height: "120px" }}
                      >
                        {meal.image ? (
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className="img-fluid w-100 h-100 object-fit-cover"
                            style={{ opacity: meal.completed ? 1 : 0.6 }}
                          />
                        ) : (
                          <img
                            src={getMealPlaceholderImage()}
                            alt="Meal not completed"
                            className="img-fluid w-100 h-100 object-fit-cover"
                            style={{ 
                              opacity: 0.8,
                              filter: meal.completed ? 'none' : 'grayscale(100%)'
                            }}
                          />
                        )}
                        {!meal.completed && (
                          <div 
                            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{
                              background: 'rgba(0, 0, 0, 0.1)',
                              pointerEvents: 'none'
                            }}
                          >
                            <div className="text-center">
                              <FaCamera className="text-muted mb-2" style={{ fontSize: "2rem" }} />
                              <div className="small text-muted fw-semibold">Pending</div>
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="mb-1 small text-muted">
                        {meal.calories} calories
                        {meal.completed && meal.plannedCalories && (
                          <span className="text-success ms-1">
                            (Target: {meal.plannedCalories})
                          </span>
                        )}
                      </p>
                      <div className="small text-muted">
                        P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                      </div>
                      {meal.completed && (
                        <div className="small text-success mt-1">
                          <FaCheckCircle className="me-1" />
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
