import React, { useState, useRef } from "react";
import { ProgressBar } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Heading from "../../components/navigation/Heading";
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
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [showCamera, setShowCamera] = useState(false);
  const [selectedMealIndex, setSelectedMealIndex] = useState(null);
  const [stream, setStream] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const client = { ...location.state?.client };

  if (!client)
    return (
      <p className="text-muted mt-4 text-center">
        Select a client to view details.
      </p>
    );

  const meals = [
    {
      name: "Meal 1 (Pre-Workout)",
      image:
        "https://media.self.com/photos/5fd796783fd930328ef43628/4:3/w_2240,c_limit/banana-peanut-butter.jpg",
      calories: 450,
      protein: 15,
      carbs: 60,
      fat: 18,
      completed: true,
    },
    {
      name: "Meal 2 (Breakfast)",
      image:
        "https://www.shutterstock.com/image-photo/milk-breakfast-two-glasses-oatmeal-260nw-1905708703.jpg",
      calories: 520,
      protein: 35,
      carbs: 25,
      fat: 28,
      completed: true,
    },
    {
      name: "Meal 3 (Lunch)",
      image:
        "https://www.subbuskitchen.com/wp-content/uploads/2014/07/NorthIndian-Lunch-Menu1_Final2.jpg",
      calories: 280,
      protein: 8,
      carbs: 18,
      fat: 22,
      completed: true,
    },
    {
      name: "Meal 4 (Evening Snack)",
      image:
        "https://i0.wp.com/www.shanazrafiq.com/wp-content/uploads/2022/02/Fruit-Yogurt-Salad-8.jpg?resize=1200%2C798&ssl=1",
      calories: 625,
      protein: 42,
      carbs: 45,
      fat: 28,
      completed: true,
    },
    {
      name: "Meal 5 (Dinner)",
      image:
        "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/paneer-fried-rice-recipe.jpg",
      calories: 625,
      protein: 42,
      carbs: 45,
      fat: 28,
      completed: true,
    },
    {
      name: "Meal 6 (Before Bed)",
      calories: 625,
      protein: 42,
      carbs: 45,
      fat: 28,
      completed: false,
    },
  ];

  const totals = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fat += meal.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const dashboardData = {
    user: { name: "Alex", streak: 12 },
    macros: {
      calories: { value: totals.calories, target: 2500 },
      protein: { value: totals.protein, target: 200 },
      carbs: { value: totals.carbs, target: 300 },
      fat: { value: totals.fat, target: 80 },
    },
    streakProgress: { current: 12, goal: 20 },
    meals,
    reminders: [
      {
        text: "Dinner reminder",
        time: "6:00 PM - Don't forget your protein!",
        type: "warning",
      },
      {
        text: "Time for your next glass of water",
        time: "4:00 PM - Time for your next glass of water",
        type: "info",
      },
    ],
    water: {
      current: 6,
      goal: 8,
    },
  };

  const completedMeals = dashboardData.meals.filter((m) => m.completed).length;
  const remainingMeals = dashboardData.meals.length - completedMeals;

  // Handle meal click - open camera for incomplete meals
  const handleMealClick = (mealIndex) => {
    if (!meals[mealIndex].completed) {
      setSelectedMealIndex(mealIndex);
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
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Capture photo and convert to base64
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

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
    
    // Remove the data:image/jpeg;base64, prefix for API
    const base64Data = base64Image.split(",")[1];

    // Send to API
    sendToAPI(base64Data);
  };

  // Send image to API
  const sendToAPI = async (base64Image) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch("https://localhost:7240/api/Integration/extract", {
        method: "POST",
        headers: {
          "accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Meal analysis for ${meals[selectedMealIndex].name}`,
          image: base64Image,
        }),
      });

      if (response.ok) {
        const result = await response.text();
        console.log("API Response:", result);
        alert("Meal image uploaded successfully!");
        closeCamera();
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.error("Error sending to API:", error);
      alert("Failed to upload meal image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Close camera modal
  const closeCamera = () => {
    stopCamera();
    setShowCamera(false);
    setSelectedMealIndex(null);
  };

  const CircularProgress = ({
    value,
    max,
    label,
    current,
    target,
    color = "success",
  }) => {
    const percentage = Math.round((current / target) * 100);
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
          {current} / {target}
        </small>
      </div>
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Fitness Streak",
          text: `I'm on a ${dashboardData.user.streak}-day fitness streak! 💪🔥`,
        });
      } catch (error) {
        console.error("Share failed", error);
      }
    } else {
      alert("Share not supported");
    }
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
                    {client.streak}
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
                      navigate(`/messages/${client.clientId}`, {
                        state: { client },
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
                      onClick={() => handleMealClick(idx)}
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
                        {meal.image && (
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className="img-fluid w-100 h-100 object-fit-cover"
                          />
                        )}
                      </div>

                      <p className="mb-1 small text-muted">
                        {meal.calories} calories
                      </p>
                      <div className="small text-muted">
                        P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                      </div>
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
          <div className="bg-white rounded-4 p-4" style={{ maxWidth: "600px", width: "90%" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                Capture {selectedMealIndex !== null && meals[selectedMealIndex].name}
              </h5>
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
    </div>
  );
}