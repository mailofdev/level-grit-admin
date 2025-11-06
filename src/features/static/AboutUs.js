/**
 * About Us Page
 * 
 * Displays company information, mission, and value propositions
 * for both fitness coaches and enthusiasts.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaDumbbell, FaChartLine, FaHeart, FaRocket } from 'react-icons/fa';
import Animated3DCard from '../../components/landing/Animated3DCard';
import Heading from '../../components/navigation/Heading';
import logo3 from '../../assets/images/logo3.jpeg';

const AboutUs = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  return (
    <div className="container-fluid px-2 px-md-3" style={{ backgroundColor: '#ffffff' }}>
      <Heading pageName="About Us" showBackButton={true} />
      <div className="d-flex flex-column" style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}>
        <div className="flex-grow-1 overflow-auto pb-3">
          <div className="container py-5">
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={logo3} 
                alt="LevelGrit" 
                style={{ 
                  height: '80px', 
                  marginBottom: '20px', 
                  borderRadius: '12px' 
                }} 
              />
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#333' }}>
                About <span style={{ color: '#28a745' }}>Level Grit</span>
              </h1>
              <p className="lead text-muted" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '1.8' }}>
                At Level Grit, we're building more than just a fitness app — we're creating a community 
                where fitness enthusiasts and coaches connect, collaborate, and grow together.
              </p>
            </motion.div>

            {/* Mission Section */}
            <motion.section 
              className="mb-5"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="row align-items-center">
                <div className="col-lg-6 mb-4 mb-lg-0">
                  <img 
                    src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop&q=80" 
                    alt="Our Mission" 
                    className="img-fluid rounded-4 shadow"
                    style={{ width: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-lg-6">
                  <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem', color: '#333' }}>
                    Our Mission
                  </h2>
                  <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    Our mission is simple: to help people become their most consistent and accountable 
                    selves through the power of technology, connection, and daily action.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* For Fitness Coaches Section */}
            <motion.section 
              className="mb-5 py-5"
              style={{ backgroundColor: '#f8f9fa', borderRadius: '1rem' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6 mb-4 mb-lg-0">
                    <div className="d-flex align-items-center mb-4">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          backgroundColor: '#28a745',
                          color: '#fff'
                        }}
                      >
                        <FaDumbbell size={28} />
                      </div>
                      <h2 className="fw-bold mb-0" style={{ fontSize: '2.5rem', color: '#333' }}>
                        For Fitness Coaches
                      </h2>
                    </div>
                    <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                      Coaches get a smarter way to manage and motivate clients — using AI to track meal 
                      pictures, monitor progress, and ensure every client stays on top of their goals. 
                      No more manual check-ins or endless spreadsheets — just real, visual insights into 
                      your clients' routines.
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <img 
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80" 
                      alt="Fitness Coaches" 
                      className="img-fluid rounded-4 shadow"
                      style={{ width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* For Fitness Enthusiasts Section */}
            <motion.section 
              className="mb-5 py-5"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6 mb-4 mb-lg-0 order-lg-2">
                    <div className="d-flex align-items-center mb-4">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          backgroundColor: '#FF6B35',
                          color: '#fff'
                        }}
                      >
                        <FaUsers size={28} />
                      </div>
                      <h2 className="fw-bold mb-0" style={{ fontSize: '2.5rem', color: '#333' }}>
                        For Fitness Enthusiasts
                      </h2>
                    </div>
                    <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                      Clients get to work closely with their coaches and community by sharing daily meals, 
                      workouts, and progress updates. Every picture, every check-in, every milestone fuels 
                      accountability — and turns consistency into a lifestyle.
                    </p>
                  </div>
                  <div className="col-lg-6 order-lg-1">
                    <img 
                      src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop&q=80" 
                      alt="Fitness Enthusiasts" 
                      className="img-fluid rounded-4 shadow"
                      style={{ width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* The Future of Fitness Section */}
            <motion.section 
              className="mb-5 py-5"
              style={{ backgroundColor: '#f8f9fa', borderRadius: '1rem' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-lg-10 mx-auto text-center">
                    <div className="d-flex align-items-center justify-content-center mb-4">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          backgroundColor: '#28a745',
                          color: '#fff'
                        }}
                      >
                        <FaRocket size={28} />
                      </div>
                      <h2 className="fw-bold mb-0" style={{ fontSize: '2.5rem', color: '#333' }}>
                        The Future of Fitness
                      </h2>
                    </div>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                      We're redefining what fitness tracking means making it social, human, and intelligent. 
                      Here, progress isn't lonely. It's shared, celebrated, and supported.
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                      Join us in building a world where fitness meets accountability, and where every 
                      enthusiast and coach can thrive together.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Key Features Grid */}
            <motion.section 
              className="mb-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="container">
                <h2 className="text-center fw-bold mb-5" style={{ fontSize: '2.5rem', color: '#333' }}>
                  Why Choose Level Grit?
                </h2>
                <div className="row g-4">
                  {[
                    { 
                      icon: FaChartLine, 
                      title: 'AI-Powered Insights', 
                      desc: 'Visual tracking and intelligent analysis of meal pictures and progress' 
                    },
                    { 
                      icon: FaUsers, 
                      title: 'Community Connection', 
                      desc: 'Connect with coaches and fellow enthusiasts in a supportive environment' 
                    },
                    { 
                      icon: FaHeart, 
                      title: 'Daily Accountability', 
                      desc: 'Turn consistency into a lifestyle with daily check-ins and milestones' 
                    }
                  ].map((feature, idx) => (
                    <div key={idx} className="col-md-4">
                      <Animated3DCard delay={idx * 0.1}>
                        <div className="card border-0 shadow-sm h-100 text-center p-4" style={{ borderRadius: '1rem' }}>
                          <feature.icon size={50} className="mb-3" style={{ color: '#28a745' }} />
                          <h4 className="fw-bold mb-3">{feature.title}</h4>
                          <p className="text-muted mb-0">{feature.desc}</p>
                        </div>
                      </Animated3DCard>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
              className="text-center py-5"
              style={{ 
                backgroundColor: '#28a745', 
                color: '#fff',
                borderRadius: '1rem'
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="container">
                <h2 className="fw-bold mb-3">Ready to Start Your Journey?</h2>
                <p className="mb-4" style={{ fontSize: '1.1rem', opacity: 0.95 }}>
                  Join thousands of people who are transforming their lives with Level Grit
                </p>
                <Link 
                  to="/register" 
                  className="btn btn-light btn-lg rounded-pill px-5 py-3"
                  style={{ fontWeight: '600' }}
                >
                  Get Started Today
                </Link>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
