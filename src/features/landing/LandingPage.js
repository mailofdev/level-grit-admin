import {
  FaMobile,
  FaUsers,
  FaChartLine,
  FaCheckCircle,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaUserPlus,
  FaDownload,
  FaCamera,
  FaRobot,
  FaTrophy,
  FaFire,
  FaClock,
  FaChartBar,
  FaShareAlt,
  FaArrowRight,
  FaTimes,
  FaCheck,
  FaComments,
  FaDumbbell,
  FaUser,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Animated3DCard from "../../components/landing/Animated3DCard";
import logo3 from "../../assets/images/logo3.jpeg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [activeTab, setActiveTab] = useState("trainer");
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallButton(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Handle scroll for tab styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowInstallButton(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleSignInNavigation = () => navigate("/login");
  const handleSignUpNavigation = () => navigate("/register");
  const handleClientLogin = () => navigate("/login");
  const handleTrainerLogin = () => navigate("/login");
  const handleTrainerSignUp = () => navigate("/register");

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#ffffff" }}>
      {/* Header/Navigation Bar - Role-Based Design */}
      <nav
        className="navbar navbar-expand-lg navbar-light shadow-sm py-3 fixed-top"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div className="container">
          {/* Logo */}
          <Link
            className="navbar-brand fw-bold d-flex align-items-center"
            to="/"
            style={{ fontSize: "1.5rem", color: "#000000", textDecoration: "none" }}
          >
            <img
              src={logo3}
              alt="LevelGrit"
              style={{
                height: "40px",
                marginRight: "10px",
                borderRadius: "8px",
              }}
            />
            <span className="d-none d-sm-inline">LevelGrit</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Content */}
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* General Links */}
            <ul className="navbar-nav me-auto align-items-center mb-3 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  style={{
                    color: "#333",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "500",
                    padding: "0.5rem 1rem",
                  }}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/about-us"
                  style={{
                    color: "#333",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "500",
                    padding: "0.5rem 1rem",
                  }}
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/contact"
                  style={{
                    color: "#333",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "500",
                    padding: "0.5rem 1rem",
                  }}
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Role-Based Action Buttons */}
            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-3 ms-lg-auto">
              {/* Client Section - Clear Visual Grouping */}
              <div 
                className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 p-2 rounded-3"
                style={{
                  backgroundColor: "rgba(67, 233, 123, 0.05)",
                  border: "1px solid rgba(67, 233, 123, 0.2)",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2 mb-lg-0">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#43e97b",
                      color: "#fff",
                    }}
                  >
                    <FaUser size={14} />
                  </div>
                  <div className="d-flex flex-column">
                    <small className="fw-bold" style={{ fontSize: "0.7rem", color: "#43e97b", lineHeight: "1" }}>
                      FOR CLIENTS
                    </small>
                    <small className="text-muted d-none d-xl-inline" style={{ fontSize: "0.65rem" }}>
                      Join the challenge
                    </small>
                  </div>
                </div>
                <motion.button
                  className="btn rounded-pill px-4 fw-semibold"
                  onClick={handleClientLogin}
                  style={{
                    backgroundColor: "#43e97b",
                    color: "#fff",
                    border: "none",
                    minHeight: "44px",
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 8px rgba(67, 233, 123, 0.3)",
                    fontSize: "0.9rem",
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(67, 233, 123, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  title="Login as a Client to track your meals and join the 32-day challenge"
                >
                  <FaUser className="d-lg-none me-2" size={14} />
                  Client Login
                </motion.button>
              </div>

              {/* Visual Divider */}
              <div 
                className="d-none d-lg-flex align-items-center"
                style={{
                  width: "1px",
                  height: "50px",
                  backgroundColor: "rgba(0,0,0,0.1)",
                }}
              />

              {/* Trainer Section - Clear Visual Grouping */}
              <div 
                className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 p-2 rounded-3"
                style={{
                  backgroundColor: "rgba(102, 126, 234, 0.05)",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2 mb-lg-0">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#667eea",
                      color: "#fff",
                    }}
                  >
                    <FaDumbbell size={14} />
                  </div>
                  <div className="d-flex flex-column">
                    <small className="fw-bold" style={{ fontSize: "0.7rem", color: "#667eea", lineHeight: "1" }}>
                      FOR TRAINERS
                    </small>
                    <small className="text-muted d-none d-xl-inline" style={{ fontSize: "0.65rem" }}>
                      Start coaching smarter
                    </small>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <motion.button
                    className="btn rounded-pill px-3 px-md-4 fw-semibold"
                    onClick={handleTrainerLogin}
                    style={{
                      backgroundColor: "transparent",
                      color: "#667eea",
                      border: "2px solid #667eea",
                      minHeight: "44px",
                      whiteSpace: "nowrap",
                      fontSize: "0.9rem",
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: "#667eea",
                      color: "#fff",
                    }}
                    whileTap={{ scale: 0.98 }}
                    title="Login as a Trainer to manage your clients"
                  >
                    <FaDumbbell className="d-lg-none me-2" size={14} />
                    Login
                  </motion.button>
                  <motion.button
                    className="btn rounded-pill px-3 px-md-4 fw-semibold"
                    onClick={handleTrainerSignUp}
                    style={{
                      backgroundColor: "#667eea",
                      color: "#fff",
                      border: "none",
                      minHeight: "44px",
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                      fontSize: "0.9rem",
                    }}
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    title="Sign up as a Trainer to start coaching clients"
                  >
                    <FaDumbbell className="d-lg-none me-2" size={14} />
                    Sign Up
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Switcher - Sticky below navbar */}
      <motion.div
        className="position-sticky"
        style={{
          top: "76px", // Navbar height + padding
          zIndex: 998,
          paddingTop: "1.5rem",
          paddingBottom: "1rem",
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: isScrolled ? "1px solid rgba(0,0,0,0.08)" : "none",
          boxShadow: isScrolled ? "0 2px 10px rgba(0,0,0,0.05)" : "none",
          transition: "all 0.3s ease",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="container">
          <div className="d-flex justify-content-center">
            <div
              className="d-flex rounded-pill p-2 shadow-lg"
              style={{
                backgroundColor: "#f8f9fa",
                border: "2px solid #e9ecef",
                maxWidth: "600px",
                width: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <motion.button
                onClick={() => handleTabChange("trainer")}
                className="btn flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-2 fw-semibold position-relative"
                style={{
                  backgroundColor: activeTab === "trainer" ? "#667eea" : "transparent",
                  color: activeTab === "trainer" ? "#fff" : "#6c757d",
                  border: "none",
                  padding: "14px 28px",
                  minHeight: "52px",
                  fontSize: "0.95rem",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                whileHover={{ 
                  scale: activeTab === "trainer" ? 1 : 1.02,
                  backgroundColor: activeTab === "trainer" ? "#667eea" : "rgba(102, 126, 234, 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FaDumbbell size={18} />
                <span className="d-none d-md-inline">For Trainers</span>
                <span className="d-md-none">Trainers</span>
                {activeTab === "trainer" && (
                  <motion.div
                    layoutId="activeTab"
                    className="position-absolute"
                    style={{
                      inset: 0,
                      borderRadius: "9999px",
                      backgroundColor: "#667eea",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
              <motion.button
                onClick={() => handleTabChange("client")}
                className="btn flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-2 fw-semibold position-relative"
                style={{
                  backgroundColor: activeTab === "client" ? "#43e97b" : "transparent",
                  color: activeTab === "client" ? "#fff" : "#6c757d",
                  border: "none",
                  padding: "14px 28px",
                  minHeight: "52px",
                  fontSize: "0.95rem",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                whileHover={{ 
                  scale: activeTab === "client" ? 1 : 1.02,
                  backgroundColor: activeTab === "client" ? "#43e97b" : "rgba(67, 233, 123, 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FaUser size={18} />
                <span className="d-none d-md-inline">For Clients</span>
                <span className="d-md-none">Clients</span>
                {activeTab === "client" && (
                  <motion.div
                    layoutId="activeTab"
                    className="position-absolute"
                    style={{
                      inset: 0,
                      borderRadius: "9999px",
                      backgroundColor: "#43e97b",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div ref={contentRef}>
        {/* ============================================
            TRAINER SECTION
            ============================================ */}
        <AnimatePresence mode="wait">
          {activeTab === "trainer" && (
            <motion.div
              key="trainer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
      <section
        className="py-5"
        style={{
          paddingTop: "2rem",
          paddingBottom: "6rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <motion.div {...fadeInUp}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-3 mt-5"
                >
                  <span
                    className="badge rounded-pill px-3 py-2"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      fontSize: "0.9rem",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <FaRobot className="me-2" />
                    AI-Powered Coaching Platform
                  </span>
                </motion.div>
                <h1
                  className="display-3 fw-bold mb-4"
                  style={{ color: "#fff", lineHeight: "1.2", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
                >
                  Track Smarter. Coach Effortlessly. Deliver Real Results.
                </h1>
                <p
                  className="lead mb-4"
                  style={{ color: "rgba(255,255,255,0.95)", fontSize: "1.2rem", lineHeight: "1.6" }}
                >
                  Still tracking clients over WhatsApp or calls?
                  <br />
                  Time to make this fun, automated, and honestly… less painful.
                  <br />
                  <strong style={{ color: "#fff" }}>
                    With our AI-powered app, your clients just snap a photo of their meal — and you get real-time progress on your dashboard.
                  </strong>
                </p>
                <motion.button
                  className="btn btn-lg rounded-pill px-3 px-md-5 py-3 fw-semibold mb-3 d-inline-flex align-items-center gap-2 w-100 w-md-auto"
                  onClick={handleSignUpNavigation}
                  style={{
                    backgroundColor: "#fff",
                    color: "#667eea",
                    minHeight: "56px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    border: "none",
                    fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="d-flex align-items-center gap-2 flex-wrap justify-content-center">
                    <span>👉 Start Coaching Smarter — Free</span>
                    <FaArrowRight className="flex-shrink-0" />
                  </span>
                </motion.button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="d-flex align-items-center gap-3 mt-3"
              >
                <div className="d-flex align-items-center gap-2">
                  <FaCheckCircle style={{ color: "#4ade80", fontSize: "1.2rem" }} />
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>
                    AI does the tracking
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaCheckCircle style={{ color: "#4ade80", fontSize: "1.2rem" }} />
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>
                    You deliver the transformation
                  </span>
                </div>
              </motion.div>
            </div>
            <div className="col-lg-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="position-relative">
                  <motion.div
                    className="position-relative"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "2rem",
                      padding: "2rem",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=500&fit=crop&q=80"
                      alt="Meal Tracking"
                      className="img-fluid rounded-4 shadow-lg"
                      style={{
                        maxHeight: "450px",
                        objectFit: "cover",
                        width: "100%",
                        border: "4px solid rgba(255,255,255,0.3)",
                      }}
                    />
                    <motion.div
                      className="position-absolute bg-white rounded-pill px-4 py-2 shadow-lg d-flex align-items-center gap-2"
                      style={{
                        top: "20px",
                        right: "20px",
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaRobot style={{ color: "#667eea", fontSize: "1.2rem" }} />
                      <span className="fw-bold" style={{ color: "#333", fontSize: "0.9rem" }}>
                        AI Powered
                      </span>
                    </motion.div>
                    <motion.div
                      className="position-absolute bg-white rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center"
                      style={{
                        bottom: "30px",
                        left: "30px",
                        width: "60px",
                        height: "60px",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <FaCamera style={{ color: "#667eea", fontSize: "1.5rem" }} />
                    </motion.div>
                    <motion.div
                      className="position-absolute bg-white rounded-3 p-3 shadow-lg"
                      style={{
                        bottom: "30px",
                        right: "30px",
                        minWidth: "140px",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <small className="text-muted d-block mb-1">Macros Detected</small>
                      <div className="d-flex align-items-center gap-2">
                        <FaChartBar style={{ color: "#4ade80", fontSize: "1.2rem" }} />
                        <strong style={{ color: "#667eea", fontSize: "1.1rem" }}>
                          Real-time
                        </strong>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section - Trainer */}
      <section className="py-5" style={{ backgroundColor: "#fff", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="d-inline-block mb-4"
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#fee2e2",
                  margin: "0 auto",
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>💡</span>
              </div>
            </motion.div>
            <h2
              className="fw-bold mb-4"
              style={{ fontSize: "2.8rem", color: "#1f2937", lineHeight: "1.2" }}
            >
              The Problem
            </h2>
            <p
              className="lead mb-5"
              style={{ color: "#6b7280", fontSize: "1.3rem", maxWidth: "700px", margin: "0 auto", fontWeight: "500" }}
            >
              You already know how it goes:
            </p>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <div className="row g-4">
                {[
                  {
                    icon: <FaTimes size={24} />,
                    text: "Manual client tracking is boring, repetitive, and eats your time like a bulking athlete.",
                    color: "#ef4444",
                  },
                  {
                    icon: <FaClock size={24} />,
                    text: "Updates get delayed, motivation drops, and both sides lose momentum.",
                    color: "#f59e0b",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="col-md-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div
                      className="card border-0 shadow-sm h-100 p-4 rounded-4"
                      style={{
                        backgroundColor: "#f9fafb",
                        borderLeft: `4px solid ${item.color}`,
                      }}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </div>
                      <p style={{ color: "#374151", fontSize: "1.05rem", margin: 0, lineHeight: "1.6" }}>
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Solution Section - Trainer */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="d-inline-block mb-4"
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  margin: "0 auto",
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>🚀</span>
              </div>
            </motion.div>
            <h2
              className="fw-bold mb-4"
              style={{ fontSize: "2.8rem", color: "#fff", lineHeight: "1.2", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
            >
              The Solution
            </h2>
            <p
              className="lead mb-5"
              style={{ color: "rgba(255,255,255,0.95)", fontSize: "1.3rem", maxWidth: "700px", margin: "0 auto", fontWeight: "500" }}
            >
              Now picture this:
            </p>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <div className="row g-4 mb-5">
                {[
                  {
                    step: "1",
                    icon: <FaMobile size={28} />,
                    text: "Clients → open app → click a photo → done.",
                  },
                  {
                    step: "2",
                    icon: <FaChartBar size={28} />,
                    text: "They instantly see their calories & macros.",
                  },
                  {
                    step: "3",
                    icon: <FaCheckCircle size={28} />,
                    text: "You instantly get their meal + macros on your dashboard.",
                  },
                  {
                    step: "4",
                    icon: <FaUsers size={28} />,
                    text: "Everyone stays in sync. No nudging, no chasing, no emotional damage.",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="col-md-6"
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div
                      className="card border-0 shadow-lg h-100 p-4 rounded-4"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#667eea",
                            color: "#fff",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                          }}
                        >
                          {item.step}
                        </div>
                        <div className="flex-grow-1">
                          <div
                            className="mb-2"
                            style={{ color: "#667eea" }}
                          >
                            {item.icon}
                          </div>
                          <p style={{ color: "#374151", fontSize: "1.05rem", margin: 0, lineHeight: "1.6" }}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center mt-5"
              >
                <div
                  className="d-inline-block p-4 rounded-4"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <p
                    className="fw-bold mb-0"
                    style={{ color: "#fff", fontSize: "1.4rem", lineHeight: "1.6" }}
                  >
                    That's AI-powered smart coaching — simple, fun, effective.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Fun Factor Section - Trainer */}
      <section className="py-5" style={{ backgroundColor: "#fff", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="d-inline-block mb-4"
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                  margin: "0 auto",
                }}
              >
                <FaFire style={{ color: "#fff", fontSize: "2rem" }} />
              </div>
            </motion.div>
            <h2
              className="fw-bold mb-4"
              style={{ fontSize: "2.8rem", color: "#1f2937", lineHeight: "1.2" }}
            >
              The Fun Factor (Engages Clients Too)
            </h2>
            <p className="text-muted mb-5" style={{ fontSize: "1.1rem" }}>
              Your clients won't feel "tracked." They'll be obsessed with completing our 32-day Transformation Challenge —
              earning badges, streaks, and sharable milestone banners.
              <br />
              Miss a day? Streak breaks. Pain. But in a motivating way. 😄
              <br />
              Clients stay consistent because they want to show off those wins online.
              <br />
              You become the cool AI coach everyone wants to train with.
            </p>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <div className="row g-4 mb-5">
                <motion.div
                  className="col-md-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="card border-0 shadow-lg h-100 p-4 rounded-4"
                    style={{
                      background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                      borderLeft: "4px solid #f59e0b",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#f59e0b",
                          color: "#fff",
                        }}
                      >
                        <FaFire size={24} />
                      </div>
                      <h5 className="fw-bold mb-0" style={{ color: "#92400e" }}>
                        32-Day Challenge
                      </h5>
                    </div>
                    <p style={{ color: "#78350f", fontSize: "1.05rem", margin: 0, lineHeight: "1.6" }}>
                      Your clients won't even feel like they're being tracked. They'll be hooked on our 32-day transformation challenge — earning streaks, badges, and milestone banners.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="col-md-6"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="card border-0 shadow-lg h-100 p-4 rounded-4"
                    style={{
                      background: "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)",
                      borderLeft: "4px solid #8b5cf6",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#8b5cf6",
                          color: "#fff",
                        }}
                      >
                        <FaTrophy size={24} />
                      </div>
                      <h5 className="fw-bold mb-0" style={{ color: "#5b21b6" }}>
                        Streaks & Badges
                      </h5>
                    </div>
                    <p style={{ color: "#4c1d95", fontSize: "1.05rem", margin: 0, lineHeight: "1.6" }}>
                      Just like Snapchat's streaks or Instagram stories. If they fail to click snaps, the streak breaks and they restart — keeping them motivated!
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Coaches Love It Section */}
      <section className="py-5">
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-3"
            style={{ fontSize: "2.5rem", color: "#333" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            💪 Why Coaches Love It
          </motion.h2>
          <motion.div
            className="row g-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Automated Tracking",
                desc: "No spreadsheets, no WhatsApp chaos.",
                icon: FaRobot,
                img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop&q=80",
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              },
              {
                title: "Meal Photo Tracking",
                desc: "AI extracts macros instantly.",
                icon: FaCamera,
                img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80",
                gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              },
              {
                title: "Challenge Mode",
                desc: "Badges, streaks, milestones.",
                icon: FaTrophy,
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&q=80",
                gradient: "linear-gradient(135deg, #fad961 0%, #f76b1c 100%)",
              },
              {
                title: "Save Time",
                desc: "More coaching, less admin work.",
                icon: FaClock,
                img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80",
                gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              },
              {
                title: "Boost Your Brand",
                desc: "Share progress and attract more clients.",
                icon: FaChartBar,
                img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&q=80",
                gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              },
            ].map((feature, idx) => (
              <div key={idx} className="col-lg-4 col-md-6 mb-4">
                <Animated3DCard delay={idx * 0.1}>
                  <motion.div
                    className="card border-0 shadow-lg h-100"
                    style={{
                      borderRadius: "1.5rem",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                  >
                    <div
                      style={{
                        height: "180px",
                        background: feature.gradient,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={feature.img}
                        alt={feature.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.3,
                        }}
                      />
                      <div
                        className="position-absolute top-50 start-50 translate-middle"
                        style={{
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            border: "2px solid rgba(255,255,255,0.3)",
                          }}
                        >
                          <feature.icon
                            size={40}
                            style={{ color: "#fff" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-3" style={{ color: "#1f2937", fontSize: "1.3rem" }}>
                        {feature.title}
                      </h4>
                      <p className="text-muted mb-0" style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                </Animated3DCard>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - Trainer */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            style={{ fontSize: "2.8rem", color: "#1f2937" }}
          >
            ⚙️ How It Works
          </motion.h2>
          <motion.p
            className="text-center text-muted mb-5"
            style={{ fontSize: "1.1rem" }}
          >
            Get started in three simple steps
          </motion.p>
          <motion.div
            className="row justify-content-center g-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
          >
            {[
              {
                number: "1",
                title: "Invite your clients.",
                desc: "Onboard in seconds — no tech skills or setup required.",
                icon: FaUserPlus,
                color: "#667eea",
              },
              {
                number: "2",
                title: "Clients upload meal photos.",
                desc: "AI reads, analyzes, and updates their macros instantly.",
                icon: FaCamera,
                color: "#f5576c",
              },
              {
                number: "3",
                title: "AI updates macros + your dashboard.",
                desc: "You monitor progress — effortlessly.",
                icon: FaChartLine,
                color: "#4facfe",
              },
              {
                number: "4",
                title: "You monitor progress — effortlessly.",
                desc: "See everything on one dashboard — stay in control, effortlessly.",
                icon: FaChartBar,
                color: "#43e97b",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="col-lg-3 col-md-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div
                  className="card border-0 shadow-lg text-center h-100 p-5 rounded-4 position-relative"
                  style={{
                    backgroundColor: "#fff",
                    overflow: "visible",
                  }}
                >
                  <div className="mt-4 mb-4">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: `${step.color}15`,
                        color: step.color,
                      }}
                    >
                      <step.icon size={40} />
                    </div>
                  </div>
                  <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1.3rem" }}>
                    {step.title}
                  </h5>
                  <p className="text-muted mb-0" style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
          </motion.div>
        )}
        {activeTab === "client" && (
          <motion.div
            key="client"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
      {/* ============================================
          CLIENT SECTION
          ============================================ */}
      <section
        className="py-5"
        style={{
          paddingTop: "2rem",
          paddingBottom: "6rem",
          background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=500&fit=crop&q=80"
                  alt="Client App"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{
                    maxHeight: "450px",
                    objectFit: "cover",
                    width: "100%",
                    border: "4px solid rgba(255,255,255,0.3)",
                  }}
                />
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div {...fadeInUp}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-3"
                >
                  <span
                    className="badge rounded-pill px-3 py-2"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      fontSize: "0.9rem",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <FaMobile className="me-2" />
                    Fitness Made Simple
                  </span>
                </motion.div>
                <h1
                  className="display-3 fw-bold mb-4"
                  style={{ color: "#fff", lineHeight: "1.2", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
                >
                  Stay Fit. Stay Consistent. Have Fun Doing It.
                </h1>
                <p
                  className="lead mb-4"
                  style={{ color: "rgba(255,255,255,0.95)", fontSize: "1.2rem", lineHeight: "1.6" }}
                >
                  Tracking your meals has never been easier.
                  <br />
                  <strong style={{ color: "#fff" }}>
                    Just snap a photo → get instant calories & macros → keep your streak alive for 32 days.
                  </strong>
                </p>
                <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 mb-3">
                  <motion.button
                    className="btn btn-lg rounded-pill px-3 px-md-5 py-3 fw-semibold d-inline-flex align-items-center gap-2 flex-grow-1 flex-sm-grow-0"
                    onClick={handleClientLogin}
                    style={{
                      backgroundColor: "#fff",
                      color: "#43e97b",
                      minHeight: "56px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                      border: "none",
                      fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                    whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="d-flex align-items-center gap-2 flex-wrap justify-content-center">
                      <span>👉 Join the 32-Day Challenge Now</span>
                      <FaArrowRight className="flex-shrink-0" />
                    </span>
                  </motion.button>
                  <motion.button
                    className="btn btn-lg rounded-pill px-4 px-md-5 py-3 fw-semibold d-inline-flex align-items-center justify-content-center"
                    onClick={handleClientLogin}
                    style={{
                      backgroundColor: "transparent",
                      color: "#fff",
                      minHeight: "56px",
                      border: "2px solid #fff",
                      fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                      whiteSpace: "nowrap",
                    }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login
                  </motion.button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="d-flex align-items-center gap-3 mt-3"
              >
                <div className="d-flex align-items-center gap-2">
                  <FaCheckCircle style={{ color: "#fff", fontSize: "1.2rem" }} />
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>
                    Fitness meets fun
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaCheckCircle style={{ color: "#fff", fontSize: "1.2rem" }} />
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>
                    Consistency made effortless
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* The Reality Section - Client */}
      <section className="py-5" style={{ backgroundColor: "#fff", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2
              className="fw-bold mb-4"
              style={{ fontSize: "2.8rem", color: "#1f2937", lineHeight: "1.2" }}
            >
              💬 The Reality
            </h2>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <div className="row g-4">
                {[
                  {
                    text: "Diet plans? Easy to start.",
                    color: "#43e97b",
                  },
                  {
                    text: "Following them? A different horror story.",
                    color: "#f5576c",
                  },
                  {
                    text: "Manual calorie tracking? Nope.",
                    color: "#f59e0b",
                  },
                  {
                    text: "Staying consistent? Hardest boss level.",
                    color: "#8b5cf6",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="col-md-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div
                      className="card border-0 shadow-sm h-100 p-4 rounded-4"
                      style={{
                        backgroundColor: "#f9fafb",
                        borderLeft: `4px solid ${item.color}`,
                      }}
                    >
                      <p style={{ color: "#374151", fontSize: "1.05rem", margin: 0, lineHeight: "1.6" }}>
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-5"
              >
                <p
                  className="lead fw-bold"
                  style={{ color: "#1f2937", fontSize: "1.5rem" }}
                >
                  We fix all of that.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why You'll Love It Section - Client */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-5"
            style={{ fontSize: "2.5rem", color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            💡 Why You'll Love It
          </motion.h2>
          <motion.div
            className="row g-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Snap & Track",
                desc: "Click a pic, get macros instantly.",
                icon: FaCamera,
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              },
              {
                title: "Stay Consistent",
                desc: "Daily streaks like Snapchat.",
                icon: FaFire,
                gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              },
              {
                title: "Brag Your Wins",
                desc: "Auto-generated milestone banners for Instagram.",
                icon: FaShareAlt,
                gradient: "linear-gradient(135deg, #fad961 0%, #f76b1c 100%)",
              },
              {
                title: "Chat with Your Coach",
                desc: "No boring calls or WhatsApp dumps.",
                icon: FaComments,
                gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              },
            ].map((feature, idx) => (
              <div key={idx} className="col-lg-3 col-md-6 mb-4">
                <Animated3DCard delay={idx * 0.1}>
                  <motion.div
                    className="card border-0 shadow-lg h-100"
                    style={{
                      borderRadius: "1.5rem",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                  >
                    <div
                      style={{
                        height: "180px",
                        background: feature.gradient,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="position-absolute top-50 start-50 translate-middle"
                        style={{
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            border: "2px solid rgba(255,255,255,0.3)",
                          }}
                        >
                          <feature.icon
                            size={40}
                            style={{ color: "#fff" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-3" style={{ color: "#1f2937", fontSize: "1.3rem" }}>
                        {feature.title}
                      </h4>
                      <p className="text-muted mb-0" style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                </Animated3DCard>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - Client */}
      <section className="py-5" style={{ backgroundColor: "#fff", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            style={{ fontSize: "2.8rem", color: "#1f2937" }}
          >
            🚀 How It Works
          </motion.h2>
          <motion.div
            className="row justify-content-center g-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
          >
            {[
              {
                number: "1",
                title: "Snap your meals.",
                desc: "Just take a photo of what you're eating.",
                icon: FaCamera,
                color: "#43e97b",
              },
              {
                number: "2",
                title: "Get automatic calorie & macro breakdown.",
                desc: "AI analyzes your meal instantly.",
                icon: FaChartBar,
                color: "#38f9d7",
              },
              {
                number: "3",
                title: "Keep your 32-day streak alive.",
                desc: "Build consistency with daily tracking.",
                icon: FaFire,
                color: "#f5576c",
              },
              {
                number: "4",
                title: "Share your transformation proudly.",
                desc: "Post milestone banners on social media.",
                icon: FaShareAlt,
                color: "#8b5cf6",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="col-lg-3 col-md-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div
                  className="card border-0 shadow-lg text-center h-100 p-5 rounded-4 position-relative"
                  style={{
                    backgroundColor: "#f9fafb",
                    overflow: "visible",
                  }}
                >
                  <div className="mt-4 mb-4">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: `${step.color}15`,
                        color: step.color,
                      }}
                    >
                      <step.icon size={40} />
                    </div>
                  </div>
                  <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1.3rem" }}>
                    {step.title}
                  </h5>
                  <p className="text-muted mb-0" style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Users Love It Section - Client */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-5"
            style={{ fontSize: "2.5rem", color: "#333" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            💬 Users Love It
          </motion.h2>
          <div className="row g-4 justify-content-center">
            {[
              {
                quote: "It's like Snapchat streaks but for fitness — I've never missed a meal log!",
                author: "Sneha, 28",
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              },
              {
                quote: "No typing, no tracking — just click and done.",
                author: "Rohit, 31",
                gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="col-md-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <div
                  className="card border-0 shadow-lg h-100 p-4 rounded-4"
                  style={{
                    background: testimonial.gradient,
                    color: "#fff",
                  }}
                >
                  <p className="fst-italic mb-3" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                    "{testimonial.quote}"
                  </p>
                  <p className="fw-bold mb-0" style={{ fontSize: "1rem" }}>
                    — {testimonial.author}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Client */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container text-center">
          <motion.h2
            className="fw-bold mb-4"
            style={{ fontSize: "3rem", color: "#fff", lineHeight: "1.2" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Make Fitness Fun Again.
          </motion.h2>
          <motion.p
            className="lead mb-5"
            style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.5rem" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Snap. Track. Share. Transform.
          </motion.p>
          <motion.button
            className="btn btn-lg rounded-pill px-3 px-md-5 py-3 fw-semibold d-inline-flex align-items-center gap-2 w-100 w-md-auto"
            onClick={handleClientLogin}
            style={{
              backgroundColor: "#43e97b",
              color: "#1f2937",
              minHeight: "56px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              border: "none",
              fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
              whiteSpace: "normal",
              wordBreak: "break-word",
              maxWidth: "400px",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="d-flex align-items-center gap-2 flex-wrap justify-content-center">
              <span>👉 Join the 32-Day Challenge</span>
              <FaArrowRight className="flex-shrink-0" />
            </span>
          </motion.button>
        </div>
      </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll to Top Button */}
      {isScrolled && (
        <motion.button
          className="position-fixed bottom-0 end-0 m-4 btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{
            zIndex: 1040,
            width: "56px",
            height: "56px",
            backgroundColor: "#667eea",
            border: "none",
            marginBottom: showInstallButton ? "80px" : "16px",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1, backgroundColor: "#5568d3" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <FaArrowRight 
            style={{ 
              transform: "rotate(-90deg)",
              fontSize: "1.2rem",
              color: "#fff"
            }} 
          />
        </motion.button>
      )}

      {/* PWA Install Button - Floating */}
      {showInstallButton && (
        <motion.button
          className="position-fixed bottom-0 end-0 m-4 btn btn-primary shadow-lg rounded-pill d-flex align-items-center gap-2 px-4 py-3"
          style={{
            zIndex: 1050,
            minHeight: "56px",
            backgroundColor: "#007AFF",
            border: "none",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={handleInstallClick}
          whileHover={{ opacity: 0.9 }}
        >
          <FaDownload size={20} />
          <span className="fw-semibold">Install PWA App</span>
        </motion.button>
      )}

      {/* Footer */}
      <footer className="bg-dark text-white pt-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3">
              <h5 className="fw-bold mb-3">LevelGrit</h5>
              <p className="text-muted mb-3">
                123 Fitness Street
                <br />
                Health City, HC 12345
              </p>
              <div className="d-flex gap-3 mb-3">
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ opacity: 0.8 }}
                >
                  <FaFacebook
                    size={24}
                    style={{ cursor: "pointer", color: "#fff" }}
                  />
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ opacity: 0.8 }}
                >
                  <FaInstagram
                    size={24}
                    style={{ cursor: "pointer", color: "#fff" }}
                  />
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ opacity: 0.8 }}
                >
                  <FaLinkedin
                    size={24}
                    style={{ cursor: "pointer", color: "#fff" }}
                  />
                </motion.a>
              </div>
              <p className="text-muted mb-2">
                <FaEnvelope className="me-2" />
                info@levelgrit.com
              </p>
              <p className="text-muted">
                <FaPhone className="me-2" />
                +1 (555) 123-4567
              </p>
            </div>
            <div className="col-lg-3">
              <h6 className="fw-bold mb-3">Company</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link
                    to="/about-us"
                    className="text-white-50 text-decoration-none"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h6 className="fw-bold mb-3">Resources</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link
                    to="/privacy-policy"
                    className="text-white-50 text-decoration-none"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/terms-conditions"
                    className="text-white-50 text-decoration-none"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/contact"
                    className="text-white-50 text-decoration-none"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h6 className="fw-bold mb-3">Legal</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link
                    to="/cancellation-policy"
                    className="text-white-50 text-decoration-none"
                  >
                    Cancellation Policy
                  </Link>
                </li>
              </ul>
            </div>
            <hr className="my-4" style={{ borderColor: "#444" }} />
            <div className="text-center text-white mb-4">
              <p className="mb-0 text-white bg-white px-2 py-1 rounded">
                &copy; {new Date().getFullYear()} LevelGrit. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
