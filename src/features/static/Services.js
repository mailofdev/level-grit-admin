import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaDumbbell, FaHeart, FaUsers, FaCheck, FaArrowRight } from 'react-icons/fa';
import Animated3DCard from '../../components/landing/Animated3DCard';
import Heading from '../../components/navigation/Heading';

const Services = () => {
  const navigate = useNavigate();
  
  const trainerServices = [
    {
      title: 'AI-Powered Client Tracking',
      icon: FaDumbbell,
      gradient: 'linear-gradient(135deg, var(--color-primary) 0%, #008066 100%)',
      color: 'var(--color-primary)',
      features: [
        'AI analyzes client meal photos automatically',
        'Real-time macro calculations and progress tracking',
        'Centralized dashboard for all clients',
        'Automated progress reports and insights',
        'Seamless client communication tools'
      ],
      price: 'Free to Start'
    },
    {
      title: 'Smart Meal Plan Management',
      icon: FaStar,
      gradient: 'linear-gradient(135deg, var(--color-primary) 0%, #008066 100%)',
      color: 'var(--color-primary)',
      features: [
        'Create and customize meal plans instantly',
        'Track client adherence in real-time',
        'Adjust plans based on AI insights',
        'Meal plan preview and sharing',
        'Nutrition database integration'
      ],
      price: 'Included'
    }
  ];

  const clientServices = [
    {
      title: '32-Day Fitness Challenge',
      icon: FaUsers,
      gradient: 'linear-gradient(135deg, var(--color-primary) 0%, #008066 100%)',
      color: 'var(--color-primary)',
      features: [
        'Join the transformative 32-day journey',
        'Snap meal photos - AI does the rest',
        'Track progress with visual insights',
        'Share achievements with your trainer',
        'Build lasting healthy habits'
      ],
      price: 'Free with Trainer'
    },
    {
      title: 'Progress Sharing & Accountability',
      icon: FaHeart,
      gradient: 'linear-gradient(135deg, var(--color-primary) 0%, #008066 100%)',
      color: 'var(--color-primary)',
      features: [
        'Share meal photos and progress updates',
        'Real-time feedback from your trainer',
        'Visual progress tracking',
        'Community support and motivation',
        'Direct messaging with your coach'
      ],
      price: 'Included'
    }
  ];

  return (
    <div className="container-fluid px-2 px-md-3" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Heading pageName="Services" showBackButton={true} />
      <div className="d-flex flex-column" style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}>
        <div className="flex-grow-1 overflow-auto pb-3">
          <div className="container py-3 py-md-4">
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="fw-bold mb-3" style={{ color: 'var(--color-text-dark)', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
            Our <span style={{ color: 'var(--color-primary)' }}>Services</span>
          </h1>
          <p className="text-muted mb-4" style={{ maxWidth: '800px', margin: '0 auto', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)' }}>
            AI-powered fitness solutions for Trainers and Clients — making coaching smarter and accountability fun
          </p>
        </motion.div>

        {/* Trainer Services */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="fw-bold mb-4 text-center" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>
            <FaDumbbell className="me-2" />
            For Trainers
          </h2>
          <div className="row g-4 mb-5">
            {trainerServices.map((service, idx) => (
            <div key={idx} className="col-lg-6">
              <Animated3DCard delay={idx * 0.1}>
                <motion.div
                  className="card border-0 shadow-lg h-100"
                  style={{ borderRadius: '1rem', background: service.gradient }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="card-body p-5">
                    <div className="d-flex align-items-center mb-4">
                      <service.icon size={40} className="me-3" style={{ color: service.color }} />
                      <h3 className="fw-bold mb-0" style={{ color: 'var(--color-text-dark)' }}>{service.title}</h3>
                    </div>
                    <ul className="list-unstyled mb-4">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="mb-3 d-flex align-items-start">
                          <FaCheck className="text-success me-2 mt-1" />
                          <span style={{ color: 'var(--color-text-dark)' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-top pt-4 mt-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold" style={{ color: 'var(--color-text-dark)', fontSize: '1.2rem' }}>
                          {service.price}
                        </span>
                        <motion.button
                          className="btn rounded-pill px-4"
                          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)', border: 'none' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/register?type=trainer')}
                        >
                          Get Started <FaArrowRight className="ms-2" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Animated3DCard>
            </div>
          ))}
          </div>
        </motion.div>

        {/* Client Services */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="fw-bold mb-4 text-center" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>
            <FaUsers className="me-2" />
            For Clients
          </h2>
          <div className="row g-4 mb-5">
            {clientServices.map((service, idx) => (
              <div key={idx} className="col-lg-6">
                <Animated3DCard delay={idx * 0.1}>
                  <motion.div
                    className="card border-0 shadow-lg h-100"
                    style={{ borderRadius: '1rem', background: service.gradient }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="card-body p-5">
                      <div className="d-flex align-items-center mb-4">
                        <service.icon size={40} className="me-3" style={{ color: service.color }} />
                        <h3 className="fw-bold mb-0" style={{ color: 'var(--color-text-dark)' }}>{service.title}</h3>
                      </div>
                      <ul className="list-unstyled mb-4">
                        {service.features.map((feature, fIdx) => (
                          <li key={fIdx} className="mb-3 d-flex align-items-start">
                            <FaCheck className="text-success me-2 mt-1" />
                            <span style={{ color: 'var(--color-text-dark)' }}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-top pt-4 mt-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold" style={{ color: 'var(--color-text-dark)', fontSize: '1.2rem' }}>
                          {service.price}
                        </span>
                          <motion.button
                            className="btn rounded-pill px-4"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)', border: 'none' }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login?type=client')}
                          >
                            Join Now <FaArrowRight className="ms-2" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Animated3DCard>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.section 
          className="py-5"
          style={{ backgroundColor: 'var(--color-card-bg-alt)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <h2 className="text-center fw-bold mb-5" style={{ fontSize: '2.5rem', color: 'var(--color-text-dark)' }}>
              Why Choose LevelGrit?
            </h2>
            <div className="row g-4">
              {[
                { title: 'AI-Powered Tracking', desc: 'Automated meal photo analysis and macro calculations for trainers and clients' },
                { title: 'Real-Time Progress', desc: 'Instant updates and insights on your dashboard - no manual tracking needed' },
                { title: '32-Day Challenge', desc: 'Proven program that helps clients build lasting healthy habits' },
                { title: 'Seamless Communication', desc: 'Direct messaging between trainers and clients built into the platform' },
                { title: 'PWA Technology', desc: 'No app download needed - access everything through your browser, works offline' },
                { title: 'Free to Start', desc: 'Trainers can start coaching smarter for free - no upfront costs' }
              ].map((benefit, idx) => (
                <motion.div 
                  key={idx}
                  className="col-md-6 col-lg-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="card border-0 shadow-sm h-100 p-4 text-center" style={{ borderRadius: '1rem' }}>
                    <h5 className="fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>{benefit.title}</h5>
                    <p className="text-muted mb-0">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section 
          className="text-center py-5 mt-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="fw-bold mb-3" style={{ fontSize: '2rem', color: 'var(--color-text-dark)' }}>
            Ready to Transform Your Fitness Journey?
          </h3>
          <p className="text-muted mb-4">Whether you're a Trainer or Client, we have the perfect solution for you</p>
          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
            <Link to="/register?type=trainer" className="btn btn-lg rounded-pill px-5 py-3" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)', border: 'none' }}>
              <FaDumbbell className="me-2" />
              For Trainers
            </Link>
            <Link to="/login?type=client" className="btn btn-lg rounded-pill px-5 py-3" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)', border: 'none' }}>
              <FaUsers className="me-2" />
              For Clients
            </Link>
          </div>
        </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

