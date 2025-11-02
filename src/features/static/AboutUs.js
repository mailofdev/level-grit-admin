import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaHeart, FaRocket, FaCheckCircle, FaAward } from 'react-icons/fa';
import Animated3DCard from '../../components/landing/Animated3DCard';
import Heading from '../../components/navigation/Heading';
import logo3 from '../../assets/images/logo3.jpeg';

const AboutUs = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="container-fluid px-2 px-md-3" style={{ backgroundColor: '#ffffff' }}>
      <Heading pageName="About Us" showBackButton={true} />
      <div className="d-flex flex-column" style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}>
        <div className="flex-grow-1 overflow-auto pb-3">
          <div className="container py-5">
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={logo3} alt="LevelGrit" style={{ height: '80px', marginBottom: '20px', borderRadius: '12px' }} />
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#333' }}>
            About <span style={{ color: '#4CAF50' }}>LevelGrit</span>
          </h1>
          <p className="lead text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            We're on a mission to help people live their best lives through personalized fitness 
            and nutrition coaching, cutting-edge technology, and unwavering support.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section 
          className="mb-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop&q=80" 
                alt="Our Mission" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem', color: '#333' }}>Our Mission</h2>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                At LevelGrit, we believe that everyone deserves to live their best life. Our mission 
                is to make personalized fitness and nutrition coaching accessible to everyone, regardless 
                of where they are in their journey.
              </p>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                We combine expert guidance from certified trainers and nutritionists with cutting-edge 
                technology to create a comprehensive platform that helps people achieve their health 
                and fitness goals sustainably.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section 
          className="mb-5 py-5"
          style={{ backgroundColor: '#f8f9fa' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <h2 className="text-center fw-bold mb-5" style={{ fontSize: '2.5rem', color: '#333' }}>
              Our Values
            </h2>
            <div className="row g-4">
              {[
                { icon: FaHeart, title: 'Compassion', desc: 'We care deeply about every individual\'s journey and celebrate every milestone, no matter how small.' },
                { icon: FaAward, title: 'Excellence', desc: 'We strive for excellence in everything we do, from our coaching to our platform technology.' },
                { icon: FaUsers, title: 'Inclusivity', desc: 'We believe fitness is for everyone and welcome people of all backgrounds and fitness levels.' },
                { icon: FaRocket, title: 'Innovation', desc: 'We continuously innovate to provide the best tools and methods for our community.' },
                { icon: FaCheckCircle, title: 'Integrity', desc: 'We operate with transparency, honesty, and a commitment to doing what\'s right.' },
                { icon: FaAward, title: 'Quality', desc: 'We maintain the highest standards in our coaching, services, and customer support.' }
               ].map((value, idx) => (
                 <div key={idx} className="col-md-6 col-lg-4">
                   <Animated3DCard delay={idx * 0.1}>
                     <div className="card border-0 shadow-sm h-100 text-center p-4" style={{ borderRadius: '1rem' }}>
                       <value.icon size={50} className="mb-3" style={{ color: '#4CAF50' }} />
                       <h4 className="fw-bold mb-3">{value.title}</h4>
                       <p className="text-muted mb-0">{value.desc}</p>
                     </div>
                   </Animated3DCard>
                 </div>
               ))}
            </div>
          </div>
        </motion.section>

        {/* Story Section */}
        <motion.section 
          className="mb-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem', color: '#333' }}>Our Story</h2>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                LevelGrit was founded with a simple yet powerful vision: to make world-class fitness 
                and nutrition coaching accessible to everyone. We noticed that traditional fitness 
                programs were often expensive, inflexible, and didn't provide the personalized 
                support people needed to succeed long-term.
              </p>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Our platform bridges the gap between professional coaching expertise and 
                modern convenience. Through our Progressive Web App, users can access personalized 
                plans, track progress, and communicate with their coaches anytime, anywhere.
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="text-center py-5"
          style={{ backgroundColor: '#4CAF50', color: '#fff' }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <h2 className="fw-bold mb-3">Ready to Start Your Journey?</h2>
            <p className="mb-4" style={{ fontSize: '1.1rem' }}>
              Join thousands of people who are transforming their lives with LevelGrit
            </p>
            <Link to="/register" className="btn btn-light btn-lg rounded-pill px-5 py-3">
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

