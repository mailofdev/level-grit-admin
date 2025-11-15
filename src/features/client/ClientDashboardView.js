import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getClientDashboardThunk, uploadMealThunk } from "./clientThunks";
import ShareProgressModal from "../../components/common/ShareProgressModal";
import {
  FaFire,
  FaCheckCircle,
  FaCamera,
  FaSadCry,
  FaShareAlt,
  FaTimes,
  FaCalendar,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { SplitButton } from "primereact/splitbutton";
import { Modal, Form } from "react-bootstrap";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import { getUserRole, ROLES, isClient } from "../../utils/roles";
import Heading from "../../components/navigation/Heading";

/**
 * Shared Client Dashboard View Component
 *
 * A unified component that handles both client-dashboard and client-details views.
 * Dynamically adjusts UI and functionality based on:
 * - User role (client vs trainer)
 * - View mode (dashboard vs details)
 * - Feature flags/permissions
 *
 * @param {Object} props
 * @param {string} props.viewMode - 'dashboard' or 'details'
 * @param {string|number} props.clientId - Optional client ID (for trainer viewing client)
 * @param {boolean} props.enableMealUpload - Enable meal upload functionality (default: true for client role)
 * @param {boolean} props.enableShareProgress - Enable share progress feature (default: true for client role)
 * @param {boolean} props.enableDatePicker - Enable date picker for viewing different dates (default: true)
 * @param {boolean} props.showHeading - Show heading component (default: false for dashboard, true for details)
 */
export default function ClientDashboardView({
  viewMode = "dashboard", // 'dashboard' or 'details'
  clientId = null,
  enableMealUpload = null, // null = auto-detect based on role
  enableShareProgress = null, // null = auto-detect based on role
  enableDatePicker = true,
  showHeading = null, // null = auto-detect based on viewMode
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get current user and role
  const loggedInUser = getDecryptedUser();
  const userRole = getUserRole(loggedInUser);
  const isClientRole = isClient(userRole);

  // Auto-detect feature flags based on role if not explicitly provided
  const canUploadMeals =
    enableMealUpload !== null
      ? enableMealUpload
      : isClientRole && viewMode === "dashboard";
  const canShareProgress =
    enableShareProgress !== null
      ? enableShareProgress
      : isClientRole && viewMode === "dashboard";
  const shouldShowHeading =
    showHeading !== null ? showHeading : viewMode === "details";

  // Determine final clientId (use prop, URL param, or logged-in user)
  const params = useParams();
  const clientIdFromUrl = params?.clientId;
  const clientFromState = location.state?.client;
  const finalClientId =
    clientId ||
    clientIdFromUrl ||
    (isClientRole ? loggedInUser?.userId || loggedInUser?.id : null);

  // Redux state - both views use the same client slice
  const { dashboard, loading, error } = useSelector((state) => state.client);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // State management
  const [showCamera, setShowCamera] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [stream, setStream] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  // Check if selected date is today
  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = () => {
      if (isToday) {
        // For today, don't send date
        if (finalClientId) {
          dispatch(getClientDashboardThunk({ clientId: finalClientId }));
        } else {
          dispatch(getClientDashboardThunk());
        }
      } else {
        // For other dates, send dateTime in ISO format
        const dateTime = new Date(selectedDate).toISOString();
        if (finalClientId) {
          dispatch(
            getClientDashboardThunk({ clientId: finalClientId, dateTime })
          );
        } else {
          dispatch(getClientDashboardThunk({ dateTime }));
        }
      }
    };

    fetchData();
  }, [dispatch, finalClientId, selectedDate, isToday]);

  // Handle date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setShowDatePickerModal(false);
    // API call will be triggered automatically by useEffect when selectedDate changes
  };

  // Parse macro strings from "consumed/target" format
  const parseMacro = (macroString) => {
    if (!macroString) return { value: 0, target: 0 };
    const [value, target] = macroString.split("/").map(parseFloat);
    return { value: value || 0, target: target || 0 };
  };

  // Prepare client and dashboard data from API response
  const client = dashboard
    ? {
        clientId: dashboard.clientId || finalClientId,
        trainerId: dashboard.trainerId,
        clientName: dashboard.clientName,
        fullName: dashboard.clientName,
        goal: "- - -",
        startDate: new Date().toLocaleDateString(),
        status: dashboard.currentStreakDays >= 3 ? "on-track" : "attention",
        streak:
          dashboard.currentStreakDays > 0
            ? `${dashboard.currentStreakDays} days`
            : "Missed meal",
      }
    : clientFromState || null;

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
          plannedMealId: planned.id || planned.uploadId, // Store plannedMealId for client role
          // Show uploaded image if completed, otherwise show planned image
          image: uploadedMeal?.base64Image
            ? `data:image/jpeg;base64,${uploadedMeal.base64Image}`
            : planned.base64Image
            ? `data:image/jpeg;base64,${planned.base64Image}`
            : null,
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
        {viewMode === "details" ? (
          <div className="alert alert-danger mt-5" role="alert">
            <h4 className="alert-heading">Error Loading Dashboard</h4>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (finalClientId) {
                  dispatch(
                    getClientDashboardThunk({ clientId: finalClientId })
                  );
                } else {
                  dispatch(getClientDashboardThunk());
                }
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <p className="text-danger text-center mt-5">{error}</p>
        )}
      </div>
    );
  }

  if (!dashboardData || !client) {
    return (
      <div className="container">
        <p className="text-muted mt-4 text-center">Loading dashboard data...</p>
      </div>
    );
  }

  const completedMeals = dashboardData.meals.filter((m) => m.completed).length;
  const remainingMeals = dashboardData.meals.length - completedMeals;

  // Prepare data for ShareProgressModal
  const shareClientData =
    client && dashboardData
      ? {
          name: client.clientName || "Client",
          streak: dashboardData.streakProgress.current,
          streakCurrent: dashboardData.streakProgress.current,
          streakGoal: dashboardData.streakProgress.goal,
          completedMeals: completedMeals,
          totalMeals: dashboardData.meals.length,
          macros: [
            {
              label: "calories",
              value: dashboardData.macros.calories.value,
              target: dashboardData.macros.calories.target,
            },
            {
              label: "protein",
              value: dashboardData.macros.protein.value,
              target: dashboardData.macros.protein.target,
            },
          ],
        }
      : null;

  // Handle meal click - open camera for incomplete meals (only if upload is enabled)
  const handleMealClick = (meal) => {
    if (!meal.completed && canUploadMeals) {
      setSelectedMeal(meal);
      setShowCamera(true);
      startCamera();
    }
  };

  // Start camera stream
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Capture photo and upload
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !selectedMeal) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const base64Image = canvas.toDataURL("image/jpeg", 0.8);
    const base64Data = base64Image.split(",")[1];

    // Upload via Redux thunk
    setIsProcessing(true);
    try {
      const mealData = {
        mealPlanId: selectedMeal.uploadId,
        mealName: selectedMeal.mealName,
        message: "Meal image uploaded",
        imageBase64: base64Data,
      };

      // For client role, include plannedMealId
      // if (isClientRole && selectedMeal.plannedMealId) {
      //   mealData.plannedMealId = selectedMeal.plannedMealId;
      // }

      await dispatch(uploadMealThunk(mealData)).unwrap();

      alert("✅ Meal uploaded successfully!");
      closeCamera();

      // Refresh dashboard
      if (isToday) {
        if (finalClientId) {
          dispatch(getClientDashboardThunk({ clientId: finalClientId }));
        } else {
          dispatch(getClientDashboardThunk());
        }
      } else {
        const dateTime = new Date(selectedDate).toISOString();
        if (finalClientId) {
          dispatch(
            getClientDashboardThunk({ clientId: finalClientId, dateTime })
          );
        } else {
          dispatch(getClientDashboardThunk({ dateTime }));
        }
      }
    } catch (err) {
      console.error("Error uploading meal:", err);
      alert("❌ Failed to upload meal image: " + (err.message || err));
    } finally {
      setIsProcessing(false);
    }
  };

  // Close camera modal
  const closeCamera = () => {
    stopCamera();
    setShowCamera(false);
    setSelectedMeal(null);
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

  const handleShare = () => {
    setShowShareModal(true);
  };

  // Helper function to get placeholder image for incomplete meals
  const getMealPlaceholderImage = () => {
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f8f9fa"/><circle cx="100" cy="80" r="30" fill="none" stroke="#dee2e6" stroke-width="3" stroke-dasharray="5,5"/><path d="M 70 120 L 130 120" stroke="#dee2e6" stroke-width="3" stroke-linecap="round"/><path d="M 70 140 L 130 140" stroke="#dee2e6" stroke-width="3" stroke-linecap="round"/><path d="M 70 160 L 110 160" stroke="#dee2e6" stroke-width="3" stroke-linecap="round"/><text x="100" y="190" font-family="Arial" font-size="14" fill="#6c757d" text-anchor="middle">Pending</text></svg>`;
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml;charset=utf-8,${encoded}`;
  };

  return (
    <div
      className={
        viewMode === "details"
          ? "container-fluid px-2 px-md-3 py-3 py-md-4"
          : "container"
      }
    >
      {shouldShowHeading && <Heading pageName="details" sticky={true} />}
      <div
        className="d-flex flex-column"
        style={viewMode === "details" ? { height: "calc(100vh - 140px)" } : {}}
      >
        <div
          className={`flex-grow-1 overflow-auto ${
            viewMode === "details" ? "pb-3" : "p-3 rounded shadow-sm"
          }`}
        >
          {/* Client Info Card */}
          <div className="card shadow-sm rounded-4 mb-3 mt-3 border-0">
            <div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <div>
                <h4 className="fw-bold">{client.fullName}</h4>
                <p className="mb-1 text-muted small">
                  Goal: <span className="fw-semibold">{client.goal}</span> •
                  Start: {client.startDate}
                </p>
                <span
                  className={`badge px-3 py-2 ${
                    client.status === "attention" ? "bg-danger" : "bg-success"
                  }`}
                >
                  {client.status === "attention"
                    ? "Need Attention"
                    : "On Track"}
                </span>
              </div>

              <div className="text-md-end mt-3 mt-md-0">
                <div className="d-flex align-items-center justify-content-md-end mb-3">
                  <span
                    className={`fw-bold ${
                      client.streak === "Missed meal"
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {dashboardData.streakProgress.current} day streak
                  </span>
                  {client.streak === "Missed meal" ? (
                    <FaSadCry className="text-danger ms-2" />
                  ) : (
                    <FaFire className="text-success ms-2" />
                  )}
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                  {enableDatePicker && client && (
                    <button
                      className="bg-white fs-6 btn-sm p-2 d-flex align-items-center border-0 rounded-3 shadow-sm"
                      onClick={() => setShowDatePickerModal(true)}
                    >
                      <FaCalendar className="me-1" />
                      <span className="d-none d-sm-inline">Change date</span>
                    </button>
                  )}
                  <button
                    className="bg-white fs-6 btn-sm p-2 d-flex align-items-center border-0 rounded-3 shadow-sm"
                    onClick={() =>
                      navigate(
                        viewMode === "dashboard"
                          ? `/client-messages/${client.trainerId}`
                          : `/messages/${client.clientId}`,
                        {
                          state: {
                            client,
                            trainerId: client.trainerId,
                            clientId: client.clientId,
                            clientName: client.clientName,
                          },
                        }
                      )
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
                          navigate(`/adjust-plan/${client.clientId}`, {
                            state: { client, isView: false },
                          }),
                      },
                      {
                        label: "Preview",
                        icon: "pi pi-eye",
                        command: () =>
                          navigate(`/adjust-plan/${client.clientId}`, {
                            state: { client, isView: true },
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
                    <h5 className="card-title mb-0 fw-bold">
                      {isToday
                        ? "Today's Macros"
                        : `${new Date(selectedDate).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )} Macros`}
                    </h5>
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
                    {canShareProgress && (
                      <button
                        onClick={handleShare}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <FaShareAlt className="me-2" />
                        Share Progress
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Plan Section */}
          <div className="card rounded-4 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title fw-bold mb-0">
                  {isToday
                    ? "Today's Meals"
                    : `${new Date(selectedDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })} Meals`}
                </h5>
                <div>
                  <span className="text-success fw-semibold me-2">
                    {completedMeals} completed
                  </span>
                  <span className="text-danger fw-semibold">
                    {remainingMeals} remaining
                  </span>
                </div>
              </div>

              {(dashboardData.meals || []).length === 0 ? (
                <div className="text-center py-5">
                  <FaCamera className="text-muted fs-1 mb-3" />
                  <p className="text-muted mb-0">
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
                          cursor:
                            meal.completed || !canUploadMeals
                              ? "default"
                              : "pointer",
                          pointerEvents:
                            meal.completed || !canUploadMeals ? "none" : "auto",
                        }}
                        onClick={() => handleMealClick(meal)}
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
                          className={`rounded-3 overflow-hidden mb-2 ${
                            viewMode === "details"
                              ? "position-relative d-flex align-items-center justify-content-center"
                              : ""
                          }`}
                          style={
                            viewMode === "details"
                              ? {
                                  minHeight: "120px",
                                  maxHeight: "200px",
                                  backgroundColor:
                                    "var(--color-surface-variant)",
                                }
                              : { height: "120px" }
                          }
                        >
                          {meal.image ? (
                            <img
                              src={meal.image}
                              alt={meal.name}
                              className="img-fluid"
                              style={
                                viewMode === "details"
                                  ? {
                                      opacity: meal.completed ? 1 : 0.6,
                                      maxHeight: "200px",
                                      width: "100%",
                                      objectFit: "contain",
                                    }
                                  : {
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      opacity: meal.completed ? 1 : 0.7,
                                    }
                              }
                            />
                          ) : (
                            <img
                              src={getMealPlaceholderImage()}
                              alt="Meal not completed"
                              className="img-fluid"
                              style={
                                viewMode === "details"
                                  ? {
                                      opacity: 0.8,
                                      filter: meal.completed
                                        ? "none"
                                        : "grayscale(100%)",
                                      maxHeight: "200px",
                                      width: "100%",
                                      objectFit: "contain",
                                    }
                                  : {
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }
                              }
                            />
                          )}
                          {!meal.completed && viewMode === "details" && (
                            <div
                              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                              style={{
                                background: "rgba(0, 0, 0, 0.1)",
                                pointerEvents: "none",
                              }}
                            >
                              <div className="text-center">
                                <FaCamera
                                  className="text-muted mb-2"
                                  style={{ fontSize: "2rem" }}
                                />
                                <div className="small text-muted fw-semibold">
                                  Pending
                                </div>
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Date Picker Modal - Matching AdjustPlan style */}
      {enableDatePicker && (
        <Modal
          show={showDatePickerModal}
          onHide={() => setShowDatePickerModal(false)}
          centered
          fullscreen="sm-down"
        >
          <Modal.Header closeButton>
            <Modal.Title>📅 Select Date</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3 p-md-4">
            <Form.Group>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="rounded-3"
                style={{ minHeight: "48px", fontSize: "16px" }}
              />
            </Form.Group>
          </Modal.Body>
        </Modal>
      )}

      {/* Camera Modal */}
      {showCamera && canUploadMeals && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            zIndex: 9999,
          }}
        >
          <div
            className="bg-white rounded-4 p-4"
            style={{ maxWidth: "600px", width: "90%" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Capture {selectedMeal?.name}</h5>
              <button
                className="btn btn-link text-dark p-0"
                onClick={closeCamera}
                disabled={isProcessing}
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="mb-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-100 rounded-3"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary flex-grow-1"
                onClick={capturePhoto}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCamera className="me-2" />
                    Capture Photo
                  </>
                )}
              </button>
              <button
                className="btn btn-secondary"
                onClick={closeCamera}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Progress Modal */}
      {shareClientData && canShareProgress && (
        <ShareProgressModal
          show={showShareModal}
          onHide={() => setShowShareModal(false)}
          clientData={shareClientData}
        />
      )}
    </div>
  );
}
