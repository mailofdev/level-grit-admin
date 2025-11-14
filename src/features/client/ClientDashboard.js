import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientDashboardThunk,
  uploadMealThunk,
} from "../../features/client/clientThunks";
import ShareProgressModal from "../../components/common/ShareProgressModal";
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

export default function ClientDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { dashboard, loading, error } = useSelector((state) => state.client);
  console.log("Dashboard data:", dashboard);
  console.log("ClientId:", dashboard?.clientId, "TrainerId:", dashboard?.trainerId);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [showCamera, setShowCamera] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [stream, setStream] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    dispatch(getClientDashboardThunk());
  }, [dispatch]);

  // Parse macro strings from "consumed/target" format
  const parseMacro = (macroString) => {
    if (!macroString) return { value: 0, target: 0 };
    const [value, target] = macroString.split("/").map(parseFloat);
    return { value: value || 0, target: target || 0 };
  };

  // Prepare client and dashboard data from API response
  const client = dashboard
    ? {
        clientId: dashboard.clientId,
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
        <p className="text-danger text-center mt-5">{error}</p>
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
      await dispatch(
        uploadMealThunk({
          mealPlanId: selectedMeal.uploadId,
          mealName: selectedMeal.mealName,
          message: "Meal image uploaded",
          imageBase64: base64Data,
        })
      ).unwrap();

      alert("✅ Meal uploaded successfully!");
      closeCamera();
      dispatch(getClientDashboardThunk()); // Refresh dashboard
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

  return (
    <div className="container">
      <div className="d-flex flex-column">
        <div className="flex-grow-1 overflow-auto p-3 rounded shadow-sm">
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
                  <button
                    className="bg-white fs-6 btn-sm p-2 d-flex align-items-center border-0 rounded-3 shadow-sm"
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
                    <button
                      onClick={handleShare}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <FaShareAlt className="me-2" />
                      Share Progress
                    </button>
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
                        className="rounded-3 overflow-hidden mb-2"
                        style={{ height: "120px" }}
                      >
                        {meal.image ? (
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className="img-fluid w-100 h-100 object-fit-cover"
                            style={{ opacity: meal.completed ? 1 : 0.7 }}
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                            <FaCamera
                              className="text-muted"
                              style={{ fontSize: "2rem" }}
                            />
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

      {/* Camera Modal */}
      {showCamera && (
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
      {shareClientData && (
        <ShareProgressModal
          show={showShareModal}
          onHide={() => setShowShareModal(false)}
          clientData={shareClientData}
        />
      )}
    </div>
  );
}
