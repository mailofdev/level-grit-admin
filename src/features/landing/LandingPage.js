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
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Animated3DCard from "../../components/landing/Animated3DCard";
import logo3 from "../../assets/images/logo3.jpeg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

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
      {/* Header/Navigation Bar */}
      <nav
        className="navbar navbar-expand-lg navbar-light shadow-sm py-3 fixed-top"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
        }}
      >
        <div className="container">
          <Link
            className="navbar-brand fw-bold"
            to="/"
            style={{ fontSize: "1.5rem", color: "#000000" }}
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
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  style={{
                    color: "#333",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
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
                  }}
                >
                  About Us
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
                  }}
                >
                  Contact Us
                </Link>
              </li>
              <li className="nav-item ms-2">
                <button
                  className="btn rounded-pill px-4 fw-semibold me-2"
                  onClick={handleSignInNavigation}
                  style={{
                    backgroundColor: "transparent",
    color: "#222222",
    border: "2px solid #222222",
                  }}
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn rounded-pill px-4 fw-semibold"
                  onClick={handleSignUpNavigation}
                  style={{
                backgroundColor: "#222222",
    color: "#fff",
                  }}
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Animation */}
      <section
        className="py-5"
        style={{
          marginTop: "80px",
          paddingTop: "6rem",
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
                  It's time to make it fun, automated, and impactful.
                  <br />
                  <strong style={{ color: "#fff" }}>
                    With our AI-powered app, your clients simply snap a photo of their meal, and you get their progress — in real-time.
                  </strong>
                </p>
                <motion.button
                  className="btn btn-lg rounded-pill px-5 py-3 fw-semibold mb-3 d-inline-flex align-items-center gap-2"
                  onClick={handleSignUpNavigation}
                  style={{
                    backgroundColor: "#fff",
                    color: "#667eea",
                    minHeight: "56px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    border: "none",
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  👉 Start Coaching Smarter — Free
                  <FaArrowRight />
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
                    You deliver transformation
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
                    {/* Floating AI Badge */}
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
                    {/* Floating Camera Icon */}
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
                    {/* Floating Stats Card */}
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

      {/* The Problem Section */}
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
              You already know it —
            </p>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <div className="row g-4">
                {[
                  {
                    icon: <FaTimes size={24} />,
                    text: "Tracking clients manually is boring, repetitive, and inefficient.",
                    color: "#ef4444",
                  },
                  {
                    icon: <FaClock size={24} />,
                    text: "You waste hours chasing updates instead of celebrating results.",
                    color: "#f59e0b",
                  },
                  {
                    icon: <FaChartLine size={24} />,
                    text: "Your clients lose consistency, and you lose momentum.",
                    color: "#8b5cf6",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="col-md-4"
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

      {/* The Solution Section */}
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
              Now imagine this:
            </p>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <div className="row g-4 mb-5">
                {[
                  {
                    step: "1",
                    icon: <FaMobile size={28} />,
                    text: "Your clients just open the app → click a photo of their meal → done.",
                  },
                  {
                    step: "2",
                    icon: <FaChartBar size={28} />,
                    text: "Clients get their Calories and macros on their screen.",
                  },
                  {
                    step: "3",
                    icon: <FaCheckCircle size={28} />,
                    text: "That photo instantly updates on your dashboard, showing their calories and macros automatically.",
                  },
                  {
                    step: "4",
                    icon: <FaUsers size={28} />,
                    text: "Meanwhile, your clients see their daily progress, feel motivated, and stay accountable — all without you sending a single reminder.",
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
                    That's smart coaching powered by AI.
                    <br />
                    <span style={{ fontSize: "1.2rem" }}>Simple. Fun. Effective.</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Fun Factor Section */}
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
              The Fun Factor
            </h2>
            <p className="text-muted mb-5" style={{ fontSize: "1.1rem" }}>
              Hook for Clients
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
              <motion.div
                className="row g-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="col-md-6">
                  <div
                    className="card border-0 shadow-lg p-4 rounded-4"
                    style={{
                      background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
                      borderLeft: "4px solid #ec4899",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <FaShareAlt size={28} style={{ color: "#ec4899" }} />
                      <h5 className="fw-bold mb-0" style={{ color: "#9f1239" }}>
                        Social Media Ready
                      </h5>
                    </div>
                    <p style={{ color: "#831843", fontSize: "1.05rem", margin: 0, lineHeight: "1.6" }}>
                      They'll love staying consistent to post their milestones on social media— and you'll love watching their transformations go viral.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="card border-0 shadow-lg p-4 rounded-4"
                    style={{
                      background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                      borderLeft: "4px solid #3b82f6",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <FaRobot size={28} style={{ color: "#3b82f6" }} />
                      <h5 className="fw-bold mb-0" style={{ color: "#1e3a8a" }}>
                        Become the Cool AI Coach
                      </h5>
                    </div>
                    <p style={{ color: "#1e40af", fontSize: "1.05rem", margin: 0, lineHeight: "1.6" }}>
                      That's how you become the "cool AI coach" everyone wants to train with.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Coaches Love It Section with 3D Cards */}
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
                title: "Automated Client Tracking",
                desc: "No more spreadsheets or WhatsApp check-ins — AI does it for you.",
                icon: FaRobot,
                img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop&q=80",
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              },
              {
                title: "Meal Photo Tracking",
                desc: "Clients upload. You and clients get macros. Real-time insights, zero effort.",
                icon: FaCamera,
                img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80",
                gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              },
              {
                title: "Challenge Mode & Milestones",
                desc: "Keep clients hooked with 32-day streaks, badges & social media-worthy banners.",
                icon: FaTrophy,
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&q=80",
                gradient: "linear-gradient(135deg, #fad961 0%, #f76b1c 100%)",
              },
              {
                title: "Save Time. Coach More.",
                desc: "You focus on personal transformations, not manual tracking.",
                icon: FaClock,
                img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80",
                gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              },
              {
                title: "Boost Your Personal Brand",
                desc: "Deliver visible results, share progress publicly, and attract more clients.",
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

      {/* How It Works Section */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            style={{ fontSize: "2.8rem", color: "#1f2937" }}
          >
            How It Works
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
                title: "Invite Your Clients",
                desc: "Onboard in seconds — no tech skills or setup required.",
                icon: FaUserPlus,
                color: "#667eea",
              },
              {
                number: "2",
                title: "Clients Upload Meal Photos",
                desc: "AI reads, analyzes, and updates their macros instantly.",
                icon: FaCamera,
                color: "#f5576c",
              },
              {
                number: "3",
                title: "You Track Progress & Engage",
                desc: "See everything on one dashboard — stay in control, effortlessly.",
                icon: FaChartLine,
                color: "#4facfe",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="col-lg-4 col-md-6"
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
                  <div
                    className="position-absolute top-0 start-50 translate-middle"
                    style={{
                      transform: "translate(-50%, -50%)",
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    }}
                  >
                    <span
                      className="fw-bold"
                      style={{ color: "#fff", fontSize: "1.8rem" }}
                    >
                      {step.number}
                    </span>
                  </div>
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

      {/* Still have questions? Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container text-center">
          <motion.h3
            className="fw-bold mb-3"
            style={{ fontSize: "2rem", color: "#333" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Still have questions?
          </motion.h3>
          <motion.p
            className="text-muted mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            We're here to help you on your fitness journey.
          </motion.p>
          <motion.button
            className="btn btn-lg rounded-pill px-5 py-3"
            onClick={() => navigate("/contact")}
            style={{
              backgroundColor: "#1a1a1a",
              color: "#fff",
              minHeight: "52px",
            }}
            whileHover={{ opacity: 0.9 }}
          >
            Contact Us
          </motion.button>
        </div>
      </section>

      {/* Introducing the LevelGrit app Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center">
              <motion.div
                className="d-flex gap-3 justify-content-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <img
                  src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=300&h=600&fit=crop&q=80"
                  alt="App Screen 1"
                  className="rounded shadow"
                  style={{
                    width: "150px",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=300&h=600&fit=crop&q=80"
                  alt="App Screen 2"
                  className="rounded shadow"
                  style={{
                    width: "150px",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2
                  className="fw-bold mb-4"
                  style={{ fontSize: "2.5rem", color: "#333" }}
                >
                  Introducing the LevelGrit app
                </h2>
                <p className="mb-4 text-muted" style={{ fontSize: "1.1rem" }}>
                  Access your personalized fitness and nutrition plans, track
                  your progress, communicate with your coach, and stay
                  motivated—all from the palm of your hand. Available as a
                  Progressive Web App - no download needed!
                </p>
                <motion.button
                  className="btn btn-dark rounded-pill px-4 py-2"
                  style={{ minHeight: "44px" }}
                  onClick={handleSignUpNavigation}
                whileHover={{ opacity: 0.9 }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section className="py-5 " style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container text-center">
          <motion.h2
            className="text-center fw-bold mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Client Testimonial
          </motion.h2>
          <motion.div
            className="mx-auto"
            style={{ maxWidth: "500px" }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Animated3DCard>
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=400&fit=crop&q=80"
                  alt="Coach"
                  className="img-fluid"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body p-4">
                  <h5 className="fw-bold text-dark mb-3">Certified Coach</h5>
                  <p className="text-muted fst-italic">
                    “This tool cut my admin time in half — now I coach more
                    people, and they love the daily check-ins!”
                  </p>
                </div>
              </div>
            </Animated3DCard>
          </motion.div>
        </div>
      </section>

      {/* A judgement-free space for everyone Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2
                  className="fw-bold mb-4"
                  style={{ fontSize: "2.5rem", color: "#333" }}
                >
                  A judgement-free space for everyone
                </h2>
                <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
                  At LevelGrit, we believe fitness is for everyone. Our
                  inclusive community welcomes people of all ages, backgrounds,
                  and fitness levels. We celebrate every step of your journey,
                  no matter where you start.
                </p>
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div
                className="row g-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                {[
                  "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=200&h=200&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop&q=80",
                ].map((img, idx) => (
                  <motion.div
                    key={idx}
                    className="col-4"
                    whileHover={{ opacity: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={img}
                      alt="Diverse fitness community"
                      className="img-fluid rounded"
                      style={{
                        aspectRatio: "1",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Surround yourself with the right people Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <motion.img
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop&q=80"
                alt="Fitness Community"
                className="img-fluid rounded-4 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ opacity: 0.9 }}
              />
            </div>
            <div className="col-lg-6 mb-4 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2
                  className="fw-bold mb-4"
                  style={{ fontSize: "2.5rem", color: "#333" }}
                >
                  Surround yourself with the right people
                </h2>
                <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
                  Join a community of like-minded individuals who support and
                  motivate each other. Your success is our success, and we're
                  all in this together.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

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
