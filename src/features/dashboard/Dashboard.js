import React from "react";

const Dashboard = () => {
  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <p className="text-muted">Overview of your digital invites portal</p>
      </div>

      {/* Total Stats */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Active Users</h5>
              <p className="display-6 fw-bold text-primary">1,234</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Templates</h5>
              <p className="display-6 fw-bold text-success">56</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Invitations</h5>
              <p className="display-6 fw-bold text-warning">8,900</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invitation Trends & Quick Create */}
      <div className="row mb-4">
        {/* Invitation Trends (Chart Placeholder) */}
        <div className="mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Invitation Trends</h5>
              <div className="bg-light border rounded d-flex align-items-center justify-content-center" style={{height: 220}}>
                <span className="text-muted">[Chart Placeholder]</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Most Used Template</h6>
              <div className="d-flex align-items-center">
                <div className="me-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: 48, height: 48}}>
                  <i className="bi bi-star-fill fs-4"></i>
                </div>
                <div>
                  <div className="fw-bold">Elegant Wedding</div>
                  <div className="text-muted small">Used 320 times</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Popular Category</h6>
              <div className="d-flex align-items-center">
                <div className="me-3 bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: 48, height: 48}}>
                  <i className="bi bi-people-fill fs-4"></i>
                </div>
                <div>
                  <div className="fw-bold">Birthday</div>
                  <div className="text-muted small">1,200 invitations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
