import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getClientDashboardThunk } from "../client/clientThunks";
import {
  selectClientDashboardData,
  selectClientDashboardLoading,
  selectClientDashboardError,
} from "../client/clientSlice";
import Heading from "../../components/navigation/Heading";
import {
  FaFire,
  FaCheckCircle,
  FaCamera,
  FaSadCry,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default function ClientDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);
  const dispatch = useDispatch();

  const client = { ...location.state?.client };

  // Redux state
  const clientDashboardData = useSelector(selectClientDashboardData);
  const clientDashboardLoading = useSelector(selectClientDashboardLoading);
  const clientDashboardError = useSelector(selectClientDashboardError);

  // Date picker state
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [actionType, setActionType] = useState(null);


  // Fetch client dashboard data when component mounts or clientId changes
  useEffect(() => {
    if (client?.clientId) {
      dispatch(getClientDashboardThunk(client.clientId));
    }
  }, [client?.clientId, dispatch]);

  // Show error toast if API call fails
  useEffect(() => {
    if (clientDashboardError) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: clientDashboardError,
        life: 5000,
      });
    }
  }, [clientDashboardError]);

  // Helper function to parse macro strings (format: "current/target")
  const parseMacro = (macroString) => {
    if (!macroString || typeof macroString !== 'string') {
      return { value: 0, target: 1 };
    }
    const parts = macroString.split('/');
    const value = parseFloat(parts[0]) || 0;
    const target = parseFloat(parts[1]) || 1;
    return {
      value: value,
      target: target,
    };
  };

  // Helper function to convert base64 to data URL
  const getImageSrc = (base64Image) => {
    if (!base64Image) return null;
    // Check if it's already a data URL
    if (base64Image.startsWith('data:')) return base64Image;
    // Check if it's a full base64 string or just the data part
    if (base64Image.startsWith('/9j/') || base64Image.length > 100) {
      return `data:image/jpeg;base64,${base64Image}`;
    }
    return base64Image;
  };

  // Transform API data to component format
  const transformDashboardData = (apiData) => {
    if (!apiData) {
      // Return default/empty data structure
      return {
        user: { name: client?.fullName || "Client", streak: 0 },
        macros: {
          calories: { value: 0, target: 1 },
          protein: { value: 0, target: 1 },
          carbs: { value: 0, target: 1 },
          fat: { value: 0, target: 1 },
        },
        streakProgress: { current: 0, goal: 20 },
        meals: [],
      };
    }

    // Parse macros from API
    const macros = {
      calories: parseMacro(apiData.totalMacros?.calories),
      protein: parseMacro(apiData.totalMacros?.protein),
      carbs: parseMacro(apiData.totalMacros?.carbs),
      fat: parseMacro(apiData.totalMacros?.fat),
    };

    // Combine meals and plannedMeals
    // Mark meals as completed if they have an uploaded image
    const uploadedMealNames = new Set((apiData.meals || []).map(m => m.mealName?.toLowerCase()));
    
    const allMeals = (apiData.plannedMeals || []).map((meal) => {
      const isCompleted = uploadedMealNames.has(meal.mealName?.toLowerCase());
      // Find uploaded meal data if exists
      const uploadedMeal = (apiData.meals || []).find(
        m => m.mealName?.toLowerCase() === meal.mealName?.toLowerCase()
      );

      return {
        name: meal.mealName || "Meal",
        image: getImageSrc(uploadedMeal?.base64Image || meal.base64Image),
        calories: Math.round(uploadedMeal?.calories || meal.calories || 0),
        protein: Math.round(uploadedMeal?.protein || meal.protein || 0),
        carbs: Math.round(uploadedMeal?.carbs || meal.carbs || 0),
        fat: Math.round(uploadedMeal?.fat || meal.fat || 0),
        completed: isCompleted,
      };
    });

    return {
      user: {
        name: apiData.clientName || client?.fullName || "Client",
        streak: apiData.currentStreakDays || 0,
      },
      macros,
      streakProgress: {
        current: apiData.currentStreakDays || 0,
        goal: 20, // Default goal, can be updated if API provides it
      },
      meals: allMeals,
    };
  };

  // Get dashboard data from API or use default
  const dashboardData = transformDashboardData(clientDashboardData);
  
  // Debug logging
  useEffect(() => {
    if (clientDashboardData) {
      console.log('Client Dashboard Data:', clientDashboardData);
      console.log('Transformed Dashboard Data:', dashboardData);
      console.log('Meals:', dashboardData.meals);
      console.log('Macros:', dashboardData.macros);
    }
  }, [clientDashboardData, dashboardData]);
  
  const completedMeals = dashboardData.meals.filter((m) => m.completed).length;
  const remainingMeals = dashboardData.meals.length - completedMeals;

  if (!client)
    return (
      <p className="text-muted mt-4 text-center">
        Select a client to view details.
      </p>
    );

  const handlePlanAction = (type) => {
    setActionType(type);
    setShowDateDialog(true);
  };

  const handleConfirmDate = () => {
    if (!selectedDate) {
      toast.current?.show({
        severity: "warn",
        summary: "Date Required",
        detail: "Please select a date",
        life: 3000,
      });
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const isView = actionType === "preview";

    navigate(`/adjust-plan/${client.clientId}`, {
      state: {
        client,
        isView,
        initialDate: formattedDate,
      },
    });

    setShowDateDialog(false);
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 365);

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
          <svg width="100" height="100" className="transform-rotate-neg90">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e9ecef"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={
                color === "success"
                  ? "#007AFF"
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
            <div className="fw-bold fs-6">{percentage}%</div>
          </div>
        </div>
        <h6 className="mb-1 text-capitalize fw-semibold small">{label}</h6>
        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
          {current} / {target}
        </small>
      </div>
    );
  };


  const getGoalText = (goalValue) => {
    switch (goalValue) {
      case "0":
      case 0:
        return "🏋️ Muscle Gain & Strength Building";
      case "1":
      case 1:
        return "🔥 Fat Loss & Body Toning";
      default:
        return "🎯 No goal set";
    }
  };

  return (
    <div className="container-fluid px-2 px-md-3">
      <Toast ref={toast} />
      <Heading pageName="details" sticky={true} />
      <div
        className="d-flex flex-column"
        style={{
          height: "calc(100vh - 140px)",
        }}
      >
        <div className="flex-grow-1 overflow-auto pb-3">
          <div className="px-2 px-md-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
        
                <div className="card border-0 rounded-4 shadow-lg overflow-hidden mb-3 mt-2">
                  <motion.div 
                    className="bg-gradient p-3 d-flex justify-content-between align-items-center" 
                    style={{ 
                      background: client.status === "attention"
                        ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
                        : "linear-gradient(135deg, #4e73df 0%, #1cc88a 100%)"
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div>
                        <h5 className="text-white mb-0 fw-bold fs-5">{client.fullName}</h5>
                        <small className="text-white-50">Client Details</small>
                      </div>
                    </div>
                    <motion.span
                      className={`badge px-3 py-2 fs-6 rounded-pill shadow-sm ${
                        client.status === "attention" ? "bg-danger" : "bg-success"
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {client.status === "attention" ? "⚠️ Need Attention" : "✅ On Track"}
                    </motion.span>
                  </motion.div>

                  <div className="card-body p-3 p-md-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                      <div className="flex-grow-1">
                        <p className="mb-2 text-muted small">
                          <strong>Goal:</strong> {getGoalText(client.goal)}
                        </p>
                        <p className="mb-2 text-muted small">
                          <strong>Start:</strong> {client.startDate}
                        </p>
                      </div>
                      <div className="text-md-end">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className={`fw-bold fs-6 ${
                              dashboardData.user.streak === 0 ? "text-danger" : "text-success"
                            }`}
                          >
                            {dashboardData.user.streak > 0 
                              ? `${dashboardData.user.streak} day${dashboardData.user.streak !== 1 ? 's' : ''} streak`
                              : "No streak"
                            }
                          </span>
                          {dashboardData.user.streak === 0 ? (
                            <FaSadCry className="text-danger fs-5" />
                          ) : (
                            <FaFire className="text-success fs-5" />
                          )}
                        </div>
                      </div>
                    </div>

                  <hr className="my-3" />

                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button
                      className="btn btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-sm"
                      onClick={() =>
                        navigate(`/messages/${client.clientId}`, {
                          state: { client, clientId: client.clientId },
                        })
                      }
                    >
                      <FaMessage /> Message
                    </button>

                    <SplitButton
                      label="Plan"
                      icon="pi pi-plus"
                      className="flex-grow-1 rounded-3 shadow-sm"
                      model={[
                        {
                          label: "Add",
                          icon: "pi pi-pencil",
                          command: () => handlePlanAction("add"),
                        },
                        {
                          label: "Preview",
                          icon: "pi pi-eye",
                          command: () => handlePlanAction("preview"),
                        },
                      ]}
                    />
                  </div>
                  </div>
                </div>
             
            </motion.div>

            {clientDashboardLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-3">Loading dashboard data...</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="row g-2 g-md-3 mb-3">
                <div className="col-12 col-lg-8">
                  <div className="card rounded-4 shadow-sm h-100">
                    <div className="card-body p-3">
                      <h6 className="card-title mb-3 fw-bold">Today's Macros</h6>
                      <div className="row g-3">
                        {Object.entries(dashboardData.macros).map(
                          ([key, value], index) => (
                            <div key={key} className="col-6 col-sm-6 col-md-3">
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

              <div className="col-12 col-lg-4">
                <div className="card rounded-4 shadow-sm h-100">
                  <div className="card-body p-3 text-center d-flex flex-column">
                    <div className="mb-3">
                      <FaFire className="text-warning fs-2 mb-2" />
                      <h6 className="fw-bold mb-0">Streak Progress</h6>
                    </div>
                    <div className="flex-grow-1 d-flex flex-column justify-content-center">
                      <h4 className="text-primary mb-3">
                        {dashboardData.streakProgress.current} /{" "}
                        {dashboardData.streakProgress.goal}
                        <small className="text-muted ms-1">days</small>
                      </h4>
                      <div className="progress mb-3" style={{ height: "10px" }}>
                        <div
                          className="progress-bar bg-gradient"
                          style={{
                            width: `${
                              (dashboardData.streakProgress.current /
                                dashboardData.streakProgress.goal) *
                              100
                            }%`,
                            background:
                              "linear-gradient(90deg, #007AFF, #0056b3)",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>

                <div className="card rounded-4 shadow-sm mb-5 pb-4">
                  <div className="card-body p-3">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">
                      <h6 className="fw-bold mb-0">Today's Meals</h6>
                      <div className="d-flex gap-3">
                        <span className="text-success fw-semibold small">
                          ✓ {completedMeals} done
                        </span>
                        <span className="text-danger fw-semibold small">
                          ⏳ {remainingMeals} left
                        </span>
                      </div>
                    </div>

                    {dashboardData.meals.length === 0 ? (
                      <div className="text-center py-5">
                        <FaCamera className="text-muted fs-1 mb-3" />
                        <p className="text-muted mb-0">No meals planned for today</p>
                      </div>
                    ) : (
                      <div className="row g-2 g-md-3">
                        {dashboardData.meals.map((meal, idx) => (
                          <div key={idx} className="col-12 col-sm-6 col-lg-4">
                            <div
                              className={`h-100 rounded-4 p-3 position-relative ${
                                meal.completed
                                  ? "br-light-green-2"
                                  : "br-light-gray-dotted"
                              }`}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="fw-semibold mb-0 small">{meal.name}</h6>
                                {meal.completed ? (
                                  <FaCheckCircle className="text-success fs-5 flex-shrink-0 ms-2" />
                                ) : (
                                  <FaCamera className="text-secondary fs-5 flex-shrink-0 ms-2" />
                                )}
                              </div>

                              {meal.image && (
                                <div
                                  className="rounded-3 overflow-hidden mb-2"
                                  style={{ height: "140px" }}
                                >
                                  <img
                                    src={meal.image}
                                    alt={meal.name}
                                    className="img-fluid w-100 h-100 object-fit-cover"
                                  />
                                </div>
                              )}

                              <div className="mt-2">
                                <p className="mb-1 small fw-semibold">
                                  {meal.calories} kcal
                                </p>
                                <div className="small text-muted">
                                  P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

  <Dialog
        header={
          <div className="d-flex align-items-center">
            <i
              className={`pi ${
                actionType === "preview" ? "pi-eye" : "pi-pencil"
              } me-2`}
            ></i>
            <span>
              {actionType === "preview" ? "Preview" : "Add/Edit"} Meal Plan
            </span>
          </div>
        }
        visible={showDateDialog}
        style={{ width: "95vw", maxWidth: "500px" }}
        onHide={() => setShowDateDialog(false)}
        modal
        dismissableMask={false}
      >
        <div className="p-3">
          <div className="mb-3">
            <strong>Client:</strong> {client?.fullName || "N/A"}
          </div>

          <div className="mb-3">
            <label className="fw-semibold mb-3 d-block">📅 Select Date</label>
            <Calendar
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.value)}
              dateFormat="dd M yy"
              minDate={actionType === "add" ? today : null}
              maxDate={maxDate}
              inline
              className="w-100"
            />
          </div>

          {actionType === "add" &&
            selectedDate &&
            selectedDate.toDateString() !== today.toDateString() && (
              <div className="alert alert-info p-2 small mb-3">
                <i className="pi pi-info-circle me-2"></i>
                You can only edit today's plan. Future dates will be read-only.
              </div>
            )}

          {actionType === "preview" && (
            <div className="alert alert-secondary p-2 small mb-3">
              <i className="pi pi-eye me-2"></i>
              Opening in preview mode (read-only)
            </div>
          )}

          <div className="d-flex gap-2 pt-3" style={{ borderTop: '1px solid #dee2e6' }}>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setShowDateDialog(false)}
              className="p-button-text flex-grow-1"
              style={{ minHeight: "44px" }}
            />
            <Button
              label="Continue"
              icon="pi pi-check"
              onClick={handleConfirmDate}
              className="flex-grow-1"
              style={{ minHeight: "44px" }}
              autoFocus
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}