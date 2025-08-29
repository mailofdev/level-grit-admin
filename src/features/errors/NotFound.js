import React from "react";

const NotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center text-center" style={{ minHeight: "80vh" }}>
      <div>
        <h1>😕</h1>
        <h3>Oops! Page Not Found</h3>
        <p className="">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
};

export default NotFound;
