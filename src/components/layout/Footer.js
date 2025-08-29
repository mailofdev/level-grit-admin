import React from 'react';

const Footer = () => (
  <footer className="footer mt-auto py-3 bg-light text-center fixed-bottom">
    <div className="container">
      <span className="">&copy; {new Date().getFullYear()} MyApp. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer; 