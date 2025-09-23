import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const features = [
  {
    title: "Smart Meal Tracking",
    desc: "Upload meal images and instantly get calories, macros, and protein details with AI-powered food recognition.",
    icon: "🍎",
    gradient: "linear-gradient(135deg, #28a745, #007bff)"
  },
  {
    title: "Daily Streaks & Targets",
    desc: "Complete your daily meals and maintain streaks to achieve trainer-assigned goals with gamified progress.",
    icon: "🎯",
    gradient: "linear-gradient(135deg, #6f42c1, #e83e8c)"
  },
  {
    title: "Personalized Meal Plans",
    desc: "Trainers can assign custom meal charts and track client progress effortlessly with real-time insights.",
    icon: "📋",
    gradient: "linear-gradient(135deg, #ffc107, #fd7e14)"
  },
  {
    title: "Trainer Notifications",
    desc: "Stay on track with timely meal reminders and motivational notifications from your dedicated trainer.",
    icon: "🔔",
    gradient: "linear-gradient(135deg, #007bff, #6f42c1)"
  },
  {
    title: "Problem Solved",
    desc: "No more messy data tracking — everything about meals and progress unified in one intelligent platform.",
    icon: "✨",
    gradient: "linear-gradient(135deg, #dc3545, #e83e8c)"
  },
];

