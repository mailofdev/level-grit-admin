import React from 'react';
import { FaComments, FaChartBar, FaRocket, FaUserPlus, FaEye, FaHeart, FaStar, FaCheck } from 'react-icons/fa';
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
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#how-it-works">How It Works</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#testimonials">Testimonials</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-primary ms-2 hover-scale" onClick={handleSignInNavigation}>Sign In</button>
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
                  Coach Smarter. <br />
                  <span className="text-primary">Motivate Better.</span>
                </h1>
                <p className="lead text-muted mb-4 fs-5">
                  We don't replace you with AI — we empower certified coaches with tools that make 
                  tracking, engaging, and motivating clients effortless. Turn daily check-ins into 
                  long-term client success.
                </p>
                <div className="cta-section">
                  <button onClick={handleSignUpNavigation} className="btn btn-primary btn px-5 py-3 fw-semibold rounded-pill shadow-lg hover-lift mb-3">
                    👉 Get Started
                  </button>
                  <div className="micro-tagline text-muted small">
                    "Your clients stay consistent. You stay focused. AI just helps."
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

      {/* Value Section */}
      <section id="features" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-4">Why Coaches Love Us</h2>
            <p className="lead text-muted">Powerful tools designed specifically for certified fitness professionals</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <FaComments size={32} />
                  </div>
                  <h4 className="fw-bold mb-3">💬 Engage Clients Daily</h4>
                  <p className="text-muted">Chat, motivate, and inspire consistency without juggling multiple apps. Keep your clients connected and accountable.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-4">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <FaChartBar size={32} />
                  </div>
                  <h4 className="fw-bold mb-3">📊 Track Progress Effortlessly</h4>
                  <p className="text-muted">Macro tracking, meal snapshots, and fitness logs in one clear view. Data visualization that makes sense.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow theme-transition">
                <div className="card-body text-center p-4">
                  <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <FaRocket size={32} />
                  </div>
                  <h4 className="fw-bold mb-3">🚀 Save Time, Coach More</h4>
                  <p className="text-muted">AI handles the data grunt work so you can focus on personal coaching. Scale your impact without burning out.</p>
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
                <a href="#" className="text-white text-decoration-none me-4">Privacy</a>
                <a href="#" className="text-white text-decoration-none me-4">Terms</a>
                <a href="#" className="text-white text-decoration-none">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;