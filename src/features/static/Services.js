import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaDumbbell, FaHeart, FaUsers, FaCheck, FaArrowRight } from 'react-icons/fa';
import Animated3DCard from '../../components/landing/Animated3DCard';
import Heading from '../../components/navigation/Heading';

const Services = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      title: 'Fitness and Nutrition Coaching',
      icon: FaStar,
      gradient: 'linear-gradient(135deg, #FFE5B4 0%, #FFCC99 100%)',
      color: '#FF9800',
      features: [
        'Personalized meal plans tailored to your goals',
        'Custom workout routines designed for your fitness level',
        'Regular progress reviews and plan adjustments',
        'Macro and calorie tracking guidance',
        '24/7 access to your coach through our platform'
      ],
      price: 'Starting at $99/month'
    },
    {
      title: 'Online Personal Training',
      icon: FaDumbbell,
      gradient: 'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)',
      color: '#4CAF50',
      features: [
        'Live workout sessions via video calls',
        'Real-time form correction and feedback',
        'Flexible scheduling to fit your life',
        'Equipment-free and gym-based options',
        'Progressive training programs'
      ],
      price: 'Starting at $149/month'
    },
    {
      title: 'Injury Rehabilitation',
      icon: FaHeart,
      gradient: 'linear-gradient(135deg, #FFCDD2 0%, #FFB3BA 100%)',
      color: '#E91E63',
      features: [
        'Recovery-focused exercise plans',
        'Physiotherapy-guided rehabilitation',
        'Safe return-to-activity protocols',
        'Pain management strategies',
        'Collaboration with healthcare providers'
      ],
      price: 'Starting at $129/month'
    },
    {
      title: 'LevelGrit Kids',
      icon: FaUsers,
      gradient: 'linear-gradient(135deg, #E1BEE7 0%, #CE93D8 100%)',
      color: '#9C27B0',
      features: [
        'Age-appropriate fitness programs',
        'Fun and engaging activities',
        'Healthy habit building from an early age',
        'Nutrition education for kids and parents',
        'Safe and supervised workouts'
      ],
      price: 'Starting at $79/month'
    }
  ];

  return (
    <div className="container-fluid px-2 px-md-3" style={{ backgroundColor: '#ffffff' }}>
      <Heading pageName="Services" showBackButton={true} />
      <div className="d-flex flex-column" style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}>
        <div className="flex-grow-1 overflow-auto pb-3">
          <div className="container py-5">
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#333' }}>
            Our <span style={{ color: '#4CAF50' }}>Services</span>
          </h1>
          <p className="lead text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Comprehensive fitness and nutrition solutions tailored to your unique needs and goals
          </p>
        </motion.div>

        <div className="row g-4 mb-5">
          {services.map((service, idx) => (
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
                      <h3 className="fw-bold mb-0" style={{ color: '#333' }}>{service.title}</h3>
                    </div>
                    <ul className="list-unstyled mb-4">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="mb-3 d-flex align-items-start">
                          <FaCheck className="text-success me-2 mt-1" />
                          <span style={{ color: '#333' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-top pt-4 mt-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold" style={{ color: '#333', fontSize: '1.2rem' }}>
                          {service.price}
                        </span>
                        <motion.button
                          className="btn btn-dark rounded-pill px-4"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/register')}
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

        {/* Why Choose Us */}
        <motion.section 
          className="py-5"
          style={{ backgroundColor: '#f8f9fa' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <h2 className="text-center fw-bold mb-5" style={{ fontSize: '2.5rem', color: '#333' }}>
              Why Choose LevelGrit?
            </h2>
            <div className="row g-4">
              {[
                { title: 'Expert Coaches', desc: 'All our coaches are certified professionals with years of experience' },
                { title: 'Proven Results', desc: 'Thousands of success stories from clients who achieved their goals' },
                { title: 'Flexible Plans', desc: 'Customizable programs that adapt to your lifestyle and schedule' },
                { title: '24/7 Support', desc: 'Round-the-clock access to your coach and platform resources' },
                { title: 'PWA Technology', desc: 'No app download needed - access everything through your browser' },
                { title: 'Affordable Pricing', desc: 'Premium coaching at prices that work for everyone' }
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
                    <h5 className="fw-bold mb-3" style={{ color: '#4CAF50' }}>{benefit.title}</h5>
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
          <h3 className="fw-bold mb-3" style={{ fontSize: '2rem', color: '#333' }}>
            Ready to Transform Your Life?
          </h3>
          <p className="text-muted mb-4">Choose the service that's right for you and get started today</p>
          <Link to="/register" className="btn btn-lg rounded-pill px-5 py-3" style={{ backgroundColor: '#4CAF50', color: '#fff' }}>
            Start Your Journey
          </Link>
        </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