const stats = [
  { number: "10K+", label: "Active Users" },
  { number: "50K+", label: "Meals Tracked" },
  { number: "95%", label: "Goal Achievement" },
  { number: "24/7", label: "Support" }
];

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const customStyles = `
    .gradient-bg {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .glass-effect {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .floating-orb {
      position: absolute;
      border-radius: 50%;
      mix-blend-mode: multiply;
      filter: blur(40px);
      opacity: 0.3;
      animation: float 6s ease-in-out infinite;
    }
    
    .floating-orb-1 {
      top: 20%;
      left: 10%;
      width: 300px;
      height: 300px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      animation-delay: 0s;
    }
    
    .floating-orb-2 {
      top: 10%;
      right: 10%;
      width: 250px;
      height: 250px;
      background: linear-gradient(45deg, #ffc107, #fd7e14);
      animation-delay: 2s;
    }
    
    .floating-orb-3 {
      bottom: 20%;
      left: 50%;
      width: 200px;
      height: 200px;
      background: linear-gradient(45deg, #e83e8c, #dc3545);
      animation-delay: 4s;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(120deg); }
      66% { transform: translateY(20px) rotate(240deg); }
    }
    
    .feature-card {
      transition: all 0.3s ease;
      border: 1px solid rgba(0,0,0,0.1);
    }
    
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    
    .problem-card {
      background: rgba(220, 53, 69, 0.1);
      border: 1px solid rgba(220, 53, 69, 0.3);
    }
    
    .solution-card {
      background: rgba(40, 167, 69, 0.1);
      border: 1px solid rgba(40, 167, 69, 0.3);
    }
    
    .btn-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      transition: all 0.3s ease;
    }
    
    .btn-gradient:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
    
    .hero-emoji {
      font-size: 4rem;
      animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .navbar-glass {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    
    .dark-section {
      background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    }
    
    .stats-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }
    
    .stats-card:hover {
      transform: translateY(-5px);
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-vh-100 d-flex flex-column position-relative overflow-hidden">
        
        {/* Animated Background */}
        <div className="position-fixed w-100 h-100" style={{ zIndex: -1 }}>
          <div className="floating-orb floating-orb-1"></div>
          <div className="floating-orb floating-orb-2"></div>
          <div className="floating-orb floating-orb-3"></div>
        </div>

        {/* Sticky Navigation */}
        <motion.nav 
          className="navbar navbar-expand-lg fixed-top navbar-glass"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container">
            <motion.a 
              className="navbar-brand fw-bold fs-3 gradient-text"
              href="#"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              🍽️ FitMeal
            </motion.a>
            
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                {["Features", "About", "Contact"].map((item, i) => (
                  <motion.li 
                    key={item}
                    className="nav-item"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <a className="nav-link" href={`#${item.toLowerCase()}`}>{item}</a>
                  </motion.li>
                ))}
              </ul>
              
              <motion.button
                className="btn btn-gradient text-white px-4 py-2 rounded-pill"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="min-vh-100 d-flex align-items-center justify-content-center text-center py-5 position-relative">
          <motion.div
            className="position-absolute w-100 h-100"
            style={{ y: y1, zIndex: -1 }}
          >
            <div className="position-absolute bg-warning rounded-circle opacity-25" 
                 style={{ top: '10%', left: '5%', width: '80px', height: '80px' }}></div>
            <div className="position-absolute bg-success rounded-circle opacity-25" 
                 style={{ top: '20%', right: '10%', width: '60px', height: '60px' }}></div>
            <div className="position-absolute bg-danger rounded-circle opacity-25" 
                 style={{ bottom: '30%', left: '15%', width: '40px', height: '40px' }}></div>
          </motion.div>

          <div className="container">
            <motion.div
              className="hero-emoji mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 260, damping: 20 }}
            >
              🍽️
            </motion.div>

            <motion.h1
              className="display-1 fw-bold mb-4 gradient-text"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Track. Eat.
              <br />
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="d-inline-block"
              >
                Achieve.
              </motion.span>
            </motion.h1>

            <motion.p
              className="lead fs-4 mb-5 text-muted"
              style={{ maxWidth: '800px', margin: '0 auto 3rem' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              A smarter way for trainers and clients to track meals, stay on target, 
              and achieve health goals with <span className="text-primary fw-semibold">AI-powered insights</span>.
            </motion.p>

            <motion.div
              className="d-flex flex-column flex-sm-row gap-3 justify-content-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.button
                className="btn btn-gradient text-white btn-lg px-5 py-3 rounded-pill shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                🚀 Start Free Trial
              </motion.button>
              <motion.button
                className="btn btn-outline-primary btn-lg px-5 py-3 rounded-pill"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📱 Watch Demo
              </motion.button>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              className="row mt-5 pt-5"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="col-6 col-md-3 mb-3"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
                >
                  <div className="stats-card p-4 rounded text-center">
                    <div className="display-6 fw-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-muted small">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-5 my-5">
          <div className="container">
            <motion.div
              className="text-center mb-5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="display-3 fw-bold mb-4 gradient-text">Powerful Features</h2>
              <p className="lead text-muted">Everything you need to transform your nutrition journey</p>
            </motion.div>

            <div className="row g-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="col-md-6 col-lg-4"
                  initial={{ opacity: 0, y: 50, rotateX: 45 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  viewport={{ once: true }}
                >
                  <div className="feature-card h-100 p-4 rounded-3 bg-white shadow-sm position-relative overflow-hidden">
                    <motion.div
                      className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                      style={{ background: feature.gradient }}
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <motion.div
                      className="display-1 mb-3 p-3 rounded-3 d-inline-block"
                      style={{ background: feature.gradient }}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h4 className="h3 fw-bold mb-3 text-dark">{feature.title}</h4>
                    <p className="text-muted mb-0">{feature.desc}</p>

                    <motion.div
                      className="position-absolute bottom-3 end-3 opacity-0"
                      whileHover={{ opacity: 1, x: 0 }}
                      initial={{ x: -10 }}
                    >
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" 
                           style={{ width: '32px', height: '32px' }}>
                        →
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem & Solution Section */}
        <section className="dark-section text-white py-5 my-5 position-relative">
          <motion.div
            className="position-absolute w-100 h-100 opacity-25"
            style={{ y: y2, zIndex: -1 }}
          >
            <div className="position-absolute bg-white rounded-circle" 
                 style={{ top: '10%', left: '5%', width: '4px', height: '4px' }}></div>
            <div className="position-absolute bg-white rounded-circle" 
                 style={{ top: '30%', right: '10%', width: '3px', height: '3px' }}></div>
            <div className="position-absolute bg-white rounded-circle" 
                 style={{ bottom: '20%', left: '25%', width: '5px', height: '5px' }}></div>
            <div className="position-absolute bg-white rounded-circle" 
                 style={{ bottom: '40%', right: '30%', width: '2px', height: '2px' }}></div>
          </motion.div>

          <div className="container text-center">
            <motion.h2
              className="display-3 fw-bold mb-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              The Problem We Solve
            </motion.h2>

            <div className="row align-items-center">
              <div className="col-lg-6 mb-4">
                <motion.div
                  className="problem-card p-4 rounded-3 mb-4"
                  whileHover={{ scale: 1.05, x: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h4 className="h5 fw-semibold mb-3 text-danger">❌ Manual Tracking Chaos</h4>
                  <p className="text-light mb-0">Messy spreadsheets, forgotten meals, and inconsistent data collection</p>
                </motion.div>
                
                <motion.div
                  className="problem-card p-4 rounded-3 mb-4"
                  whileHover={{ scale: 1.05, x: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h4 className="h5 fw-semibold mb-3 text-danger">❌ Poor Communication</h4>
                  <p className="text-light mb-0">Trainers and clients struggle to stay connected and track progress</p>
                </motion.div>

                <motion.div
                  className="problem-card p-4 rounded-3"
                  whileHover={{ scale: 1.05, x: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h4 className="h5 fw-semibold mb-3 text-danger">❌ Goal Abandonment</h4>
                  <p className="text-light mb-0">Without proper tracking, users lose motivation and abandon fitness goals</p>
                </motion.div>
              </div>

              <div className="col-lg-6">
                <motion.div
                  className="solution-card p-4 rounded-3 mb-4"
                  whileHover={{ scale: 1.05, x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h4 className="h5 fw-semibold mb-3 text-success">✅ AI-Powered Simplicity</h4>
                  <p className="text-light mb-0">Just snap a photo - get instant nutrition analysis and macro tracking</p>
                </motion.div>
                
                <motion.div
                  className="solution-card p-4 rounded-3 mb-4"
                  whileHover={{ scale: 1.05, x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h4 className="h5 fw-semibold mb-3 text-success">✅ Seamless Connection</h4>
                  <p className="text-light mb-0">Real-time updates, notifications, and progress sharing between trainers and clients</p>
                </motion.div>

                <motion.div
                  className="solution-card p-4 rounded-3"
                  whileHover={{ scale: 1.05, x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h4 className="h5 fw-semibold mb-3 text-success">✅ Sustained Motivation</h4>
                  <p className="text-light mb-0">Gamified streaks, achievements, and personalized meal plans keep users engaged</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="about" className="bg-light py-5 text-center">
          <div className="container">
            <motion.h2
              className="display-3 fw-bold mb-4 gradient-text"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Ready to Transform Your Nutrition Journey?
            </motion.h2>
            
            <motion.p
              className="lead mb-5 text-muted mx-auto"
              style={{ maxWidth: '800px' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of trainers and clients who've already transformed their approach to nutrition tracking.
              Start your free trial today and experience the future of meal management.
            </motion.p>

            <motion.div
              className="d-flex flex-column flex-sm-row gap-3 justify-content-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="btn btn-gradient text-white btn-lg px-5 py-3 rounded-pill shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                🚀 Start Free Trial
              </motion.button>
              
              <motion.button
                className="btn btn-outline-primary btn-lg px-5 py-3 rounded-pill"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📞 Schedule Demo
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark text-white py-5 mt-auto">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6 mb-4">
                <h5 className="fw-bold mb-3 gradient-text">🍽️ FitMeal</h5>
                <p className="text-muted mb-3">Revolutionizing nutrition tracking with AI-powered meal analysis.</p>
                <div className="d-flex gap-2">
                  {['📘', '🐦', '📷', '💼'].map((emoji, i) => (
                    <motion.div
                      key={i}
                      className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                      whileHover={{ scale: 1.2, backgroundColor: "#667eea" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6 mb-4">
                <h6 className="fw-semibold mb-3">Product</h6>
                <ul className="list-unstyled">
                  {['Features', 'Pricing', 'Demo', 'API'].map((item, i) => (
                    <motion.li key={i} whileHover={{ x: 5 }}>
                      <a href="#" className="text-muted text-decoration-none hover-primary">{item}</a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 mb-4">
                <h6 className="fw-semibold mb-3">Company</h6>
                <ul className="list-unstyled">
                  {['About', 'Blog', 'Careers', 'Contact'].map((item, i) => (
                    <motion.li key={i} whileHover={{ x: 5 }}>
                      <a href="#" className="text-muted text-decoration-none hover-primary">{item}</a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 mb-4">
                <h6 className="fw-semibold mb-3">Support</h6>
                <ul className="list-unstyled">
                  {['Help Center', 'Privacy', 'Terms', 'Status'].map((item, i) => (
                    <motion.li key={i} whileHover={{ x: 5 }}>
                      <a href="#" className="text-muted text-decoration-none hover-primary">{item}</a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            <motion.div 
              className="border-top border-secondary pt-4 mt-4 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-muted mb-0">
                &copy; {new Date().getFullYear()} FitMeal. All rights reserved. Made with ❤️ for a healthier world.
              </p>
            </motion.div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;