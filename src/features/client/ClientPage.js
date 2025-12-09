import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { getClientDashboardThunk, uploadMealThunk } from "./clientThunks";
import ShareProgressModal from "../../components/common/ShareProgressModal";
import {
  FaFire,
  FaCheckCircle,
  FaCamera,
  FaSadCry,
  FaShareAlt,
  FaCalendar,
  FaHeart,
  FaComment,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Modal, Form, Button } from "react-bootstrap";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import { getUserRole, isClient } from "../../utils/roles";
import Loader from "../../components/display/Loader";
import Alert from "../../components/common/Alert";
import { FaMessage } from "react-icons/fa6";
/**
 * ClientPage - Social Media Style Client Dashboard
 * 
 * Modern, Instagram-inspired UI for client dashboard with:
 * - Sticky header with greeting
 * - Social media style cards for meals
 * - Modern macro progress displays
 * - Smooth animations and transitions
 * - Mobile-first responsive design
 * - All existing functionality preserved
 */
export default function ClientPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = getDecryptedUser();
  
  // Redux state
  const { dashboard, loading, error } = useSelector((state) => state.client);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const touchStartYRef = useRef(0);

  // State management
  const [showCamera, setShowCamera] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [stream, setStream] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [pullToRefresh, setPullToRefresh] = useState({ isPulling: false, distance: 0 });
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "success" });
  const [cameraReady, setCameraReady] = useState(false);

  // Check if selected date is today
  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  // Get user role
  const userRole = getUserRole(user);
  const isClientRole = isClient(userRole);
  const finalClientId = isClientRole ? user?.userId || user?.id : null;

  // Prevent body scroll when camera modal is open
  useEffect(() => {
    if (showCamera) {
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
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
    };

    fetchData();
  }, [dispatch, finalClientId, selectedDate, isToday]);

  // Pull-to-refresh handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (touchStartYRef.current === 0) return;
      
      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStartYRef.current;
      
      if (window.scrollY === 0 && distance > 0) {
        e.preventDefault();
        const pullDistance = Math.min(distance, 100);
        setPullToRefresh({ isPulling: true, distance: pullDistance });
      }
    };

    const handleTouchEnd = () => {
      if (pullToRefresh.isPulling && pullToRefresh.distance > 50) {
        // Refresh data
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
      }
      setPullToRefresh({ isPulling: false, distance: 0 });
      touchStartYRef.current = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullToRefresh, dispatch, finalClientId, selectedDate, isToday]);

  // Handle date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setShowDatePickerModal(false);
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
    : null;

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
  if (dashboard && dashboardData) {
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
          plannedMealId: planned.id || planned.uploadId,
          image: uploadedMeal?.base64Image
            ? `data:image/jpeg;base64,${uploadedMeal.base64Image}`
            : planned.base64Image
            ? `data:image/jpeg;base64,${planned.base64Image}`
            : null,
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
      <Loader
        fullScreen={true}
        text="Loading your dashboard..."
        color="var(--color-primary)"
      />
    );
  }

  if (error) {
    return (
      <div className="container">
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
          }}
        >
          Retry
        </button>
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
  const shareClientData = client && dashboardData
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

  // Handle meal click - open camera for incomplete meals
  const handleMealClick = (meal) => {
    if (!meal.completed) {
      setSelectedMeal(meal);
      setShowCamera(true);
      startCamera();
    }
  };

  // Start camera stream
  const startCamera = async () => {
    try {
      setCameraReady(false);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setAlertModal({
        show: true,
        message: "Unable to access camera. Please check permissions.",
        type: "error"
      });
      setShowCamera(false);
      setCameraReady(false);
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

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL("image/jpeg", 0.8);
    const base64Data = base64Image.split(",")[1];

    // Store meal data for upload
    const mealData = {
      mealPlanId: selectedMeal.uploadId,
      mealName: selectedMeal.mealName,
      message: "Meal image uploaded",
      imageBase64: base64Data,
    };

    // Close camera modal immediately
    closeCamera();

    // Show loader and upload
    setIsUploading(true);
    try {
      await dispatch(uploadMealThunk(mealData)).unwrap();

      setAlertModal({
        show: true,
        message: "Meal uploaded successfully!",
        type: "success"
      });

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
      setAlertModal({
        show: true,
        message: "Failed to upload meal image: " + (err.message || err),
        type: "error"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Close camera modal
  const closeCamera = () => {
    stopCamera();
    setShowCamera(false);
    setSelectedMeal(null);
    setCameraReady(false);
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
    <>
      <style>{`
        .client-page-container {
          min-height: 100vh;
          padding-bottom: env(safe-area-inset-bottom);
          -webkit-overflow-scrolling: touch;
          background: var(--color-bg);
        }
        .client-header {
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: var(--glass-bg) !important;
          border-bottom: 1px solid var(--color-border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .transform-rotate-neg90 {
          transform: rotate(-90deg);
        }
        .card-modern {
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .card-modern:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }
        .meal-card-item {
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .meal-card-item:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }
        .meal-card-item:active {
          transform: scale(0.98);
        }
        .meal-card-item.completed {
          border-color: var(--color-success);
          background: linear-gradient(135deg, rgba(0, 100, 0, 0.05), rgba(0, 100, 0, 0.02));
        }
        .meal-image-container {
          width: 100%;
          aspect-ratio: 16 / 9;
          max-height: 200px;
          overflow: hidden;
          background: var(--color-card-bg-alt);
          position: relative;
        }
        .meal-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .meal-card-item:hover .meal-image {
          transform: scale(1.05);
        }
        .profile-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .action-button {
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 10px 16px;
          color: var(--color-text-dark);
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          min-height: 44px;
        }
        .action-button:hover {
          background: var(--color-card-bg-hover);
          border-color: var(--color-primary);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .action-button:active {
          transform: scale(0.98);
        }
        .macro-bar {
          height: 8px;
          background: var(--color-border);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 8px;
        }
        .macro-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .stats-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: var(--color-card-bg-alt);
          border: 1px solid var(--color-border);
        }
      `}</style>
      
      <div
        ref={scrollContainerRef}
        className="client-page-container bg-theme"
      >
        {/* Pull-to-refresh indicator */}
        {pullToRefresh.isPulling && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '0.5rem',
              zIndex: 1000,
              transition: 'opacity 0.2s ease',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem',
                transform: `translateY(${Math.min(pullToRefresh.distance - 20, 60)}px) rotate(${pullToRefresh.distance * 3.6}deg)`,
                transition: 'transform 0.1s ease',
              }}
            >
              ↻
            </div>
          </div>
        )}

        {/* Header Section - Card Style */}
        <div className="client-header px-3 py-3" style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}>
          <Container fluid className="px-0">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                {/* Profile Avatar */}
                <div className="profile-avatar">
                  {(user?.fullName?.charAt(0) || 'C').toUpperCase()}
                </div>
                <div>
                  <h5 className="mb-0 fw-bold text-theme-dark" style={{ fontSize: '1.1rem' }}>
                    {user?.fullName?.split(' ')[0] || 'Client'}
                  </h5>
                  <p className="mb-0 text-muted small" style={{ fontSize: '0.8rem' }}>
                    {isToday ? 'Today' : new Date(selectedDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="action-button"
                  onClick={() => setShowDatePickerModal(true)}
                  title="Change Date"
                >
                  <FaCalendar style={{ fontSize: "16px" }} /> 
                  <span className="d-none d-sm-inline">Date</span>
                </button>
                <button
                  className="action-button"
                  onClick={() =>
                    navigate(`/client-messages/${client.trainerId}`, {
                      state: {
                        client,
                        trainerId: client.trainerId,
                        clientId: client.clientId,
                        clientName: client.clientName,
                      },
                    })
                  }
                  title="Message Trainer"
                >
                  <FaMessage style={{ fontSize: "16px" }} /> 
                  <span className="d-none d-sm-inline">Message</span>
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* Loading overlay when date changes or uploading meal */}
        {(loading && dashboard) || isUploading ? (
          <Loader
            fullScreen={true}
            text={isUploading ? "Uploading meal..." : "Loading dashboard..."}
            color="var(--color-primary)"
          />
        ) : null}

        {/* Main Content - Card Format */}
        <div style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))', paddingTop: '1rem' }}>
          <Container fluid className="px-3">
            {/* Streak Card */}
            <div className="card-modern">
              <div className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "56px",
                        height: "56px",
                        background: client.streak === "Missed meal" 
                          ? "linear-gradient(135deg, #ff6b6b, #ee5a6f)"
                          : "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      {client.streak === "Missed meal" ? (
                        <FaSadCry style={{ color: "white", fontSize: "1.5rem" }} />
                      ) : (
                        <FaFire style={{ color: "white", fontSize: "1.5rem" }} />
                      )}
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold text-theme-dark">
                        {dashboardData.streakProgress.current} Day Streak
                      </h5>
                      <p className="mb-0 text-muted small">
                        {client.status === "attention" ? "Keep going! 💪" : "You're on fire! 🔥"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleShare}
                    className="action-button"
                    style={{ minWidth: 'auto', padding: '10px' }}
                  >
                    <FaShareAlt style={{ fontSize: "18px" }} />
                  </button>
                </div>
                <div className="macro-bar">
                  <div
                    className="macro-bar-fill"
                    style={{
                      width: `${
                        Math.min((dashboardData.streakProgress.current /
                          dashboardData.streakProgress.goal) *
                        100, 100)
                      }%`,
                      background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                    }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="text-muted small">
                    {dashboardData.streakProgress.current} of {dashboardData.streakProgress.goal} days
                  </span>
                  <span className="text-muted small fw-semibold">
                    {Math.round((dashboardData.streakProgress.current / dashboardData.streakProgress.goal) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Macros Card */}
            <div className="card-modern">
              <div className="p-4">
                <h5 className="mb-4 fw-bold text-theme-dark">
                  {isToday
                    ? "Today's Nutrition"
                    : `${new Date(selectedDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })} Nutrition`}
                </h5>
                <div className="row g-4">
                  {Object.entries(dashboardData.macros).map(
                    ([key, value], index) => {
                      const percentage = value.target > 0 ? Math.round((value.value / value.target) * 100) : 0;
                      const colors = [
                        { bg: 'var(--color-primary)', text: 'var(--color-primary)' },
                        { bg: '#405DE6', text: '#405DE6' },
                        { bg: '#FCAF45', text: '#FCAF45' },
                        { bg: '#833AB4', text: '#833AB4' },
                      ];
                      const color = colors[index % colors.length];
                      return (
                        <div key={key} className="col-6 col-md-3">
                          <div className="text-center">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-semibold text-capitalize text-theme-dark" style={{ fontSize: '14px' }}>
                                {key}
                              </span>
                              <span className="fw-bold" style={{ fontSize: '14px', color: color.text }}>
                                {percentage}%
                              </span>
                            </div>
                            <div className="macro-bar">
                              <div
                                className="macro-bar-fill"
                                style={{
                                  width: `${Math.min(percentage, 100)}%`,
                                  background: color.bg,
                                }}
                              ></div>
                            </div>
                            <div className="mt-2 text-muted small">
                              {Math.round(value.value)} / {Math.round(value.target)}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Meals Section - Card Grid */}
            <div className="card-modern">
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <h6 className="mb-0 fw-bold text-theme-dark" style={{ fontSize: '0.95rem' }}>
                    {isToday
                      ? "Today's Meals"
                      : `${new Date(selectedDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })} Meals`}
                  </h6>
                  <div className="d-flex gap-2 flex-nowrap">
                    <span className="stats-badge" style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)', whiteSpace: 'nowrap' }}>
                      {completedMeals} completed
                    </span>
                    <span className="stats-badge" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)', whiteSpace: 'nowrap' }}>
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
                    <p className="mb-0 text-muted">
                      No meals planned for{" "}
                      {isToday
                        ? "today"
                        : new Date(selectedDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}
                    </p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {dashboardData.meals.map((meal, idx) => (
                      <div key={idx} className="col-12 col-md-6 col-lg-4">
                        <div
                          className={`meal-card-item ${meal.completed ? 'completed' : ''}`}
                          onClick={() => !meal.completed && handleMealClick(meal)}
                          style={{
                            cursor: meal.completed ? 'default' : 'pointer',
                            pointerEvents: meal.completed ? 'none' : 'auto',
                          }}
                        >
                          {/* Meal Image */}
                          <div className="meal-image-container">
                            {meal.image ? (
                              <img
                                src={meal.image}
                                alt={meal.name}
                                className="meal-image"
                                style={{
                                  opacity: meal.completed ? 1 : 0.7,
                                }}
                              />
                            ) : (
                              <img
                                src={getMealPlaceholderImage()}
                                alt="Meal not completed"
                                className="meal-image"
                              />
                            )}
                            {!meal.completed && (
                              <div
                                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                style={{
                                  background: "rgba(0, 0, 0, 0.2)",
                                  pointerEvents: "none",
                                }}
                              >
                                <div className="text-center text-white">
                                  <FaCamera
                                    className="mb-2"
                                    style={{ fontSize: "2rem" }}
                                  />
                                  <div className="fw-semibold" style={{ fontSize: "13px" }}>
                                    Tap to upload
                                  </div>
                                </div>
                              </div>
                            )}
                            {meal.completed && (
                              <div
                                className="position-absolute top-2 end-2"
                                style={{
                                  background: "rgba(0, 100, 0, 0.9)",
                                  borderRadius: "50%",
                                  padding: "6px",
                                }}
                              >
                                <FaCheckCircle style={{ color: "white", fontSize: "20px" }} />
                              </div>
                            )}
                          </div>

                          {/* Meal Info */}
                          <div className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0 fw-bold text-theme-dark" style={{ fontSize: "1rem" }}>
                                {meal.mealName}
                              </h6>
                            </div>
                            <div className="mb-2">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="fw-bold text-theme-dark" style={{ fontSize: "1.1rem" }}>
                                  {Math.round(meal.calories)}
                                </span>
                                <span className="text-muted small">calories</span>
                              </div>
                              <div className="text-muted small">
                                P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                              </div>
                            </div>
                            {meal.completed && meal.plannedCalories && (
                              <div className="mt-2">
                                <span className="badge bg-success rounded-pill small">
                                  ✓ Target: {meal.plannedCalories} cal
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Date Picker Modal */}
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

      {/* Camera Modal */}
      {showCamera && (
        <Modal
          show={showCamera}
          onHide={closeCamera}
          centered
          fullscreen="md-down"
          size="lg"
          backdrop="static"
          keyboard={true}
        >
          <Modal.Header 
            closeButton={true}
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
            className="p-3 d-flex align-items-center justify-content-center position-relative"
            style={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              minHeight: "50vh",
              maxHeight: "70vh",
              overflow: "hidden"
            }}
          >
            {!cameraReady && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white" style={{ zIndex: 1 }}>
                <div
                  className="mb-4 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <FaCamera style={{ fontSize: "2.5rem" }} />
                </div>
                <p className="fw-semibold mb-1" style={{ fontSize: "1.1rem" }}>
                  Preparing Camera...
                </p>
                <p className="small mb-0 opacity-75" style={{ fontSize: "0.9rem" }}>
                  Please wait while we access your camera
                </p>
              </div>
            )}
            <div className="w-100 h-100 d-flex align-items-center justify-content-center position-relative" style={{ zIndex: 2 }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-100"
                style={{ 
                  maxHeight: "60vh",
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: "0.75rem",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  opacity: cameraReady ? 1 : 0,
                  transition: "opacity 0.3s ease"
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
              style={{ fontSize: "0.85rem" }}
            >
              <FaCamera className="me-2" />
              Capture Photo
            </Button>
            <Button
              variant="outline-secondary"
              className="rounded-pill"
              onClick={closeCamera}
              style={{ fontSize: "0.85rem" }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Share Progress Modal */}
      {shareClientData && (
        <ShareProgressModal
          show={showShareModal}
          onHide={() => setShowShareModal(false)}
          clientData={shareClientData}
        />
      )}

      {/* Alert Modal */}
      <Modal
        show={alertModal.show}
        onHide={() => setAlertModal({ show: false, message: "", type: "success" })}
        centered
        size="sm"
      >
        <Modal.Header 
          closeButton
          className="text-white border-0"
          style={{
            background: alertModal.type === "success"
              ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
              : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        >
          <Modal.Title className="d-flex align-items-center gap-2">
            {alertModal.type === "success" ? (
              <FaCheckCircle className="fs-4" />
            ) : (
              <FaTimesCircle className="fs-4" />
            )}
            {alertModal.type === "success" ? "Success" : "Error"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4" style={{ backgroundColor: "var(--color-card-bg)" }}>
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: alertModal.type === "success"
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
            }}
          >
            {alertModal.type === "success" ? (
              <FaCheckCircle
                style={{
                  fontSize: "2rem",
                  color: "#22c55e"
                }}
              />
            ) : (
              <FaTimesCircle
                style={{
                  fontSize: "2rem",
                  color: "#ef4444"
                }}
              />
            )}
          </div>
          <p className="fw-semibold fs-6 mb-0 text-theme-dark">
            {alertModal.message}
          </p>
        </Modal.Body>
        <Modal.Footer 
          className="border-0 justify-content-center"
          style={{ backgroundColor: "var(--color-card-bg)" }}
        >
          <Button
            variant="primary"
            className="fw-semibold px-5"
            style={{
              background: alertModal.type === "success"
                ? "#22c55e"
                : "#ef4444",
              borderColor: alertModal.type === "success"
                ? "#22c55e"
                : "#ef4444",
              color: "#ffffff",
              minHeight: "44px",
            }}
            onClick={() => setAlertModal({ show: false, message: "", type: "success" })}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

