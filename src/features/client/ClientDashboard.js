import React, { useState, useRef } from "react";
import { ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Heading from "../../components/navigation/Heading";
import {
  FaFire,
  FaCheckCircle,
  FaCamera,
  FaSadCry,
  FaShareAlt,
} from "react-icons/fa";
import { Toast } from "primereact/toast";
import { Modal } from "react-bootstrap";
import { FaWhatsapp, FaInstagram, FaDownload } from "react-icons/fa";
import html2canvas from 'html2canvas';
import { getDecryptedUser } from "../../components/common/CommonFunctions";

const ClientDashboard = () => {
  const user = getDecryptedUser();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('gradient');
  const shareCardRef = useRef(null);

  // Mock data - same structure as ClientDetails
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
    user: { name: user?.fullName || "User", streak: 12 },
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

  const themes = {
    gradient: {
      name: 'Aurora',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      icon: '🌈'
    },
    sunset: {
      name: 'Sunset',
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      icon: '🌅'
    },
    ocean: {
      name: 'Ocean',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
      icon: '🌊'
    },
    forest: {
      name: 'Forest',
      background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
      icon: '🌲'
    },
    fire: {
      name: 'Fire',
      background: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
      icon: '🔥'
    }
  };

  const generateProgressImage = async () => {
    if (!shareCardRef.current) return null;
    
    setIsGenerating(true);
    
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 3,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
      });
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
      setIsGenerating(false);
      return blob;
    } catch (error) {
      setIsGenerating(false);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to generate image. Please try again.',
        life: 3000
      });
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
        if (error.name !== 'AbortError') {
          // Share failed
        }
      }
    } else if (platform === 'whatsapp') {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fitness-progress.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setTimeout(() => {
        if (isMobile) {
          const whatsappDeepLink = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
          window.location.href = whatsappDeepLink;
          
          setTimeout(() => {
            const whatsappWebUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
            window.open(whatsappWebUrl, '_blank');
          }, 2000);
        } else {
          const whatsappWebUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
          window.open(whatsappWebUrl, '_blank');
        }
        
        toast.current?.show({
          severity: 'success',
          summary: '📸 Image Downloaded!',
          detail: 'Upload the image to your WhatsApp Status from your gallery.',
          life: 5000
        });
      }, 500);
    } else if (platform === 'instagram') {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fitness-progress-story.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      setTimeout(() => {
        if (isAndroid) {
          window.location.href = 'instagram://story-camera';
          setTimeout(() => {
            window.location.href = 'instagram://';
          }, 1500);
        } else if (isIOS) {
          window.location.href = 'instagram://story-camera';
          setTimeout(() => {
            window.location.href = 'instagram://';
          }, 1500);
        } else {
          window.open('https://www.instagram.com/', '_blank');
        }
        
        toast.current?.show({
          severity: 'success',
          summary: '📸 Image Downloaded!',
          detail: isMobile 
            ? 'Opening Instagram... Create a Story and select the image from your gallery.' 
            : 'Open Instagram app on your phone, create a Story, and select the downloaded image.',
          life: 6000
        });
      }, 500);
    } else if (platform === 'download') {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fitness-progress.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.current?.show({
        severity: 'success',
        summary: '✅ Downloaded!',
        detail: 'Image saved to your downloads folder.',
        life: 3000
      });
    }
    
    setShowShareModal(false);
  };

  return (
    <div className="container-fluid px-2 px-md-3">
      <Toast ref={toast} />
      <Heading pageName="Dashboard" sticky={true} />
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
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Share Modal */}
      <Modal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        centered
        size="xl"
        className="share-progress-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="d-flex align-items-center gap-2">
            <div className="bg-gradient rounded-3 p-2" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <span style={{fontSize: '24px'}}>📊</span>
            </div>
            <div>
              <div className="fs-5 fw-bold">Share Your Progress</div>
              <small className="text-muted fw-normal">Choose a theme and share your achievement</small>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3 p-md-4">
          <div className="row g-3 g-md-4">
            {/* Preview Section */}
            <div className="col-12 col-lg-6">
              <div className="bg-light rounded-4 p-3 p-md-4" style={{border: '2px dashed #dee2e6'}}>
                {/* Theme Selector */}
                <div className="mb-3">
                  <label className="fw-semibold mb-2 d-block small">🎨 Choose Theme</label>
                  <div className="d-flex flex-wrap gap-2">
                    {Object.entries(themes).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTheme(key)}
                        className={`btn btn-sm ${selectedTheme === key ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{
                          borderRadius: '10px',
                          padding: '6px 12px',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        <span className="me-1">{theme.icon}</span>
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Card Preview */}
                <div className="d-flex justify-content-center">
                  <div 
                    ref={shareCardRef}
                    style={{
                      width: '100%',
                      maxWidth: '350px',
                      aspectRatio: '9/16',
                      background: themes[selectedTheme].background,
                      borderRadius: '20px',
                      padding: '28px 20px',
                      color: 'white',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    {/* Header */}
                    <div>
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ fontSize: '42px', marginBottom: '10px' }}>💪</div>
                        <h3 style={{ margin: 0, fontSize: '26px', fontWeight: '800', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                          {user?.fullName || 'User'}
                        </h3>
                        <p style={{ margin: '6px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
                          {new Date().toLocaleDateString('en-US', { 
                            month: 'long', 
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
                          borderRadius: '18px',
                          padding: '20px',
                          marginBottom: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '14px' }}>
                          <FaFire style={{fontSize: '40px'}} />
                          <div>
                            <div style={{ fontSize: '32px', fontWeight: '900', lineHeight: 1 }}>
                              {dashboardData.user.streak}
                            </div>
                            <div style={{ fontSize: '13px', opacity: 0.9, fontWeight: '600' }}>Day Streak</div>
                          </div>
                        </div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.3)',
                          borderRadius: '8px',
                          height: '7px',
                          overflow: 'hidden',
                          marginBottom: '8px',
                        }}>
                          <div 
                            style={{
                              background: 'white',
                              height: '100%',
                              width: `${(dashboardData.streakProgress.current / dashboardData.streakProgress.goal) * 100}%`,
                              borderRadius: '8px',
                              boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                            }}
                          />
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '12px', opacity: 0.9, fontWeight: '600' }}>
                          🎯 Goal: {dashboardData.streakProgress.goal} days
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                        {Object.entries(dashboardData.macros).slice(0, 2).map(([key, value]) => {
                          const percentage = Math.round((value.value / value.target) * 100);
                          return (
                            <div 
                              key={key}
                              style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '14px',
                                padding: '14px',
                                textAlign: 'center',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                              }}
                            >
                              <div className="mb-2">
                                <div 
                                  className="position-relative d-inline-block"
                                  style={{ width: '46px', height: '46px' }}
                                >
                                  <svg width="46" height="46" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle
                                      cx="23"
                                      cy="23"
                                      r="18"
                                      fill="none"
                                      stroke="rgba(255,255,255,0.3)"
                                      strokeWidth="4"
                                    />
                                    <circle
                                      cx="23"
                                      cy="23"
                                      r="18"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="4"
                                      strokeDasharray={`${(percentage / 100) * (2 * Math.PI * 18)} ${2 * Math.PI * 18}`}
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <div 
                                    className="position-absolute top-50 start-50 translate-middle"
                                    style={{ fontSize: '10px', fontWeight: 'bold' }}
                                  >
                                    {percentage}%
                                  </div>
                                </div>
                              </div>
                              <div className="text-capitalize fw-semibold" style={{ fontSize: '12px', marginBottom: '2px' }}>
                                {key}
                              </div>
                              <div style={{ fontSize: '10px', opacity: 0.8 }}>
                                {value.value}/{value.target}
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
                          borderRadius: '14px',
                          padding: '16px',
                          textAlign: 'center',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        <div style={{ fontSize: '14px', marginBottom: '6px' }}>🍽️</div>
                        <div style={{ fontSize: '26px', fontWeight: '900', marginBottom: '2px' }}>
                          {completedMeals}/{dashboardData.meals.length}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: '600' }}>
                          Meals Completed Today
                        </div>
                      </div>

                      {/* Footer */}
                      <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', opacity: 0.7, fontWeight: '600' }}>
                        #FitnessJourney #HealthyLiving
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Options Section */}
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column gap-3 h-100">
                <div className="bg-light rounded-3 p-3 mb-2">
                  <h6 className="fw-bold mb-1 d-flex align-items-center gap-2">
                    <span>📱</span>
                    Share Options
                  </h6>
                  <p className="mb-0 small text-muted">
                    Choose how you want to share your progress
                  </p>
                </div>

                {/* Native Share */}
                {navigator.share && (
                  <button
                    onClick={() => handleSharePlatform("native")}
                    disabled={isGenerating}
                    className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-3 rounded-3 border-0 text-white"
                    style={{
                      minHeight: "56px",
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => !isGenerating && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <FaShareAlt className="fs-5" />
                    <span className="fw-semibold">{isGenerating ? "Generating..." : "Share via..."}</span>
                  </button>
                )}

                {/* WhatsApp */}
                <button
                  onClick={() => handleSharePlatform("whatsapp")}
                  disabled={isGenerating}
                  className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-3 rounded-3 border-0"
                  style={{
                    minHeight: "56px",
                    background: '#25D366',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => !isGenerating && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <FaWhatsapp className="fs-5" />
                  <span className="fw-semibold">Share on WhatsApp</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => handleSharePlatform("instagram")}
                  disabled={isGenerating}
                  className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-3 rounded-3 border-0"
                  style={{
                    minHeight: "56px",
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(240, 148, 51, 0.3)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => !isGenerating && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <FaInstagram className="fs-5" />
                  <span className="fw-semibold">Share on Instagram Story</span>
                </button>

                {/* Download */}
                <button
                  onClick={() => handleSharePlatform("download")}
                  disabled={isGenerating}
                  className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-3 rounded-3 border-0"
                  style={{
                    minHeight: "56px",
                    background: '#111827',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(17, 24, 39, 0.3)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => !isGenerating && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <FaDownload className="fs-5" />
                  <span className="fw-semibold">Download Image</span>
                </button>

                {/* Info Alert */}
                <div className="alert alert-info mb-0 d-flex align-items-start gap-2" style={{fontSize: '13px', lineHeight: '1.5'}}>
                  <span style={{fontSize: '18px'}}>💡</span>
                  <div>
                    <strong>Tip:</strong> For Instagram, the image will be downloaded. Open Instagram, create a Story, and select the image from your gallery to share!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .share-progress-modal .modal-content {
          border-radius: 24px !important;
          border: none !important;
        }
        
        .share-progress-modal .modal-header {
          border-bottom: 1px solid #e5e7eb !important;
        }
        
        .share-progress-modal .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        @media (max-width: 991px) {
          .share-progress-modal .modal-dialog {
            max-width: 95% !important;
            margin: 1rem auto !important;
          }
        }
        
        @media (max-width: 576px) {
          .share-progress-modal .modal-body {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;
