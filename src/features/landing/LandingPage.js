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
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Animated3DCard from "../../components/landing/Animated3DCard";
import logo3 from "../../assets/images/logo3.jpeg";

const LandingPage = () => {
  const navigate = useNavigate();

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
            LevelGrit
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
    color: "#4CAF50",
    border: "2px solid #4CAF50",
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
                backgroundColor: "#4CAF50",
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
        style={{ marginTop: "80px", paddingTop: "4rem", paddingBottom: "4rem" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <motion.div {...fadeInUp}>
                <h1
                  className="display-3 fw-bold mb-4"
                  style={{ color: "#333", lineHeight: "1.2" }}
                >
                  Your Coaching,
                  <br />
                  <span style={{ color: "#4CAF50" }}>Supercharged.</span>
                </h1>
                <p
                  className="lead mb-4"
                  style={{ color: "#666", fontSize: "1.1rem" }}
                >
                  We don’t replace you with AI — we empower certified coaches
                  with tools that make tracking, engaging, and motivating
                  clients effortless. Turn daily check-ins into long-term client
                  success.
                </p>
                <motion.button
                  className="btn btn-lg rounded-pill px-5 py-3 fw-semibold mb-3"
                  onClick={handleSignUpNavigation}
                  style={{
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                    minHeight: "52px",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  👉 Get Started Free
                </motion.button>
              </motion.div>
              <div className="small text-muted">
                Your clients stay consistent. You stay focused. AI just helps.
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=500&fit=crop&q=80"
                    alt="Fitness"
                    className="img-fluid rounded-4 shadow-lg"
                    style={{
                      maxHeight: "500px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  {/* Floating metric cards with 3D effect */}
                  <motion.div
                    className="position-absolute bg-white rounded-3 p-3 shadow"
                    style={{
                      top: "20px",
                      left: "-20px",
                      transform: "translate(0, 0)",
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <small className="text-muted d-block">Daily Steps</small>
                    <strong style={{ color: "#4CAF50", fontSize: "1.2rem" }}>
                      7,500
                    </strong>
                  </motion.div>
                  <motion.div
                    className="position-absolute bg-white rounded-3 p-3 shadow"
                    style={{
                      bottom: "20px",
                      right: "-20px",
                      transform: "translate(0, 0)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <small className="text-muted d-block">
                      Calories Burned
                    </small>
                    <strong style={{ color: "#4CAF50", fontSize: "1.2rem" }}>
                      1,200
                    </strong>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How LevelGrit helps you Section with 3D Cards */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-3"
            style={{ fontSize: "2.5rem", color: "#333" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Coaches Love Us
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
                title: "Engage Clients Daily",
                desc: "Chat, motivate, and inspire consistency without juggling multiple apps.",
                icon: FaMobile,
                img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop&q=80",
              },
              {
                title: "Track Progress Effortlessly",
                desc: "Macro tracking, meal snapshots, and fitness logs in one clear view.",
                icon: FaCheckCircle,
                img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80",
              },
              {
                title: "Save Time, Coach More",
                desc: "AI handles the data grunt work so you can focus on personal coaching.",
                icon: FaChartLine,
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&q=80",
              },
            ].map((feature, idx) => (
              <div key={idx} className="col-md-4">
                <Animated3DCard delay={idx * 0.1}>
                  <div
                    className="card border-0 shadow-sm h-100"
                    style={{ borderRadius: "1rem", overflow: "hidden" }}
                  >
                    <img
                      src={feature.img}
                      alt={feature.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="card-body p-4">
                      <feature.icon
                        className="mb-3"
                        size={40}
                        style={{ color: "#4CAF50" }}
                      />
                      <h4 className="fw-bold mb-3" style={{ color: "#333" }}>
                        {feature.title}
                      </h4>
                      <p className="text-muted mb-0">{feature.desc}</p>
                    </div>
                  </div>
                </Animated3DCard>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The right plan for your health Section */}
      <section className="py-5">
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-3"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
          >
            How It Works
          </motion.h2>
          <motion.div
            className="row justify-content-center g-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
          >
            {[
              {
                title: "Onboard Clients Easily",
                desc: "No messy spreadsheets, just simple profiles.",
                icon: FaUserPlus,
              },
              {
                title: "Monitor & Motivate",
                desc: "Daily check-ins, chats, and progress tracking.",
                icon: FaChartLine,
              },
              {
                title: "Grow Your Impact",
                desc: "Scale your coaching while staying personal.",
                icon: FaUsers,
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="col-md-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="card border-0 shadow-sm text-center h-100 p-4 rounded-4">
                  <step.icon size={36} className="text-success mb-3" />
                  <h5 className="fw-bold text-dark mb-3">{step.title}</h5>
                  <p className="text-muted">{step.desc}</p>
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                    whileHover={{ scale: 1.1, rotate: 5 }}
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
                whileHover={{ scale: 1.05 }}
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
                  whileHover={{ scale: 1.2 }}
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
                  whileHover={{ scale: 1.2 }}
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
                  whileHover={{ scale: 1.2 }}
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
