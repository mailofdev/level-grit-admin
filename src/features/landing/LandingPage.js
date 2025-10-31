import React from 'react';
import { FaComments, FaChartBar, FaRocket, FaUserPlus, FaEye, FaHeart, FaStar, FaCheck, FaShieldAlt, FaMobile, FaClock, FaUsers, FaUtensils, FaDumbbell, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const handleSignInNavigation = () => {
    navigate('login')
  }
  const handleSignUpNavigation = () => {
    navigate('register')
  }
  return (
    <div className="min-vh-100 theme-transition">
      {/* Mobile-Optimized Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm py-2 py-lg-3 fixed-top theme-transition" style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
        <div className="container-fluid px-3 px-lg-4">
          <a className="navbar-brand fw-bold text-primary fs-4 fs-lg-3" href="#">
            LevelGrit
          </a>
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            style={{ minHeight: '34px', minWidth: '34px' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item py-2 py-lg-0">
                <a className="nav-link smooth-transition" href="#features" style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}>Features</a>
              </li>
              <li className="nav-item py-2 py-lg-0">
                <a className="nav-link smooth-transition" href="#how-it-works" style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}>How It Works</a>
              </li>
              <li className="nav-item py-2 py-lg-0">
                <a className="nav-link smooth-transition" href="#pricing" style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}>Pricing</a>
              </li>
              <li className="nav-item py-2 py-lg-0">
                <a className="nav-link smooth-transition" href="#testimonials" style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}>Testimonials</a>
              </li>
              <li className="nav-item py-2 py-lg-0">
                <button className="btn btn-outline-primary w-100 w-lg-auto ms-lg-2 hover-scale smooth-transition" style={{ minHeight: '34px' }} onClick={handleSignInNavigation}>Sign In</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile-Optimized Hero Section */}
      <section className="py-4 py-lg-5 theme-transition" style={{marginTop: '70px'}}>
        <div className="container-fluid px-3 px-lg-4 py-3 py-lg-5">
          <div className="row align-items-center g-4 min-vh-50 min-vh-lg-75">
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="hero-content text-center text-lg-start">
                <h1 className="display-5 display-lg-4 fw-bold mb-3 mb-lg-4">
                  Transform Your <br />
                  <span className="text-primary">Training Business</span>
                </h1>
                <p className="lead text-muted mb-3 mb-lg-4 fs-6 fs-lg-5">
                  The all-in-one platform for fitness trainers. Manage clients, create meal plans, 
                  track progress, and communicate seamlessly. Scale your practice while delivering 
                  personalized results to every client.
                </p>
                <div className="cta-section">
                  <button onClick={handleSignUpNavigation} className="btn btn-primary btn-lg px-4 px-lg-5 py-3 fw-semibold rounded-pill shadow-lg hover-lift mb-3 w-100 w-sm-auto" style={{ minHeight: '52px' }}>
                    👉 Get Started
                  </button>
                  <div className="micro-tagline text-muted small px-2">
                    "Join 10,000+ trainers already growing their business"
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2">
              <div className="hero-image text-center px-2 px-lg-0">
                <div className="position-relative">
                  <div className="card border-0 shadow-lg p-4 p-lg-5 theme-transition" style={{height: '300px', minHeight: '250px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'}}>
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <div className="text-white">
                        <FaChartBar size={60} className="mb-3 opacity-75" />
                        <h5 className="fw-light">Dashboard Preview</h5>
                        <p className="small opacity-75 mb-0">Intuitive coaching interface</p>
                      </div>
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="position-absolute top-0 start-0 translate-middle d-none d-md-block">
                    <div className="bg-success text-white rounded-circle p-3 shadow hover-scale" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaCheck size={20} />
                    </div>
                  </div>
                  <div className="position-absolute bottom-0 end-0 translate-middle d-none d-md-block">
                    <div className="bg-warning text-white rounded-circle p-3 shadow hover-scale" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaHeart size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Features Section */}
      <section id="features" className="py-4 py-lg-5">
        <div className="container-fluid px-3 px-lg-4 py-3 py-lg-5">
          <div className="text-center mb-4 mb-lg-5 px-2">
            <h2 className="display-6 display-lg-5 fw-bold mb-3 mb-lg-4">Everything You Need to Succeed</h2>
            <p className="lead text-muted fs-6 fs-lg-5">Comprehensive tools designed for fitness professionals</p>
          </div>
          <div className="row g-3 g-lg-4">
            <div className="col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-3 p-lg-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4" style={{width: '60px', height: '60px'}}>
                    <FaUsers size={28} />
                  </div>
                  <h5 className="fw-bold mb-2 mb-lg-3">Client Management</h5>
                  <p className="text-muted small mb-0">Organize client profiles, track progress, and manage subscriptions all in one place.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-3 p-lg-4">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4" style={{width: '60px', height: '60px'}}>
                    <FaUtensils size={28} />
                  </div>
                  <h5 className="fw-bold mb-2 mb-lg-3">Meal Planning</h5>
                  <p className="text-muted small mb-0">Create personalized meal plans with detailed macros, calories, and nutritional information.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-3 p-lg-4">
                  <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4" style={{width: '60px', height: '60px'}}>
                    <FaChartBar size={28} />
                  </div>
                  <h5 className="fw-bold mb-2 mb-lg-3">Progress Tracking</h5>
                  <p className="text-muted small mb-0">Monitor client progress with detailed analytics, photos, and measurement tracking.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-3 p-lg-4">
                  <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4" style={{width: '60px', height: '60px'}}>
                    <FaComments size={28} />
                  </div>
                  <h5 className="fw-bold mb-2 mb-lg-3">Client Communication</h5>
                  <p className="text-muted small mb-0">Built-in messaging system to stay connected with clients and provide real-time support.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-3 p-lg-4">
                  <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4" style={{width: '60px', height: '60px'}}>
                    <FaDumbbell size={28} />
                  </div>
                  <h5 className="fw-bold mb-2 mb-lg-3">Workout Plans</h5>
                  <p className="text-muted small mb-0">Design and share custom workout routines with detailed instructions and progress tracking.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-3 p-lg-4">
                  <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4" style={{width: '60px', height: '60px'}}>
                    <FaShieldAlt size={28} />
                  </div>
                  <h5 className="fw-bold mb-2 mb-lg-3">Secure & Compliant</h5>
                  <p className="text-muted small mb-0">HIPAA-compliant platform with enterprise-grade security to protect client data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized How It Works */}
      <section id="how-it-works" className="py-4 py-lg-5">
        <div className="container-fluid px-3 px-lg-4 py-3 py-lg-5">
          <div className="text-center mb-4 mb-lg-5 px-2">
            <h2 className="display-6 display-lg-5 fw-bold mb-3 mb-lg-4">How It Works</h2>
            <p className="lead text-muted fs-6 fs-lg-5">Three simple steps to transform your coaching practice</p>
          </div>
          <div className="row g-3 g-lg-5 align-items-center">
            <div className="col-lg-4">
              <div className="card text-center shadow-sm hover-shadow theme-transition">
                <div className="card-body p-3 p-lg-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4 fs-3 fs-lg-2 fw-bold" style={{width: '60px', height: '60px'}}>
                    1
                  </div>
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4" style={{width: '80px', height: '80px'}}>
                    <FaUserPlus size={32} className="text-primary" />
                  </div>
                  <h5 className="fw-bold mb-2 mb-lg-3">Onboard Clients Easily</h5>
                  <p className="text-muted small mb-0">No messy spreadsheets, just simple client profiles. Get your clients set up in minutes, not hours.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card text-center shadow-sm hover-shadow theme-transition">
                <div className="card-body p-3 p-lg-4">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4 fs-3 fs-lg-2 fw-bold" style={{width: '60px', height: '60px'}}>
                    2
                  </div>
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4" style={{width: '80px', height: '80px'}}>
                    <FaEye size={32} className="text-success" />
                  </div>
                  <h5 className="fw-bold mb-2 mb-lg-3">Monitor & Motivate</h5>
                  <p className="text-muted small mb-0">Daily check-ins, chats, and progress snapshots. Stay connected with your clients every step of the way.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card text-center shadow-sm hover-shadow theme-transition">
                <div className="card-body p-3 p-lg-4">
                  <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4 fs-3 fs-lg-2 fw-bold" style={{width: '60px', height: '60px'}}>
                    3
                  </div>
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mb-lg-4" style={{width: '80px', height: '80px'}}>
                    <FaHeart size={32} className="text-warning" />
                  </div>
                  <h5 className="fw-bold mb-2 mb-lg-3">Grow Your Impact</h5>
                  <p className="text-muted small mb-0">Deliver results at scale while building deeper relationships. Transform lives, not just bodies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Pricing Section */}
      <section id="pricing" className="py-4 py-lg-5 bg-light">
        <div className="container-fluid px-3 px-lg-4 py-3 py-lg-5">
          <div className="text-center mb-4 mb-lg-5 px-2">
            <h2 className="display-6 display-lg-5 fw-bold mb-3 mb-lg-4">Simple, Transparent Pricing</h2>
            <p className="lead text-muted fs-6 fs-lg-5">Choose the plan that fits your practice</p>
          </div>
          <div className="row justify-content-center g-3 g-lg-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-3 p-lg-4">
                  <h5 className="fw-bold text-primary mb-2 mb-lg-3">Starter</h5>
                  <div className="mb-3 mb-lg-4">
                    <span className="display-5 display-lg-4 fw-bold text-primary">$29</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="list-unstyled text-start mb-3 mb-lg-4">
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Up to 10 clients</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Basic meal planning</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Progress tracking</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Client messaging</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Email support</li>
                  </ul>
                  <button className="btn btn-outline-primary w-100 smooth-transition" style={{ minHeight: '44px' }} onClick={handleSignUpNavigation}>
                    Get Started
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-primary shadow-lg hover-shadow theme-transition position-relative">
                <div className="position-absolute top-0 start-50 translate-middle">
                  <span className="badge bg-primary px-3 py-2">Most Popular</span>
                </div>
                <div className="card-body text-center p-3 p-lg-4 pt-4 pt-lg-5">
                  <h5 className="fw-bold text-primary mb-2 mb-lg-3">Professional</h5>
                  <div className="mb-3 mb-lg-4">
                    <span className="display-5 display-lg-4 fw-bold text-primary">$59</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="list-unstyled text-start mb-3 mb-lg-4">
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Up to 50 clients</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Advanced meal planning</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Detailed analytics</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Video messaging</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Priority support</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Custom branding</li>
                  </ul>
                  <button className="btn btn-primary w-100 smooth-transition" style={{ minHeight: '44px' }} onClick={handleSignUpNavigation}>
                    Start Free Trial
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-3 p-lg-4">
                  <h5 className="fw-bold text-primary mb-2 mb-lg-3">Enterprise</h5>
                  <div className="mb-3 mb-lg-4">
                    <span className="display-5 display-lg-4 fw-bold text-primary">$99</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="list-unstyled text-start mb-3 mb-lg-4">
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Unlimited clients</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />White-label solution</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />API access</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Team management</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />24/7 phone support</li>
                    <li className="mb-2 small"><FaCheck className="text-success me-2" />Custom integrations</li>
                  </ul>
                  <button className="btn btn-outline-primary w-100 smooth-transition" style={{ minHeight: '44px' }} onClick={handleSignUpNavigation}>
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4 mt-lg-5 px-2">
            <p className="text-muted small">
              <FaShieldAlt className="me-2" />
              All plans include 14-day free trial • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Testimonials */}
      <section id="testimonials" className="py-4 py-lg-5">
        <div className="container-fluid px-3 px-lg-4 py-3 py-lg-5">
          <div className="text-center mb-4 mb-lg-5 px-2">
            <h2 className="display-6 display-lg-5 fw-bold mb-3 mb-lg-4">What Coaches Are Saying</h2>
            <p className="lead text-muted fs-6 fs-lg-5">Real feedback from certified professionals</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg hover-shadow theme-transition">
                <div className="card-body p-3 p-lg-5">
                  <div className="text-center mb-3 mb-lg-4">
                    <div className="d-flex justify-content-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-warning me-1" size={18} />
                      ))}
                    </div>
                    <blockquote className="blockquote fs-6 fs-lg-5">
                      <p className="mb-3 mb-lg-4">"This tool cut my admin time in half — now I coach more people and they love the daily check-ins. My clients are more engaged than ever, and I can focus on what I do best: coaching."</p>
                    </blockquote>
                    <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-2 mb-sm-0 me-sm-3 fs-5 fw-bold" style={{width: '50px', height: '50px', minWidth: '50px', minHeight: '50px'}}>
                        J
                      </div>
                      <div className="text-center text-sm-start">
                        <div className="fw-bold">Jessica Martinez</div>
                        <div className="text-muted small">Certified Personal Trainer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Final CTA */}
      <section className="py-4 py-lg-5 bg-primary text-white">
        <div className="container-fluid px-3 px-lg-4 py-3 py-lg-5 rounded">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8 px-2">
              <h2 className="display-6 display-lg-5 fw-bold mb-3 mb-lg-4">Ready to Empower Your Coaching?</h2>
              <p className="lead mb-4 mb-lg-5 fs-6 fs-lg-5">Join thousands of coaches who are already transforming their practice and their clients' lives.</p>
              <button onClick={handleSignUpNavigation} className="btn btn-light btn-lg px-4 px-lg-5 py-3 fw-semibold rounded-pill shadow-lg hover-lift w-100 w-sm-auto" style={{ minHeight: '52px' }}>
                👉 Empower Your Coaching Today
              </button>
              <div className="mt-3 mt-lg-4">
                <small className="opacity-75">No credit card required • 14-day free trial • Cancel anytime</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container-fluid px-3 px-lg-4 rounded">
          <div className="row g-3 align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-md-start gap-2">
                <span className="fw-bold fs-5 fs-lg-4">LevelGrit</span>
                <span className="text-muted small">© 2025 All rights reserved.</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="text-center text-md-end">
                <div className="d-flex flex-column flex-sm-row flex-wrap align-items-center justify-content-center justify-content-md-end gap-2 gap-sm-3">
                  <a href="/privacy-policy" className="text-white text-decoration-none smooth-transition small" style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}>Privacy Policy</a>
                  <a href="/terms-conditions" className="text-white text-decoration-none smooth-transition small" style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}>Terms & Conditions</a>
                  <a href="/contact" className="text-white text-decoration-none smooth-transition small" style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}>Contact</a>
                  <a href="/cancellation-policy" className="text-white text-decoration-none smooth-transition small" style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}>Cancellation Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;