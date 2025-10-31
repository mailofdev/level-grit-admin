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
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Modal } from "react-bootstrap";
import { FaWhatsapp, FaInstagram, FaDownload } from "react-icons/fa";
import html2canvas from 'html2canvas';

export default function ClientDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);

  const client = { ...location.state?.client };

  // Date picker state
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [actionType, setActionType] = useState(null); // 'add' or 'preview'

  const [showShareModal, setShowShareModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const shareCardRef = useRef(null);

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

  // Calculate totals dynamically
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

  // Handle plan actions
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
  maxDate.setDate(maxDate.getDate() + 365); // Allow planning up to 1 year ahead

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

  const generateProgressImage = async () => {
    if (!shareCardRef.current) return null;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      setIsGenerating(false);
      return blob;
    } catch (error) {
      console.error('Error generating image:', error);
      setIsGenerating(false);
      return null;
    }
  };

  const handleSharePlatform = async (platform) => {
    const imageBlob = await generateProgressImage();
    if (!imageBlob) return;

    const file = new File([imageBlob], 'fitness-progress.png', { type: 'image/png' });
    const shareText = `💪 I'm on a ${dashboardData.user.streak}-day fitness streak!\n🔥 ${completedMeals}/${dashboardData.meals.length} meals completed today!\n✨ Keep pushing! #FitnessJourney #HealthyLiving`;

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: 'My Fitness Progress',
          text: shareText,
          files: [file]
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else if (platform === 'whatsapp') {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fitness-progress.png';
      link.click();
      URL.revokeObjectURL(url);
      
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    } else if (platform === 'instagram') {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fitness-progress.png';
      link.click();
      URL.revokeObjectURL(url);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Image Downloaded!',
        detail: 'Open Instagram app and upload from your gallery.',
        life: 5000
      });
    } else if (platform === 'download') {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fitness-progress.png';
      link.click();
      URL.revokeObjectURL(url);
    }
    
    setShowShareModal(false);
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
        {/* Client Info Card */}
        <div className="flex-grow-1 overflow-auto pb-3">
          <div className="px-2 px-md-3">
            {/* Mobile-Optimized Client Card */}
        <div className="card border-0 rounded-4 shadow-sm overflow-hidden mb-3 mt-2">
  {/* Card Header - Gradient background */}
  <div className="bg-gradient p-3 d-flex justify-content-between align-items-center" 
       style={{ background: "linear-gradient(135deg, #4e73df, #1cc88a)" }}>
    <div className="d-flex align-items-center gap-3">
      {/* Client initials avatar */}
      {/* <div className="bg-white text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center"
           style={{ width: "45px", height: "45px", fontSize: "1.1rem" }}>
        {client.fullName.charAt(0).toUpperCase()}
      </div> */}
      <div>
        <h5 className="text-white mb-0 fw-semibold">{client.fullName}</h5>
      </div>
    </div>

    {/* Status Badge */}
    <span
      className={`badge px-3 py-2 fs-6 rounded-pill ${
        client.status === "attention" ? "bg-danger" : "bg-success"
      }`}
    >
      {client.status === "attention" ? "⚠️ Need Attention" : "✅ On Track"}
    </span>
  </div>

  {/* Card Body */}
  <div className="card-body p-3 p-md-4">
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
      {/* Info Section */}
      <div className="flex-grow-1">
        <p className="mb-2 text-muted small">
          <strong>Goal:</strong> {getGoalText(client.goal)}
        </p>
        <p className="mb-2 text-muted small">
          <strong>Start:</strong> {client.startDate}
        </p>
      </div>

      {/* Streak Section */}
      <div className="text-md-end">
        <div className="d-flex align-items-center gap-2">
          <span
            className={`fw-bold fs-6 ${
              client.streak === "Missed meal" ? "text-danger" : "text-success"
            }`}
          >
            {client.streak}
          </span>
          {client.streak === "Missed meal" ? (
            <FaSadCry className="text-danger fs-5" />
          ) : (
            <FaFire className="text-success fs-5" />
          )}
        </div>
      </div>
    </div>

    <hr className="my-3" />

    {/* Action Buttons */}
    <div className="d-flex flex-column flex-sm-row gap-2">
      <button
        className="btn btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-sm"
        onClick={() =>
          navigate(`/messages/${client.clientId}`, {
            state: { client },
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


            {/* Macros and Streak Section - Stack on Mobile */}
            <div className="row g-2 g-md-3 mb-3">
              {/* Macros Card */}
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

              {/* Streak Progress Card */}
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
                              "linear-gradient(90deg, #28a745, #20c997)",
                          }}
                        ></div>
                      </div>
                      <button
                        onClick={() => setShowShareModal(true)}
                        className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center justify-content-center gap-2 mx-auto"
                        style={{ minHeight: "40px", minWidth: "150px" }}
                      >
                        <FaShareAlt />
                        <span>Share Progress</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Plan Section */}
            <div className="card rounded-4 shadow-sm mb-3">
              <div className="card-body p-3">
                {/* Header */}
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

                {/* Meals Grid - Responsive */}
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

                        {/* Meal Image */}
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

                        {/* Meal Info */}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Picker Dialog - Mobile Optimized */}
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
        style={{ width: "95vw", maxWidth: "450px" }}
        onHide={() => setShowDateDialog(false)}
        footer={
          <div className="d-flex gap-2">
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
        }
      >
        <div className="p-2">
          <div className="mb-3">
            <strong>Client:</strong> {client?.fullName || "N/A"}
          </div>

          <div className="mb-3">
            <label className="fw-semibold mb-2 d-block">📅 Select Date</label>
            <Calendar
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.value)}
              dateFormat="dd M yy"
              showIcon
              minDate={actionType === "add" ? today : null}
              maxDate={maxDate}
              inline
              className="w-100"
              touchUI
            />
          </div>

          {actionType === "add" &&
            selectedDate &&
            selectedDate.toDateString() !== today.toDateString() && (
              <div className="alert alert-info p-2 small mb-0">
                <i className="pi pi-info-circle me-2"></i>
                You can only edit today's plan. Future dates will be read-only.
              </div>
            )}

          {actionType === "preview" && (
            <div className="alert alert-secondary p-2 small mb-0">
              <i className="pi pi-eye me-2"></i>
              Opening in preview mode (read-only)
            </div>
          )}
        </div>
      </Dialog>

      {/* Share Modal - Mobile Optimized */}
      <Modal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        centered
        fullscreen="md-down"
        size="lg"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fs-5">📊 Share Your Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2 p-md-4">
          {/* Progress Card Preview - Responsive */}
          <div className="mb-3 mb-md-4 d-flex justify-content-center">
            <div 
              ref={shareCardRef}
              className="w-100"
              style={{
                maxWidth: '400px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                borderRadius: '20px',
                padding: '24px',
                color: 'white',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}
            >
              {/* Header */}
              <div className="text-center mb-3">
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>💪</div>
                <h3 className="fw-bold mb-1" style={{ fontSize: '24px' }}>
                  {client.fullName}
                </h3>
                <p style={{ fontSize: '13px', opacity: 0.9 }}>
                  {new Date().toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>

              {/* Streak Banner */}
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '20px'
                }}
              >
                <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                  <span style={{ fontSize: '36px' }}>🔥</span>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                      {dashboardData.user.streak} Days
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Fitness Streak</div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{
                      background: 'white',
                      height: '100%',
                      width: `${(dashboardData.streakProgress.current / dashboardData.streakProgress.goal) * 100}%`,
                      borderRadius: '8px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <div className="text-center mt-2" style={{ fontSize: '13px', opacity: 0.9 }}>
                  Goal: {dashboardData.streakProgress.goal} days
                </div>
              </div>

              {/* Macros Grid */}
              <div className="row g-2 mb-3">
                {Object.entries(dashboardData.macros).map(([key, value]) => {
                  const percentage = Math.round((value.value / value.target) * 100);
                  return (
                    <div key={key} className="col-6">
                      <div 
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '16px',
                          padding: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <div className="mb-2">
                          <div 
                            className="position-relative d-inline-block"
                            style={{ width: '50px', height: '50px' }}
                          >
                            <svg width="50" height="50" style={{ transform: 'rotate(-90deg)' }}>
                              <circle
                                cx="25"
                                cy="25"
                                r="20"
                                fill="none"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="4"
                              />
                              <circle
                                cx="25"
                                cy="25"
                                r="20"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                                strokeDasharray={`${(percentage / 100) * (2 * Math.PI * 20)} ${2 * Math.PI * 20}`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div 
                              className="position-absolute top-50 start-50 translate-middle"
                              style={{ fontSize: '11px', fontWeight: 'bold' }}
                            >
                              {percentage}%
                            </div>
                          </div>
                        </div>
                        <div className="text-capitalize fw-semibold" style={{ fontSize: '13px' }}>
                          {key}
                        </div>
                        <div style={{ fontSize: '11px', opacity: 0.8 }}>
                          {value.value}/{value.target}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Meals Completed */}
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {completedMeals}/{dashboardData.meals.length}
                </div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>
                  Meals Completed Today
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-3" style={{ fontSize: '11px', opacity: 0.7 }}>
                #FitnessJourney #HealthyLiving
              </div>
            </div>
          </div>

          {/* Share Options - Mobile Optimized */}
          <div className="d-flex flex-column gap-2">
            {/* Native Share */}
            {navigator.share && (
              <button
                onClick={() => handleSharePlatform("native")}
                disabled={isGenerating}
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 rounded-3"
                style={{ minHeight: "48px" }}
              >
                <FaShareAlt className="fs-5" />
                <span>{isGenerating ? "Generating..." : "Share via..."}</span>
              </button>
            )}

            {/* WhatsApp */}
            <button
              onClick={() => handleSharePlatform("whatsapp")}
              disabled={isGenerating}
              className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2 rounded-3"
              style={{ minHeight: "48px" }}
            >
              <FaWhatsapp className="fs-5" />
              <span>Share on WhatsApp</span>
            </button>

            {/* Instagram */}
            <button
              onClick={() => handleSharePlatform("instagram")}
              disabled={isGenerating}
              className="btn w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 text-white border-0"
              style={{
                minHeight: "48px",
                background: 'linear-gradient(135deg, #667eea 10%, #764ba2 70%, #f093fb 100%)',
              }}
            >
              <FaInstagram className="fs-5" />
              <span>Download for Instagram</span>
            </button>

            {/* Download */}
            <button
              onClick={() => handleSharePlatform("download")}
              disabled={isGenerating}
              className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2 rounded-3"
              style={{ minHeight: "48px" }}
            >
              <FaDownload className="fs-5" />
              <span>Download Image</span>
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}