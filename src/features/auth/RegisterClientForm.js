import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import Heading from "../../components/navigation/Heading";
import { RegisterClient } from "../../api/authAPI";
import Loader from "../../components/display/Loader";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  FloatingLabel,
  ProgressBar,
  Badge,
  Alert,
} from "react-bootstrap";
import { Eye, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Target, Heart, Calendar, Activity, User, Mail, Phone, Lock, Users } from "lucide-react";

const RegisterClientForm = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    targetWeight: "",
    goal: "",
    gender: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalConditions: "",
    fitnessLevel: "",
  });

  const [validationStatus, setValidationStatus] = useState({
    fullName: null,
    email: null,
    password: null,
    phoneNumber: null,
    emergencyPhone: null,
  });

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate BMI
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      return parseFloat(bmi);
    }
    return null;
  };

  // Get BMI category with detailed info
  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { 
      text: "Underweight", 
      color: "info",
      description: "May need to gain weight for optimal health",
      icon: <TrendingUp size={24} />
    };
    if (bmi < 25) return { 
      text: "Healthy Weight", 
      color: "success",
      description: "Keep up the great work!",
      icon: <CheckCircle size={24} />
    };
    if (bmi < 30) return { 
      text: "Overweight", 
      color: "warning",
      description: "Consider a balanced diet and exercise plan",
      icon: <Activity size={24} />
    };
    return { 
      text: "Obese", 
      color: "danger",
      description: "Medical supervision recommended",
      icon: <Heart size={24} />
    };
  };

  // Calculate ideal weight range (using BMI 18.5-25)
  const getIdealWeightRange = () => {
    if (!formData.height) return null;
    const heightInMeters = formData.height / 100;
    const minWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxWeight = (25 * heightInMeters * heightInMeters).toFixed(1);
    return { min: minWeight, max: maxWeight };
  };

  // Calculate weekly weight change recommendation
  const getWeeklyRecommendation = () => {
    if (!formData.weight || !formData.targetWeight) return null;
    const diff = Math.abs(formData.weight - formData.targetWeight);
    const isLoss = formData.weight > formData.targetWeight;
    const weeklyChange = isLoss ? 0.5 : 0.25; // kg per week
    const weeks = Math.ceil(diff / weeklyChange);
    const months = Math.ceil(weeks / 4);
    
    return {
      diff: diff.toFixed(1),
      weekly: weeklyChange,
      weeks,
      months,
      isLoss,
      isRealistic: diff <= (isLoss ? 20 : 15)
    };
  };

  // Get goal-specific recommendations
  const getGoalRecommendations = () => {
    if (!formData.goal) return null;
    
    const recommendations = {
      0: { // Muscle Gain
        title: "Muscle Building Journey",
        tips: [
          "Progressive overload with compound exercises",
          "High protein diet (1.6-2.2g per kg body weight)",
          "4-5 strength training sessions per week",
          "7-9 hours of quality sleep for recovery"
        ],
        color: "primary",
        icon: <TrendingUp size={20} />
      },
      1: { // Fat Loss
        title: "Fat Loss Journey",
        tips: [
          "Sustainable calorie deficit (300-500 cal/day)",
          "Mix of cardio and resistance training",
          "Track progress with measurements, not just weight",
          "Stay consistent and patient with the process"
        ],
        color: "warning",
        icon: <TrendingDown size={20} />
      }
    };
    
    return recommendations[formData.goal];
  };

  // Calculate daily calorie needs (Harris-Benedict + Activity Level)
  const calculateCalories = () => {
    if (!formData.weight || !formData.height || !formData.gender || !formData.dateOfBirth) return null;
    
    const age = calculateAge(formData.dateOfBirth);
    if (!age) return null;
    
    let bmr;
    if (formData.gender === 'male') {
      bmr = 88.362 + (13.397 * formData.weight) + (4.799 * formData.height) - (5.677 * age);
    } else if (formData.gender === 'female') {
      bmr = 447.593 + (9.247 * formData.weight) + (3.098 * formData.height) - (4.330 * age);
    } else {
      bmr = 667.5 + (11.322 * formData.weight) + (3.949 * formData.height) - (5.004 * age);
    }
    
    // Activity multipliers based on fitness level
    const activityMultipliers = {
      beginner: 1.4,      // Sedentary to light activity
      intermediate: 1.55, // Moderate activity
      advanced: 1.725     // Very active
    };
    
    const activityLevel = activityMultipliers[formData.fitnessLevel] || 1.55;
    const maintenance = Math.round(bmr * activityLevel);
    
    let targetCalories;
    if (formData.goal === "0") { // Muscle gain
      targetCalories = maintenance + 300;
    } else if (formData.goal === "1") { // Fat loss
      targetCalories = maintenance - 500;
    } else {
      targetCalories = maintenance;
    }
    
    return {
      bmr: Math.round(bmr),
      maintenance,
      target: targetCalories,
      protein: Math.round(formData.weight * 2.0), // Higher for training
      carbs: Math.round((targetCalories * 0.40) / 4),
      fats: Math.round((targetCalories * 0.30) / 9)
    };
  };

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate phone number (basic validation)
  const validatePhone = (phone) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  // Validate password strength
  const validatePassword = (password) => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return { hasLength, hasUpper, hasLower, hasNumber, hasSpecial };
  };

  const getPasswordStrength = () => {
    if (!formData.password) return null;
    const validation = validatePassword(formData.password);
    const score = Object.values(validation).filter(Boolean).length;
    if (score === 5) return { text: "Very Strong", color: "success", width: 100 };
    if (score === 4) return { text: "Strong", color: "success", width: 80 };
    if (score === 3) return { text: "Good", color: "info", width: 60 };
    if (score === 2) return { text: "Fair", color: "warning", width: 40 };
    return { text: "Weak", color: "danger", width: 20 };
  };

  // Calculate form completion
  const getFormCompletion = () => {
    const requiredFields = ['fullName', 'email', 'password', 'phoneNumber', 'gender', 'goal'];
    const importantFields = ['dateOfBirth', 'height', 'weight', 'targetWeight', 'fitnessLevel'];
    const optionalFields = ['emergencyContact', 'emergencyPhone', 'medicalConditions'];
    
    const requiredCompleted = requiredFields.filter(field => formData[field]).length;
    const importantCompleted = importantFields.filter(field => formData[field]).length;
    const optionalCompleted = optionalFields.filter(field => formData[field]).length;
    
    const requiredPercentage = (requiredCompleted / requiredFields.length) * 60;
    const importantPercentage = (importantCompleted / importantFields.length) * 30;
    const optionalPercentage = (optionalCompleted / optionalFields.length) * 10;
    
    return Math.round(requiredPercentage + importantPercentage + optionalPercentage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === 'email') {
      setValidationStatus(prev => ({ ...prev, email: validateEmail(value) }));
    }
    if (name === 'fullName') {
      setValidationStatus(prev => ({ ...prev, fullName: value.length >= 3 }));
    }
    if (name === 'phoneNumber') {
      setValidationStatus(prev => ({ ...prev, phoneNumber: validatePhone(value) }));
    }
    if (name === 'emergencyPhone' && value) {
      setValidationStatus(prev => ({ ...prev, emergencyPhone: validatePhone(value) }));
    }
    if (name === 'password') {
      const passwordValidation = validatePassword(value);
      setValidationStatus(prev => ({ 
        ...prev, 
        password: Object.values(passwordValidation).filter(Boolean).length >= 4 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Additional validation
    const age = calculateAge(formData.dateOfBirth);
    if (age && age < 16) {
      toast.current.show({
        severity: "warn",
        summary: "Age Restriction",
        detail: "Client must be at least 16 years old. Parental consent required for minors.",
        life: 5000,
      });
      return;
    }

    if (formData.weight && formData.targetWeight) {
      const diff = Math.abs(formData.weight - formData.targetWeight);
      if (diff > 30) {
        toast.current.show({
          severity: "warn",
          summary: "Unrealistic Goal",
          detail: "Weight goal difference is very high. Consider setting intermediate milestones.",
          life: 5000,
        });
      }
    }

    const clientData = { ...formData, role: 0 };
    setLoading(true);

    try {
      await RegisterClient(clientData);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Client registered successfully! Welcome to your fitness journey.",
        life: 3000,
      });
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Registration Failed",
        detail:
          error?.response?.data?.message ||
          "Unable to register client. Please check the details and try again.",
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formCompletion > 30) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to reset the form?")) {
        return;
      }
    }
    
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      dateOfBirth: "",
      height: "",
      weight: "",
      targetWeight: "",
      goal: "",
      gender: "",
      emergencyContact: "",
      emergencyPhone: "",
      medicalConditions: "",
      fitnessLevel: "",
    });
    setValidationStatus({
      fullName: null,
      email: null,
      password: null,
      phoneNumber: null,
      emergencyPhone: null,
    });
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  const idealWeight = getIdealWeightRange();
  const weeklyPlan = getWeeklyRecommendation();
  const goalRecs = getGoalRecommendations();
  const calories = calculateCalories();
  const passwordStrength = getPasswordStrength();
  const formCompletion = getFormCompletion();
  const age = calculateAge(formData.dateOfBirth);

  return (
    <div className="page-container auth-page-enter">      
      <Toast ref={toast} position="top-right" />
      <div className="container">
        {loading && <Loader fullScreen text="Creating client profile..." color="var(--color-primary)" />}
        <Heading pageName="Register New Client" sticky={true} />
           <div className="d-flex flex-column" style={{ height: "calc(100vh - 160px)", overflow: "hidden" }}>
        <div className="flex-grow-1 overflow-auto" style={{ paddingBottom: "20px" }}>
        {/* Trainer Info Banner */}
        <div className="row justify-content-center mb-3">
          <div className="col-12">
            <Alert variant="primary" className="border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <Users size={24} className="me-3" />
                <div>
                  <strong>Trainer Portal</strong>
                  <p className="mb-0 small">You are registering a new client to your training program. All fields marked with (*) are mandatory.</p>
                </div>
              </div>
            </Alert>
          </div>
        </div>

        {/* Smart Progress Tracker */}
        <div className="row justify-content-center mb-4">
          <div className="col-12">
            <div className="card card-stats p-4 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="fw-bold mb-1">Registration Progress</h6>
                  <small className="text-muted">
                    {formCompletion < 60 ? "Complete required fields to continue" : 
                     formCompletion < 90 ? "Add health details for better client management" :
                     "Excellent! All set for registration"}
                  </small>
                </div>
                <div className="text-end">
                  <h4 className="mb-0 fw-bold text-primary">{formCompletion}%</h4>
                  <small className="text-muted">Complete</small>
                </div>
              </div>
              <ProgressBar style={{ height: "10px" }}>
                <ProgressBar 
                  variant="primary" 
                  now={Math.min(formCompletion, 60)} 
                  key={1}
                  animated
                />
                <ProgressBar 
                  variant="info" 
                  now={Math.min(Math.max(0, formCompletion - 60), 30)} 
                  key={2}
                  animated
                />
                <ProgressBar 
                  variant="success" 
                  now={Math.max(0, formCompletion - 90)} 
                  key={3}
                  animated
                />
              </ProgressBar>
              <div className="d-flex justify-content-between mt-2">
                <small className="text-muted">
                  <i className="fas fa-check-circle text-primary me-1"></i>
                  Required (60%)
                </small>
                <small className="text-muted">
                  <i className="fas fa-heart text-info me-1"></i>
                  Health (30%)
                </small>
                <small className="text-muted">
                  <i className="fas fa-star text-success me-1"></i>
                  Safety (10%)
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card content-wrapper card-health p-4">
              <Form onSubmit={handleSubmit} className="needs-validation">
                <Row className="gy-4">
                  {/* Personal Information Section */}
                  <Col xs={12}>
                    <div className="card card-stats p-4 mb-3 position-relative overflow-hidden">
                      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" 
                           style={{ background: "linear-gradient(135deg, var(--bs-primary) 0%, transparent 100%)" }}></div>
                      <div className="position-relative">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div>
                            <h5 className="fw-bold text-black mb-1">
                              <User className="me-2 text-black" size={20} />
                              Personal Information
                            </h5>
                            <small className="text-black">Client's basic details and contact information</small>
                          </div>
                          <Badge bg="primary" pill className="px-3 py-2">Required</Badge>
                        </div>
                        
                        <Row className="gy-3">
                          <Col md={6}>
                            <FloatingLabel label="Full Name *" className="smooth-transition">
                              <Form.Control
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className={`smooth-transition ${validationStatus.fullName === true ? 'border-success' : ''}`}
                              />
                              {validationStatus.fullName === true && (
                                <div className="position-absolute top-50 translate-middle-y text-success" 
                                  style={{ right: "15px", pointerEvents: "none" }}>
                                  <CheckCircle size={20} />
                                </div>
                              )}
                            </FloatingLabel>
                          </Col>

                          <Col md={6}>
                            <FloatingLabel label="Email Address *" className="smooth-transition">
                              <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`smooth-transition ${validationStatus.email === true ? 'border-success' : validationStatus.email === false ? 'border-danger' : ''}`}
                              />
                              {validationStatus.email === true && (
                                <div className="position-absolute top-50 translate-middle-y text-success" 
                                  style={{ right: "15px", pointerEvents: "none" }}>
                                  <Mail size={20} />
                                </div>
                              )}
                              {validationStatus.email === false && formData.email && (
                                <div className="position-absolute top-50 translate-middle-y text-danger" 
                                  style={{ right: "15px", pointerEvents: "none" }}>
                                  <AlertCircle size={20} />
                                </div>
                              )}
                            </FloatingLabel>
                            {validationStatus.email === false && formData.email && (
                              <small className="text-danger">Please enter a valid email address</small>
                            )}
                          </Col>

                          <Col md={6}>
                            <FloatingLabel label="Phone Number *" className="smooth-transition">
                              <Form.Control
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                className={`smooth-transition ${validationStatus.phoneNumber === true ? 'border-success' : ''}`}
                              />
                              {validationStatus.phoneNumber === true && (
                                <div className="position-absolute top-50 translate-middle-y text-success" 
                                  style={{ right: "15px", pointerEvents: "none" }}>
                                  <Phone size={20} />
                                </div>
                              )}
                            </FloatingLabel>
                            <small className="text-muted">Format: 10-15 digits</small>
                          </Col>

                          <Col md={6}>
                            <FloatingLabel label="Gender *" className="smooth-transition">
                              <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className="smooth-transition"
                              >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </Form.Select>
                            </FloatingLabel>
                          </Col>

                          <Col md={6}>
                            <FloatingLabel label="Date of Birth *" className="smooth-transition">
                              <Form.Control
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                max={new Date().toISOString().split('T')[0]}
                                className="smooth-transition"
                              />
                            </FloatingLabel>
                            {age && (
                              <small className={`d-flex align-items-center mt-1 ${age < 18 ? 'text-warning' : 'text-muted'}`}>
                                <Calendar size={14} className="me-1" />
                                Age: {age} years {age < 18 && "⚠️ Minor - Parental consent required"}
                              </small>
                            )}
                          </Col>

                          <Col md={6}>
                            <FloatingLabel label="Password *" className="position-relative smooth-transition">
                              <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form-control w-100 pe-5"
                                style={{ paddingRight: "40px" }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="position-absolute top-50 translate-middle-y border-0 bg-transparent"
                                style={{ right: "10px", zIndex: 10 }}
                              >
                                <Eye size={20} />
                              </button>
                            </FloatingLabel>
                            {formData.password && passwordStrength && (
                              <div className="mt-2">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <small className="text-muted">Password Strength</small>
                                  <small className={`text-${passwordStrength.color} fw-semibold`}>
                                    {passwordStrength.text}
                                  </small>
                                </div>
                                <ProgressBar 
                                  now={passwordStrength.width} 
                                  variant={passwordStrength.color}
                                  style={{ height: "5px" }}
                                />
                              </div>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>

                  {/* Health Information Section */}
                  <Col xs={12}>
                    <div className="card card-info p-4 mb-3 position-relative overflow-hidden">
                      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" 
                           style={{ background: "linear-gradient(135deg, var(--bs-info) 0%, transparent 100%)" }}></div>
                      <div className="position-relative">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div>
                            <h5 className="fw-bold text-black mb-1">
                              <Heart className="me-2 text-black" size={20} />
                              Health & Fitness Profile
                            </h5>
                            <small className="text-black">Essential for creating personalized training plans</small>
                          </div>
                          <Badge bg="info" pill className="px-3 py-2">Important</Badge>
                        </div>

                        <Row className="gy-3">
                          <Col md={6}>
                            <FloatingLabel label="Fitness Goal *" className="smooth-transition">
                              <Form.Select
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                required
                                className="smooth-transition"
                              >
                                <option value="">Select primary fitness goal</option>
                                <option value="0">🏋️ Muscle Gain & Strength Building</option>
                                <option value="1">🔥 Fat Loss & Body Toning</option>
                              </Form.Select>
                            </FloatingLabel>
                          </Col>

                          <Col md={6}>
                            <FloatingLabel label="Current Fitness Level *" className="smooth-transition">
                              <Form.Select
                                name="fitnessLevel"
                                value={formData.fitnessLevel}
                                onChange={handleChange}
                                required
                                className="smooth-transition"
                              >
                                <option value="">Select fitness level</option>
                                <option value="beginner">Beginner (0-6 months training)</option>
                                <option value="intermediate">Intermediate (6 months - 2 years)</option>
                                <option value="advanced">Advanced (2+ years)</option>
                              </Form.Select>
                            </FloatingLabel>
                          </Col>

                          <Col md={4}>
                            <FloatingLabel label="Height (cm) *" className="smooth-transition">
                              <Form.Control
                                type="number"
                                name="height"
                                placeholder="Height"
                                value={formData.height}
                                onChange={handleChange}
                                required
                                min="100"
                                max="250"
                                className="smooth-transition"
                              />
                            </FloatingLabel>
                          </Col>

                          <Col md={4}>
                            <FloatingLabel label="Current Weight (kg) *" className="smooth-transition">
                              <Form.Control
                                type="number"
                                name="weight"
                                placeholder="Current Weight"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                                min="30"
                                max="300"
                                step="0.1"
                                className="smooth-transition"
                              />
                            </FloatingLabel>
                          </Col>

                          <Col md={4}>
                            <FloatingLabel label="Target Weight (kg) *" className="smooth-transition">
                              <Form.Control
                                type="number"
                                name="targetWeight"
                                placeholder="Target Weight"
                                value={formData.targetWeight}
                                onChange={handleChange}
                                required
                                min="30"
                                max="300"
                                step="0.1"
                                className="smooth-transition"
                              />
                            </FloatingLabel>
                            {idealWeight && (
                              <small className="text-muted d-block mt-1">
                                💡 Healthy range: {idealWeight.min}-{idealWeight.max} kg
                              </small>
                            )}
                          </Col>

                          <Col md={12}>
                            <FloatingLabel label="Medical Conditions or Injuries" className="smooth-transition">
                              <Form.Control
                                as="textarea"
                                name="medicalConditions"
                                placeholder="Medical Conditions"
                                value={formData.medicalConditions}
                                onChange={handleChange}
                                rows={2}
                                className="smooth-transition"
                                style={{ minHeight: "80px" }}
                              />
                            </FloatingLabel>
                            <small className="text-muted">List any health conditions, injuries, or physical limitations</small>
                          </Col>
                        </Row>

                        {/* Goal-Based Recommendations */}
                        {goalRecs && (
                          <Alert variant={goalRecs.color} className="mt-4 border-0 shadow-sm">
                            <div className="d-flex align-items-start">
                              <div className="me-3 mt-1">
                                {goalRecs.icon}
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="fw-bold mb-2">{goalRecs.title} - Training Plan</h6>
                                <ul className="mb-0 ps-3">
                                  {goalRecs.tips.map((tip, idx) => (
                                    <li key={idx} className="mb-1">
                                      <small>{tip}</small>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </Alert>
                        )}

                        {/* Comprehensive Health Dashboard */}
                        {(bmi || weeklyPlan || calories) && (
                          <Row className="mt-4">
                            <Col xs={12}>
                              <div className="card bg-gradient border-0 p-4 shadow-sm" 
                                   style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                                <h6 className="fw-bold mb-3 text-white">
                                  <Activity className="me-2" size={20} />
                                  Personalized Training Metrics
                                </h6>
                                
                                <Row className="gy-3">
                                  {/* BMI Card */}
                                  {bmi && bmiCategory && (
                                    <Col md={6} lg={3}>
                                      <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body">
                                          <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                              <small className="text-muted d-block">BMI</small>
                                              <h3 className="fw-bold mb-0">{bmi}</h3>
                                            </div>
                                            <div className={`text-${bmiCategory.color}`}>
                                              {bmiCategory.icon}
                                            </div>
                                          </div>
                                          <Badge bg={bmiCategory.color} className="mb-2">
                                            {bmiCategory.text}
                                          </Badge>
                                          <p className="small text-muted mb-0">
                                            {bmiCategory.description}
                                          </p>
                                        </div>
                                      </div>
                                    </Col>
                                  )}

                                  {/* Weight Goal Timeline */}
                                  {weeklyPlan && (
                                    <Col md={6} lg={3}>
                                      <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body">
                                          <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                              <small className="text-muted d-block">Timeline</small>
                                              <h3 className="fw-bold mb-0">{weeklyPlan.months}</h3>
                                              <small className="text-muted">months</small>
                                            </div>
                                            <Target className="text-primary" size={24} />
                                          </div>
                                          <div className="mb-2">
                                            <strong className="text-primary">{weeklyPlan.diff}kg</strong>
                                            <small className="text-muted"> to {weeklyPlan.isLoss ? 'lose' : 'gain'}</small>
                                          </div>
                                          <p className="small text-muted mb-0">
                                            {weeklyPlan.weekly}kg per week
                                            {!weeklyPlan.isRealistic && (
                                              <span className="d-block text-warning mt-1">
                                                ⚠️ Ambitious goal
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </Col>
                                  )}

                                  {/* Calorie & Macros */}
                                  {calories && (
                                    <Col md={12} lg={6}>
                                      <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body">
                                          <small className="text-muted d-block mb-2">Daily Nutrition Plan</small>
                                          <Row className="mb-3">
                                            <Col xs={6}>
                                              <div className="text-center">
                                                <small className="text-muted d-block">Target</small>
                                                <h4 className="text-primary fw-bold mb-0">{calories.target}</h4>
                                                <small className="text-muted">calories</small>
                                              </div>
                                            </Col>
                                            <Col xs={6}>
                                              <div className="text-center">
                                                <small className="text-muted d-block">Maintenance</small>
                                                <h4 className="text-secondary fw-bold mb-0">{calories.maintenance}</h4>
                                                <small className="text-muted">calories</small>
                                              </div>
                                            </Col>
                                          </Row>
                                          <div className="border-top pt-2">
                                            <small className="text-muted d-block mb-2 fw-semibold">Macro Split</small>
                                            <Row>
                                              <Col xs={4} className="text-center">
                                                <div className="text-primary fw-bold">{calories.protein}g</div>
                                                <small className="text-muted">Protein</small>
                                              </Col>
                                              <Col xs={4} className="text-center">
                                                <div className="text-info fw-bold">{calories.carbs}g</div>
                                                <small className="text-muted">Carbs</small>
                                              </Col>
                                              <Col xs={4} className="text-center">
                                                <div className="text-warning fw-bold">{calories.fats}g</div>
                                                <small className="text-muted">Fats</small>
                                              </Col>
                                            </Row>
                                          </div>
                                        </div>
                                      </div>
                                    </Col>
                                  )}
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        )}
                      </div>
                    </div>
                  </Col>

                  {/* Emergency Contact Section */}
                  <Col xs={12}>
                    <div className="card card-warning p-4 mb-3 position-relative overflow-hidden">
                      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" 
                           style={{ background: "linear-gradient(135deg, var(--bs-warning) 0%, transparent 100%)" }}></div>
                      <div className="position-relative">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div>
                            <h5 className="fw-bold text-black mb-1">
                              <i className="fas text-black fa-phone-alt me-2"></i>
                              Emergency Contact
                            </h5>
                            <small className="text-black">Safety information for emergencies during training</small>
                          </div>
                          <Badge bg="warning" pill className="px-3 py-2">Optional but Recommended</Badge>
                        </div>
                        
                        <Row className="gy-3">
                          <Col md={6}>
                            <FloatingLabel label="Emergency Contact Name" className="smooth-transition">
                              <Form.Control
                                type="text"
                                name="emergencyContact"
                                placeholder="Emergency Contact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                className="smooth-transition"
                              />
                            </FloatingLabel>
                          </Col>

                          <Col md={6}>
                            <FloatingLabel label="Emergency Contact Phone" className="smooth-transition">
                              <Form.Control
                                type="tel"
                                name="emergencyPhone"
                                placeholder="Emergency Phone"
                                value={formData.emergencyPhone}
                                onChange={handleChange}
                                className={`smooth-transition ${validationStatus.emergencyPhone === true ? 'border-success' : validationStatus.emergencyPhone === false ? 'border-danger' : ''}`}
                              />
                              {validationStatus.emergencyPhone === true && (
                                <div className="position-absolute top-50 translate-middle-y text-success" 
                                  style={{ right: "15px", pointerEvents: "none" }}>
                                  <CheckCircle size={20} />
                                </div>
                              )}
                            </FloatingLabel>
                          </Col>
                        </Row>

                        {formData.emergencyContact && formData.emergencyPhone && (
                          <Alert variant="success" className="mt-3 mb-0 border-0">
                            <small>
                              <i className="fas fa-shield-alt me-2"></i>
                              Emergency contact added successfully. This will be used only in case of medical emergencies.
                            </small>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Action Buttons */}
                <div className="text-center mt-4">
                  <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      className="fw-bold smooth-transition shadow"
                      disabled={loading || formCompletion < 60}
                      size="md"
                      style={{ minWidth: "200px" }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Profile...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Register Client
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className=" smooth-transition"
                      type="button"
                      onClick={handleCancel}
                      size="md"
                    >
                      <i className="fas fa-undo me-2"></i>
                      Reset Form
                    </Button>
                  </div>
                  
                  {/* {formCompletion < 60 && (
                    <Alert variant="warning" className="mt-3 d-inline-block border-0 shadow-sm">
                      <AlertCircle size={18} className="me-2" />
                      <small>Complete all required fields (*) to register the client</small>
                    </Alert>
                  )} */}

                  {formCompletion >= 60 && formCompletion < 90 && (
                    <Alert variant="info" className="mt-3 d-inline-block border-0 shadow-sm">
                      <i className="fas fa-info-circle me-2"></i>
                      <small>Add health and emergency details for comprehensive client management</small>
                    </Alert>
                  )}
                </div>
              </Form>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        {showTips && formCompletion < 100 && (
          <div className="row justify-content-center mt-4">
            <div className="col-12">
              <Alert 
                variant="info" 
                dismissible 
                onClose={() => setShowTips(false)}
                className="border-0 shadow-sm"
              >
                <div className="d-flex align-items-start">
                  <div className="me-3">
                    <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center"
                         style={{ width: "40px", height: "40px", minWidth: "40px" }}>
                      <i className="fas fa-lightbulb"></i>
                    </div>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-2">💡 Trainer Tips for Client Registration</h6>
                    <ul className="mb-0 ps-3">
                      <li className="mb-1"><small><strong>Complete Profile:</strong> Full health data enables better workout and nutrition planning</small></li>
                      <li className="mb-1"><small><strong>Medical History:</strong> Document any conditions to ensure safe training protocols</small></li>
                      <li className="mb-1"><small><strong>Emergency Contact:</strong> Essential for client safety during high-intensity sessions</small></li>
                      <li className="mb-1"><small><strong>Realistic Goals:</strong> Set achievable milestones to keep clients motivated</small></li>
                      <li className="mb-0"><small><strong>Privacy:</strong> All client information is confidential and HIPAA compliant</small></li>
                    </ul>
                  </div>
                </div>
              </Alert>
            </div>
          </div>
        )}
        </div>
</div>
      </div>
    </div>
  );
};

export default RegisterClientForm;