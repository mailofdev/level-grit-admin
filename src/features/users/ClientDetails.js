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

  const [showShareModal, setShowShareModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('gradient');
  const shareCardRef = useRef(null);

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
      return { value: 0, target: 0 };
    }
    const parts = macroString.split('/');
    return {
      value: parseFloat(parts[0]) || 0,
      target: parseFloat(parts[1]) || 0,
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
          calories: { value: 0, target: 0 },
          protein: { value: 0, target: 0 },
          carbs: { value: 0, target: 0 },
          fat: { value: 0, target: 0 },
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
      // Error generating image
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
      // Download image first
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fitness-progress.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Detect mobile vs desktop
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setTimeout(() => {
        if (isMobile) {
          // Try to open WhatsApp app directly with deep link
          const whatsappDeepLink = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
          window.location.href = whatsappDeepLink;
          
          // Fallback to WhatsApp Web if app doesn't open (after 2 seconds)
          setTimeout(() => {
            const whatsappWebUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
            window.open(whatsappWebUrl, '_blank');
          }, 2000);
        } else {
          // Desktop: Open WhatsApp Web
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
      // Download image
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fitness-progress-story.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Detect if mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      setTimeout(() => {
        if (isAndroid) {
          // Try Instagram intent for Android
          const instagramIntent = 'instagram://story-camera';
          window.location.href = instagramIntent;
          
          // Fallback to Instagram app homepage
          setTimeout(() => {
            window.location.href = 'instagram://';
          }, 1500);
          
          // Final fallback to Play Store
          setTimeout(() => {
            window.open('https://play.google.com/store/apps/details?id=com.instagram.android', '_blank');
          }, 3000);
        } else if (isIOS) {
          // Try Instagram deep link for iOS
          window.location.href = 'instagram://story-camera';
          
          // Fallback to Instagram app
          setTimeout(() => {
            window.location.href = 'instagram://';
          }, 1500);
          
          // Final fallback to App Store
          setTimeout(() => {
            window.open('https://apps.apple.com/app/instagram/id389801252', '_blank');
          }, 3000);
        } else {
          // Desktop: Open Instagram web
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
                          {client.fullName}
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
}