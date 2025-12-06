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
  FaPen,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { Modal, Form, Button } from "react-bootstrap";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import { getUserRole, ROLES, isClient } from "../../utils/roles";
import Heading from "../../components/navigation/Heading";
import Alert from "../../components/common/Alert";
import Loader from "../../components/display/Loader";
import CustomSplitButton from "../../components/common/CustomSplitButton";
import { FaPlus, FaEye } from "react-icons/fa";

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

  // Prevent body scroll when camera modal is open
  useEffect(() => {
    if (showCamera) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling - simpler approach
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scroll position
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showCamera]);

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
        goal: "",
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
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
          <Loader
            size="120px"
            color="var(--color-primary)"
            text="Loading your dashboard..."
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        {viewMode === "details" ? (
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
            <div className="fw-bold" style={{ 
              fontSize: "1rem",
              color: "var(--color-text-dark)"
            }}>{percentage}%</div>
          </div>
        </div>
        <h6 className="mb-1 text-capitalize fw-semibold" style={{ 
          fontSize: "0.75rem",
          color: "var(--color-text-dark)"
        }}>{label}</h6>
        <small style={{ 
          fontSize: "0.7rem",
          color: "var(--color-text-secondary)"
        }}>
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
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="var(--color-card-bg-alt)"/><circle cx="100" cy="80" r="30" fill="none" stroke="var(--color-border)" stroke-width="3" stroke-dasharray="5,5"/><path d="M 70 120 L 130 120" stroke="var(--color-border)" stroke-width="3" stroke-linecap="round"/><path d="M 70 140 L 130 140" stroke="var(--color-border)" stroke-width="3" stroke-linecap="round"/><path d="M 70 160 L 110 160" stroke="var(--color-border)" stroke-width="3" stroke-linecap="round"/><text x="100" y="190" font-family="Arial" font-size="14" fill="var(--color-muted)" text-anchor="middle">Pending</text></svg>`;
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml;charset=utf-8,${encoded}`;
  };

  return (
    <div
      className={
        viewMode === "details"
          ? "container-fluid px-2 px-md-3 py-2 py-md-3"
          : "container px-2 px-md-3"
      }
      style={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}
    >
      {/* Loading overlay when date changes (loading && dashboard exists) */}
      {loading && dashboard && (
        <Loader
          fullScreen={true}
          text="Loading dashboard..."
          color="var(--color-primary)"
        />
      )}
      
      {shouldShowHeading && <Heading pageName="details" sticky={true} />}
      <div
        className="d-flex flex-column"
        style={viewMode === "details" ? { height: "calc(100vh - 140px)" } : {}}
      >
        <div
          className={`flex-grow-1 overflow-auto mt-3 ${
            viewMode === "details" ? "pb-3" : "p-3"
          }`}
          style={viewMode !== "details" ? {
            borderRadius: "0.875rem",
            border: "1px solid #E0E0E0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            backgroundColor: "#FFFFFF"
          } : {}}
        >
          {/* Client Info Card - 3 Rows Layout */}
          <div className="card mb-2 mt-1 border-0" style={{
            borderRadius: "0.875rem",
            border: "1px solid #E0E0E0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            backgroundColor: "#FFFFFF"
          }}>
            <div className="card-body p-2">
              {/* Row 1: Username and Status */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h4 className="fw-bold mb-0" style={{ 
                  fontSize: "clamp(1rem, 3vw, 1.25rem)",
                  color: "var(--color-text-dark)",
                  lineHeight: "1.3"
                }}>{client.fullName}</h4>
                <span
                  className="badge px-2 py-1 rounded-pill"
                  style={{
                    backgroundColor: client.status === "attention" 
                      ? "rgba(220, 53, 69, 0.1)" 
                      : "rgba(34, 197, 94, 0.1)",
                    color: client.status === "attention" 
                      ? "var(--color-danger)" 
                      : "#22C55E",
                    fontSize: "0.7rem"
                  }}
                >
                  {client.status === "attention"
                    ? "Need Attention"
                    : "On Track"}
                </span>
              </div>

              {/* Row 2: Goal, Start Date, and Streak Count */}
              <div className="d-flex align-items-center flex-wrap gap-2 mb-2" style={{ fontSize: "0.75rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>
                  Goal: <span className="fw-semibold" style={{ color: "var(--color-text-dark)" }}>{client.goal}</span>
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>•</span>
                {/* <span style={{ color: "var(--color-text-secondary)" }}>
                  Start: {client.startDate}
                </span> */}
                {/* <span style={{ color: "var(--color-text-secondary)" }}>•</span> */}
                <div className="d-flex align-items-center">
                  <span
                    className="fw-bold"
                    style={{
                      color: client.streak === "Missed meal"
                        ? "var(--color-danger)"
                        : "#22C55E"
                    }}
                  >
                    {dashboardData.streakProgress.current} day streak
                  </span>
                  {client.streak === "Missed meal" ? (
                    <FaSadCry className="ms-1" style={{ color: "var(--color-danger)", fontSize: "0.9rem" }} />
                  ) : (
                    <FaFire className="ms-1" style={{ color: "#22C55E", fontSize: "0.9rem" }} />
                  )}
                </div>
              </div>

              {/* Row 3: Calendar, Message, and Plan Buttons */}
              <div className="d-flex align-items-center gap-1" style={{ flexWrap: "nowrap" }}>
                {enableDatePicker && client && (
                  <button
                    className="btn btn-sm  d-flex align-items-center justify-content-center"
                    onClick={() => setShowDatePickerModal(true)}
                    style={{ 
                      height: "36px",
                      width: "40px",
                      minWidth: "40px",
                      maxWidth: "40px",
                      minHeight: "36px",
                      maxHeight: "36px",
                      padding: "0",
                      backgroundColor: "#22C55E",
                      color: "#fff",
                      border: "none",
                      flexShrink: 0,
                      borderRadius: "4px"
                    }}
                    title="Change Date"
                  >
                    <FaCalendar style={{ fontSize: "0.9rem" }} /> 
                  </button>
                )}
                <button
                  className="btn btn-sm  d-flex align-items-center justify-content-center"
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
                  style={{ 
                    height: "36px",
                    width: "40px",
                    minWidth: "40px",
                    maxWidth: "40px",
                    minHeight: "36px",
                    maxHeight: "36px",
                    padding: "0",
                    backgroundColor: "#22C55E",
                    color: "#fff",
                    border: "none",
                    flexShrink: 0,
                    borderRadius: "4px"
                  }}
                  title="Message"
                >
                  <FaMessage style={{ fontSize: "0.9rem" }} /> 
                </button> 

                {/* Only show Plan button for trainers/admins, not for clients */}
                {!isClientRole && (
                  viewMode === "details" ? (
                    // In details view, show normal button that navigates to add plan
                    <button
                      className="btn btn-sm d-flex align-items-center justify-content-center"
                      onClick={() =>
                        navigate(`/adjust-plan/${client.clientId}`, {
                          state: { client, isView: false },
                        })
                      }
                      style={{ 
                        height: "36px",
                        width: "40px",
                        minWidth: "40px",
                        maxWidth: "40px",
                        minHeight: "36px",
                        maxHeight: "36px",
                        padding: "0",
                        backgroundColor: "#22C55E",
                        color: "#fff",
                        border: "none",
                        flexShrink: 0,
                        borderRadius: "4px"
                      }}
                      title="Add Plan"
                    >
                      <FaPlus style={{ fontSize: "0.9rem" }} />
                    </button>
                  ) : (
                    // In dashboard view, show split button with options
                    <CustomSplitButton
                      label=""
                      icon={<FaPlus style={{ fontSize: "0.9rem" }} />}
                      items={[
                        {
                          label: "Add",
                          icon: <FaPen style={{ fontSize: "0.85rem" }} />,
                          command: () =>
                            navigate(`/adjust-plan/${client.clientId}`, {
                              state: { client, isView: false },
                            }),
                        },
                        {
                          label: "Preview",
                          icon: <FaEye style={{ fontSize: "0.85rem" }} />,
                          command: () =>
                            navigate(`/adjust-plan/${client.clientId}`, {
                              state: { client, isView: true },
                            }),
                        },
                      ]}
                      width="40px"
                      height="36px"
                      title="Plan"
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-8 mb-3">
              <div className="card h-100 border-0" style={{
                borderRadius: "0.875rem",
                border: "1px solid var(--color-border)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                backgroundColor: "var(--color-card-bg)"
              }}>
                <div className="card-body p-2">
                  <div className="d-flex align-items-center mb-2">
                    <h5 className="card-title mb-0 fw-bold" style={{ 
                      fontSize: "0.85rem",
                      color: "var(--color-text-dark)",
                      lineHeight: "1.3"
                    }}>
                      {isToday
                        ? "Today's Macros"
                        : `${new Date(selectedDate).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )} Macros`}
                    </h5>
                  </div>
                  <div className="row g-2">
                    {Object.entries(dashboardData.macros).map(
                      ([key, value], index) => (
                        <div key={key} className="col-6 mb-2">
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

            <div className="col-lg-4 mb-2">
              <div className="card h-100 border-0" style={{
                borderRadius: "0.875rem",
                border: "1px solid var(--color-border)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                backgroundColor: "var(--color-card-bg)"
              }}>
                <div className="card-body text-center d-flex flex-column p-3">
                  <div className="mb-3">
                    <div className="mb-2" style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 193, 7, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto"
                    }}>
                      <FaFire style={{ 
                        fontSize: "1.5rem",
                        color: "var(--color-warning)"
                      }} />
                    </div>
                    <h6 className="fw-bold mb-1" style={{ 
                      fontSize: "0.9rem",
                      color: "var(--color-text-dark)"
                    }}>Streak Progress</h6>
                  </div>
                  <div className="flex-grow-1 d-flex flex-column justify-content-center">
                    <h3 className="mb-2" style={{ 
                      fontSize: "1.8rem",
                      color: "var(--color-primary)",
                      fontWeight: "700"
                    }}>
                      {dashboardData.streakProgress.current}
                      <small className="ms-1" style={{ 
                        fontSize: "1rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "400"
                      }}>/ {dashboardData.streakProgress.goal}</small>
                    </h3>
                    <p className="mb-3" style={{ 
                      fontSize: "0.75rem",
                      color: "var(--color-text-secondary)"
                    }}>days</p>
                    <div className="progress mb-3" style={{ 
                      height: "8px",
                      backgroundColor: "var(--color-border)",
                      borderRadius: "4px"
                    }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${
                            (dashboardData.streakProgress.current /
                              dashboardData.streakProgress.goal) *
                            100
                          }%`,
                          backgroundColor: "var(--color-primary)",
                          borderRadius: "4px",
                          transition: "width 0.3s ease"
                        }}
                      ></div>
                    </div>
                    {canShareProgress && (
                      <button
                        onClick={handleShare}
                        className="btn btn-outline-primary btn-sm rounded-pill"
                        style={{ 
                          minHeight: "36px",
                          fontSize: "0.75rem"
                        }}
                      >
                        <FaShareAlt className="me-1" style={{ fontSize: "0.7rem" }} />
                        Share
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Plan Section */}
          <div className="card mb-3 border-0" style={{
            borderRadius: "0.875rem",
            border: "1px solid var(--color-border)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            backgroundColor: "var(--color-card-bg)"
          }}>
            <div className="card-body p-2">
              <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <h5 className="card-title fw-bold mb-0" style={{ 
                  fontSize: "0.85rem",
                  color: "var(--color-text-dark)",
                  lineHeight: "1.3"
                }}>
                  {isToday
                    ? "Today's Meals"
                    : `${new Date(selectedDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })} Meals`}
                </h5>
                <div className="d-flex gap-2 flex-wrap">
                  <span className="fw-semibold" style={{ 
                    fontSize: "0.75rem",
                    color: "var(--color-success)"
                  }}>
                    {completedMeals} completed
                  </span>
                  <span className="fw-semibold" style={{ 
                    fontSize: "0.75rem",
                    color: "var(--color-danger)"
                  }}>
                    {remainingMeals} remaining
                  </span>
                </div>
              </div>

              {(dashboardData.meals || []).length === 0 ? (
                <div className="text-center py-5">
                  <FaCamera className="mb-3" style={{ 
                    fontSize: "3rem",
                    color: "var(--color-text-secondary)"
                  }} />
                  <p className="mb-0" style={{ 
                    fontSize: "0.9rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: "1.5"
                  }}>
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
                    <div key={idx} className="col-12 col-md-6">
                      <div
                        className="h-100 p-2 position-relative"
                        style={{
                          borderRadius: "0.75rem",
                          border: meal.completed 
                            ? "1px solid var(--color-success)" 
                            : "1px solid var(--color-border)",
                          backgroundColor: meal.completed 
                            ? "rgba(0, 100, 0, 0.05)" 
                            : "var(--color-card-bg)",
                          cursor:
                            meal.completed || !canUploadMeals
                              ? "default"
                              : "pointer",
                          pointerEvents:
                            meal.completed || !canUploadMeals ? "none" : "auto",
                          transition: "all 0.2s ease"
                        }}
                        onClick={() => handleMealClick(meal)}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="fw-semibold mb-0" style={{ 
                            fontSize: "0.8rem",
                            color: "var(--color-text-dark)",
                            lineHeight: "1.3"
                          }}>{meal.name}</h6>
                          {meal.completed ? (
                            <FaCheckCircle style={{ 
                              fontSize: "1.2rem",
                              color: "var(--color-success)"
                            }} />
                          ) : (
                            <FaCamera style={{ 
                              fontSize: "1.2rem",
                              color: "var(--color-text-secondary)"
                            }} />
                          )}
                        </div>

                        <div
                          className="overflow-hidden mb-2"
                          style={{
                            borderRadius: "0.75rem",
                            ...(viewMode === "details"
                              ? {
                                  position: "relative",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  minHeight: "120px",
                                  maxHeight: "200px",
                                  backgroundColor: "var(--color-card-bg-alt)",
                                }
                              : { height: "120px" })
                          }}
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
                                background: "rgba(0, 0, 0, 0.05)",
                                pointerEvents: "none",
                                borderRadius: "0.75rem"
                              }}
                            >
                              <div className="text-center">
                                <FaCamera
                                  className="mb-2"
                                  style={{ 
                                    fontSize: "2rem",
                                    color: "var(--color-text-secondary)"
                                  }}
                                />
                                <div className="small fw-semibold" style={{ 
                                  color: "var(--color-text-secondary)"
                                }}>
                                  Pending
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <p className="mb-1" style={{ 
                          fontSize: "0.75rem",
                          color: "var(--color-text-secondary)"
                        }}>
                          {meal.calories} calories
                          {meal.completed && meal.plannedCalories && (
                            <span className="ms-1" style={{ color: "var(--color-success)" }}>
                              (Target: {meal.plannedCalories})
                            </span>
                          )}
                        </p>
                        <div style={{ 
                          fontSize: "0.7rem",
                          color: "var(--color-text-secondary)"
                        }}>
                          P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                        </div>
                        {meal.completed && (
                          <div className="mt-1" style={{ 
                            fontSize: "0.7rem",
                            color: "var(--color-success)"
                          }}>
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
          <Modal.Header closeButton style={{ 
            borderBottomColor: "var(--color-border)",
            backgroundColor: "var(--color-card-bg)"
          }}>
            <Modal.Title style={{ 
              fontSize: "1.1rem",
              color: "var(--color-text-dark)"
            }}>📅 Select Date</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3 p-md-4" style={{ 
            backgroundColor: "var(--color-card-bg)"
          }}>
            <Form.Group>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="rounded-3"
                style={{ 
                  minHeight: "44px", 
                  fontSize: "16px",
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-input-bg)",
                  color: "var(--color-text-dark)"
                }}
              />
            </Form.Group>
          </Modal.Body>
        </Modal>
      )}

      {/* Camera Modal - Bootstrap Modal */}
      {showCamera && canUploadMeals && (
        <Modal
          show={showCamera}
          onHide={closeCamera}
          centered
          fullscreen="md-down"
          size="lg"
          backdrop="static"
          keyboard={!isProcessing}
        >
          <Modal.Header 
            closeButton={!isProcessing}
            className="border-bottom border-secondary"
            style={{ backgroundColor: "var(--color-card-bg)" }}
          >
            <Modal.Title className="fw-bold" style={{ 
              fontSize: "1.1rem",
              color: "var(--color-text-dark)"
            }}>
              Capture {selectedMeal?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body 
            className="p-3 d-flex align-items-center justify-content-center"
            style={{ 
              backgroundColor: "#000",
              minHeight: "50vh",
              maxHeight: "70vh",
              overflow: "hidden"
            }}
          >
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-100"
                style={{ 
                  maxHeight: "60vh",
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: "0.75rem"
                }}
              />
            </div>
            <canvas ref={canvasRef} className="d-none" />
          </Modal.Body>
          <Modal.Footer 
            className="border-top border-secondary d-flex gap-2"
            style={{ backgroundColor: "var(--color-card-bg)" }}
          >
            <Button
              variant="primary"
              className="flex-grow-1 rounded-pill"
              onClick={capturePhoto}
              disabled={isProcessing}
              style={{ fontSize: "0.85rem" }}
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
            </Button>
            <Button
              variant="outline-secondary"
              className="rounded-pill"
              onClick={closeCamera}
              disabled={isProcessing}
              style={{ fontSize: "0.85rem" }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
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
