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
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm py-3 fixed-top theme-transition">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary fs-3" href="#">
            LevelGrit
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link smooth-transition" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link smooth-transition" href="#how-it-works">How It Works</a>
              </li>
              <li className="nav-item">
                <a className="nav-link smooth-transition" href="#pricing">Pricing</a>
              </li>
              <li className="nav-item">
                <a className="nav-link smooth-transition" href="#testimonials">Testimonials</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-primary ms-2 hover-scale smooth-transition" onClick={handleSignInNavigation}>Sign In</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 theme-transition" style={{marginTop: '80px'}}>
        <div className="container py-5">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-4">
                  Transform Your <br />
                  <span className="text-primary">Training Business</span>
                </h1>
                <p className="lead text-muted mb-4 fs-5">
                  The all-in-one platform for fitness trainers. Manage clients, create meal plans, 
                  track progress, and communicate seamlessly. Scale your practice while delivering 
                  personalized results to every client.
                </p>
                <div className="cta-section">
                  <button onClick={handleSignUpNavigation} className="btn btn-primary btn px-5 py-3 fw-semibold rounded-pill shadow-lg hover-lift mb-3">
                    👉 Get Started
                  </button>
                  <div className="micro-tagline text-muted small">
                    "Join 10,000+ trainers already growing their business with Level Grit"
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image text-center">
                <div className="position-relative">
                  <div className="card border-0 shadow-lg p-5 theme-transition" style={{height: '400px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'}}>
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <div className="text-white">
                        <FaChartBar size={80} className="mb-3 opacity-75" />
                        <h4 className="fw-light">Dashboard Preview</h4>
                        <p className="small opacity-75">Intuitive coaching interface</p>
                      </div>
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="position-absolute top-0 start-0 translate-middle">
                    <div className="bg-success text-white rounded-circle p-3 shadow hover-scale">
                      <FaCheck size={20} />
                    </div>
                  </div>
                  <div className="position-absolute bottom-0 end-0 translate-middle">
                    <div className="bg-warning text-white rounded-circle p-3 shadow hover-scale">
                      <FaHeart size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-4">Everything You Need to Succeed</h2>
            <p className="lead text-muted">Comprehensive tools designed specifically for fitness professionals</p>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <FaUsers size={32} />
                  </div>
                  <h4 className="fw-bold mb-3">Client Management</h4>
                  <p className="text-muted">Organize client profiles, track progress, and manage subscriptions all in one place.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-4">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <FaUtensils size={32} />
                  </div>
                  <h4 className="fw-bold mb-3">Meal Planning</h4>
                  <p className="text-muted">Create personalized meal plans with detailed macros, calories, and nutritional information.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-4">
                  <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <FaChartBar size={32} />
                  </div>
                  <h4 className="fw-bold mb-3">Progress Tracking</h4>
                  <p className="text-muted">Monitor client progress with detailed analytics, photos, and measurement tracking.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-4">
                  <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <FaComments size={32} />
                  </div>
                  <h4 className="fw-bold mb-3">Client Communication</h4>
                  <p className="text-muted">Built-in messaging system to stay connected with clients and provide real-time support.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-4">
                  <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <FaDumbbell size={32} />
                  </div>
                  <h4 className="fw-bold mb-3">Workout Plans</h4>
                  <p className="text-muted">Design and share custom workout routines with detailed instructions and progress tracking.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-4">
                  <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <FaShieldAlt size={32} />
                  </div>
                  <h4 className="fw-bold mb-3">Secure & Compliant</h4>
                  <p className="text-muted">HIPAA-compliant platform with enterprise-grade security to protect client data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-4">How It Works</h2>
            <p className="lead text-muted">Three simple steps to transform your coaching practice</p>
          </div>
          <div className="row g-5 align-items-center">
            <div className="col-lg-4">
              <div className="card text-center shadow-sm hover-shadow theme-transition">
                <div className="card-body p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 fs-2 fw-bold" style={{width: '80px', height: '80px'}}>
                    1
                  </div>
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '100px', height: '100px'}}>
                    <FaUserPlus size={40} className="text-primary" />
                  </div>
                  <h4 className="fw-bold mb-3">Onboard Clients Easily</h4>
                  <p className="text-muted">No messy spreadsheets, just simple client profiles. Get your clients set up in minutes, not hours.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card text-center shadow-sm hover-shadow theme-transition">
                <div className="card-body p-4">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 fs-2 fw-bold" style={{width: '80px', height: '80px'}}>
                    2
                  </div>
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '100px', height: '100px'}}>
                    <FaEye size={40} className="text-success" />
                  </div>
                  <h4 className="fw-bold mb-3">Monitor & Motivate</h4>
                  <p className="text-muted">Daily check-ins, chats, and progress snapshots. Stay connected with your clients every step of the way.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card text-center shadow-sm hover-shadow theme-transition">
                <div className="card-body p-4">
                  <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 fs-2 fw-bold" style={{width: '80px', height: '80px'}}>
                    3
                  </div>
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '100px', height: '100px'}}>
                    <FaHeart size={40} className="text-warning" />
                  </div>
                  <h4 className="fw-bold mb-3">Grow Your Impact</h4>
                  <p className="text-muted">Deliver results at scale while building deeper relationships. Transform lives, not just bodies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="lead text-muted">Choose the plan that fits your practice</p>
          </div>
          <div className="row justify-content-center g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-4">
                  <h4 className="fw-bold text-primary mb-3">Starter</h4>
                  <div className="mb-4">
                    <span className="display-4 fw-bold text-primary">$29</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2"><FaCheck className="text-success me-2" />Up to 10 clients</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />Basic meal planning</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />Progress tracking</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />Client messaging</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />Email support</li>
                  </ul>
                  <button className="btn btn-outline-primary w-100 smooth-transition" onClick={handleSignUpNavigation}>
                    Get Started
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-primary shadow-lg hover-shadow theme-transition position-relative">
                <div className="position-absolute top-0 start-50 translate-middle">
                  <span className="badge bg-primary px-3 py-2">Most Popular</span>
                </div>
                <div className="card-body text-center p-4">
                  <h4 className="fw-bold text-primary mb-3">Professional</h4>
                  <div className="mb-4">
                    <span className="display-4 fw-bold text-primary">$59</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2"><FaCheck className="text-success me-2" />Up to 50 clients</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />Advanced meal planning</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />Detailed analytics</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />Video messaging</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />Priority support</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />Custom branding</li>
                  </ul>
                  <button className="btn btn-primary w-100 smooth-transition" onClick={handleSignUpNavigation}>
                    Start Free Trial
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-4">
                  <h4 className="fw-bold text-primary mb-3">Enterprise</h4>
                  <div className="mb-4">
                    <span className="display-4 fw-bold text-primary">$99</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2"><FaCheck className="text-success me-2" />Unlimited clients</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />White-label solution</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />API access</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />Team management</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />24/7 phone support</li>
                    <li className="mb-2"><FaCheck className="text-success me-2" />Custom integrations</li>
                  </ul>
                  <button className="btn btn-outline-primary w-100 smooth-transition" onClick={handleSignUpNavigation}>
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <p className="text-muted">
              <FaShieldAlt className="me-2" />
              All plans include 14-day free trial • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-4">What Coaches Are Saying</h2>
            <p className="lead text-muted">Real feedback from certified professionals</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg hover-shadow theme-transition">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <div className="d-flex justify-content-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-warning me-1" size={20} />
                      ))}
                    </div>
                    <blockquote className="blockquote fs-5">
                      <p className="mb-4">"This tool cut my admin time in half — now I coach more people and they love the daily check-ins. My clients are more engaged than ever, and I can focus on what I do best: coaching."</p>
                    </blockquote>
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fs-4 fw-bold" style={{width: '60px', height: '60px'}}>
                        J
                      </div>
                      <div className="text-start">
                        <div className="fw-bold">Jessica Martinez</div>
                        <div className="text-muted">Certified Personal Trainer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-5 bg-primary text-white">
        <div className="container py-5 rounded">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">Ready to Empower Your Coaching?</h2>
              <p className="lead mb-5">Join thousands of coaches who are already transforming their practice and their clients' lives.</p>
              <button onClick={handleSignUpNavigation} className="btn btn-light btn px-5 py-3 fw-semibold rounded-pill shadow-lg hover-lift">
                👉 Empower Your Coaching Today
              </button>
              <div className="mt-4">
                <small className="opacity-75">No credit card required • 14-day free trial • Cancel anytime</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container rounded">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <span className="fw-bold fs-4 me-4">LevelGrit</span>
                <span className="text-muted">© 2025 All rights reserved.</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="text-md-end">
                <a href="/privacy-policy" className="text-white text-decoration-none me-4 smooth-transition">Privacy Policy</a>
                <a href="/terms-conditions" className="text-white text-decoration-none me-4 smooth-transition">Terms & Conditions</a>
                <a href="/contact" className="text-white text-decoration-none me-4 smooth-transition">Contact</a>
                <a href="/cancellation-policy" className="text-white text-decoration-none smooth-transition">Cancellation Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;