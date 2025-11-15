import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaDumbbell, FaUsers } from 'react-icons/fa';
import Animated3DCard from '../../components/landing/Animated3DCard';
import Heading from '../../components/navigation/Heading';

const Testimonials = () => {
  const clientTestimonials = [
    {
      name: 'Rupali Arora',
      role: '32-Day Challenge Success',
      quote: 'The 32-Day Challenge changed everything! I lost 8kg and built habits that stuck. Snapping meal photos was so easy, and my trainer could see my progress in real-time. The AI analysis made tracking effortless!',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80',
      type: 'client'
    },
    {
      name: 'Sanjana Sharma',
      role: 'Meal Tracking Enthusiast',
      quote: 'I love how simple it is! Just snap a photo of my meal and the AI does all the work. My trainer can see everything instantly and gives me feedback right away. It\'s like having a coach in my pocket!',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&q=80',
      type: 'client'
    },
    {
      name: 'Mohit Kumar',
      role: 'Progress Tracker',
      quote: 'The visual progress tracking is amazing! I can see my transformation over time, and sharing it with my trainer keeps me accountable. The 32-Day Challenge structure made it so easy to stay consistent.',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop&q=80',
      type: 'client'
    }
  ];

  const trainerTestimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Fitness Coach',
      quote: 'LevelGrit transformed how I manage clients! No more WhatsApp check-ins or manual tracking. The AI analyzes meal photos automatically, and I get real-time insights on my dashboard. I can now handle 3x more clients efficiently!',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=300&fit=crop&q=80',
      type: 'trainer'
    },
    {
      name: 'Priya Sharma',
      role: 'Nutrition Coach',
      quote: 'The AI meal photo analysis is a game-changer! Clients just snap photos, and I instantly see their macros and progress. The automated tracking saves me hours every week, and clients love how easy it is.',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80',
      type: 'trainer'
    },
    {
      name: 'Amit Patel',
      role: 'Personal Trainer',
      quote: 'Best coaching platform I\'ve used! The centralized dashboard shows all my clients\' progress at a glance. Meal plan management is seamless, and the communication tools keep everything organized. Highly recommend!',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop&q=80',
      type: 'trainer'
    }
  ];

  return (
    <div className="container-fluid px-2 px-md-3" style={{ backgroundColor: '#ffffff' }}>
      <Heading pageName="Testimonials" showBackButton={true} />
      <div className="d-flex flex-column" style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}>
        <div className="flex-grow-1 overflow-auto pb-3">
          <div className="container py-5">
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#333' }}>
            Success <span style={{ color: '#667eea' }}>Stories</span>
          </h1>
          <p className="lead text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Hear from Trainers and Clients about how LevelGrit is transforming fitness coaching and accountability
          </p>
        </motion.div>

        {/* Client Testimonials */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="fw-bold mb-4 text-center" style={{ fontSize: '2rem', color: '#43e97b' }}>
            Client Success Stories
          </h2>
          <div className="row g-4 mb-5">
            {clientTestimonials.map((testimonial, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <Animated3DCard delay={idx * 0.1}>
                <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                  <div className="position-relative">
                    <img 
                      src={testimonial.img} 
                      alt={testimonial.name} 
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                    />
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{ 
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '20px'
                      }}
                    >
                      <div>
                        <h5 className="text-white fw-bold mb-1">{testimonial.name}</h5>
                        <small className="text-white-50">{testimonial.role}</small>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="text-warning" size={16} />
                      ))}
                    </div>
                    <FaQuoteLeft className="text-muted mb-2" size={24} />
                    <p className="text-muted mb-0" style={{ lineHeight: '1.6', fontStyle: 'italic' }}>
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-0 p-4 pt-0">
                    <img 
                      src={testimonial.beforeAfter} 
                      alt="Transformation" 
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    />
                    <small className="text-muted d-block text-center mt-2">Transformation Journey</small>
                  </div>
                  </div>
                </Animated3DCard>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trainer Testimonials */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="fw-bold mb-4 text-center" style={{ fontSize: '2rem', color: '#667eea' }}>
            Trainer Success Stories
          </h2>
          <div className="row g-4 mb-5">
            {trainerTestimonials.map((testimonial, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <Animated3DCard delay={idx * 0.1}>
                <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                  <div className="position-relative">
                    <img 
                      src={testimonial.img} 
                      alt={testimonial.name} 
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                    />
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{ 
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '20px'
                      }}
                    >
                      <div>
                        <h5 className="text-white fw-bold mb-1">{testimonial.name}</h5>
                        <small className="text-white-50">{testimonial.role}</small>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="text-warning" size={16} />
                      ))}
                    </div>
                    <FaQuoteLeft className="text-muted mb-2" size={24} />
                    <p className="text-muted mb-0" style={{ lineHeight: '1.6', fontStyle: 'italic' }}>
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-0 p-4 pt-0">
                    <img 
                      src={testimonial.beforeAfter} 
                      alt="Success Story" 
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    />
                    <small className="text-muted d-block text-center mt-2">Platform Impact</small>
                  </div>
                  </div>
                </Animated3DCard>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.section 
          className="py-5 mb-5"
          style={{ backgroundColor: '#f8f9fa' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container text-center">
            <h2 className="fw-bold mb-5" style={{ fontSize: '2.5rem', color: '#333' }}>
              Results That Speak for Themselves
            </h2>
            <div className="row g-4">
              {[
                { number: '10,000+', label: 'Happy Clients' },
                { number: '95%', label: 'Success Rate' },
                { number: '4.7/5', label: 'Average Rating' },
                { number: '50kg+', label: 'Total Weight Lost' }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  className="col-6 col-md-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="p-4">
                    <h2 className="fw-bold mb-2" style={{ color: '#4CAF50', fontSize: '3rem' }}>
                      {stat.number}
                    </h2>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section 
          className="text-center py-5"
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #43e97b 100%)', 
            color: '#fff', 
            borderRadius: '1rem' 
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <h2 className="fw-bold mb-3">Ready to Write Your Success Story?</h2>
            <p className="mb-4" style={{ fontSize: '1.1rem', opacity: 0.95 }}>
              Join thousands of Trainers and Clients transforming fitness through AI-powered coaching
            </p>
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <Link 
                to="/register" 
                className="btn btn-light btn-lg rounded-pill px-5 py-3"
                style={{ fontWeight: '600', backgroundColor: '#fff', color: '#667eea', border: 'none' }}
              >
                <FaDumbbell className="me-2" />
                For Trainers
              </Link>
              <Link 
                to="/login?type=client" 
                className="btn btn-light btn-lg rounded-pill px-5 py-3"
                style={{ fontWeight: '600', backgroundColor: '#fff', color: '#43e97b', border: 'none' }}
              >
                <FaUsers className="me-2" />
                For Clients
              </Link>
            </div>
          </div>
        </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

