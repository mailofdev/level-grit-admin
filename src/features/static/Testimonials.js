import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import Animated3DCard from '../../components/landing/Animated3DCard';
import Heading from '../../components/navigation/Heading';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rupali Arora',
      role: 'Weight Loss Success',
      quote: 'LevelGrit transformed my lifestyle completely. I lost 25kg in 8 months with the guidance of my amazing coach. The personalized meal plans and workout routines were perfect for my busy schedule. I never thought I could achieve this, but LevelGrit made it possible!',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80'
    },
    {
      name: 'Sanjana Sharma',
      role: 'Muscle Gain Achievement',
      quote: 'My coach is absolutely incredible! The support and guidance I received was unmatched. I gained 12kg of lean muscle mass in just 6 months. The progress tracking feature helped me stay motivated throughout my journey.',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&q=80'
    },
    {
      name: 'Mohit Kumar',
      role: 'Fitness Transformation',
      quote: 'The best investment I\'ve made in my health. The app makes it so easy to stay on track with meal logging and workout reminders. My coach was always available to answer questions and adjust my plan when needed.',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop&q=80'
    },
    {
      name: 'Priya Patel',
      role: 'Diabetes Management',
      quote: 'As someone managing diabetes, I was skeptical about online coaching. But LevelGrit proved me wrong. My coach worked with my doctor to create a plan that helped me lose weight and improve my blood sugar levels significantly.',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80'
    },
    {
      name: 'Rajesh Singh',
      role: 'Post-Injury Recovery',
      quote: 'After my knee injury, I thought my fitness journey was over. But my LevelGrit coach designed a rehabilitation program that got me back to running in just 4 months. The injury rehabilitation service is top-notch!',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=300&fit=crop&q=80'
    },
    {
      name: 'Anjali Verma',
      role: 'Pregnancy Fitness',
      quote: 'LevelGrit helped me stay active and healthy during my pregnancy. My coach modified my workouts throughout all three trimesters, and I felt stronger and more energetic than ever. Highly recommend for expecting mothers!',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&q=80',
      beforeAfter: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop&q=80'
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
            Client <span style={{ color: '#4CAF50' }}>Testimonials</span>
          </h1>
          <p className="lead text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Hear what our clients have to say about their transformation journey with LevelGrit
          </p>
        </motion.div>

        <div className="row g-4 mb-5">
            {testimonials.map((testimonial, idx) => (
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
          style={{ backgroundColor: '#4CAF50', color: '#fff', borderRadius: '1rem' }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <h2 className="fw-bold mb-3">Ready to Write Your Success Story?</h2>
            <p className="mb-4" style={{ fontSize: '1.1rem' }}>
              Join thousands of clients who have transformed their lives with LevelGrit
            </p>
            <Link to="/register" className="btn btn-light btn-lg rounded-pill px-5 py-3">
              Start Your Journey Today
            </Link>
          </div>
        </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

