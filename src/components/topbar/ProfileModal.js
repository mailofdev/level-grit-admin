import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaVenusMars,
  FaUserTag,
  FaDumbbell,
} from "react-icons/fa";
import getRoleIcon from "../common/CommonFunctions";

const ProfileModal = ({ show, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateClick = () => {
    if (isEditing) {
      console.log("Submitting updated data:", formData); 
      // ✅ TODO: Call updateUserProfile(formData)
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setShowDeleteAlert(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    console.log("Delete Account API will be called here");
    // ✅ TODO: Call deleteAccount(user.id)
    setShowDeleteAlert(false);
  };

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      style={{
        display: "block",
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0 shadow-lg overflow-hidden"
          style={{
            borderRadius: "1rem",
            background: "#f7f8f8",
          }}
        >
          {/* Header */}
          <div
            className="modal-header text-white border-0"
            style={{
              background:
                "linear-gradient(135deg, #36d198 0%, #07976a 100%)",
            }}
          >
            <h5 className="modal-title fw-bold d-flex align-items-center">
              <FaDumbbell className="me-2 fs-4" />
              {user?.fullName?.split(" ")[0]}'s Profile
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Profile Avatar Section */}
          <div
            className="text-center py-4 position-relative"
            style={{
              background: "linear-gradient(90deg, #36d198, #07976a)",
              color: "#fff",
            }}
          >
            <div
              className="rounded-circle mx-auto shadow d-flex align-items-center justify-content-center"
              style={{
                width: "110px",
                height: "110px",
                background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.4)",
                fontSize: "48px",
              }}
            >
              <FaUser />
            </div>
            <h4 className="mt-3 mb-1 fw-bold text-uppercase">
              {user?.fullName}
            </h4>
            <span
              className="badge"
              style={{
                background: "rgba(255,255,255,0.25)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                padding: "0.5rem 1rem",
                fontSize: "0.9rem",
              }}
            >
              {getRoleIcon(user?.role, "emoji")} {user?.role}
            </span>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {showDeleteAlert ? (
              <div className="text-center py-5">
                <h5 className="text-danger fw-bold">
                  ⚠️ Warning: Account Deletion
                </h5>
                <p className="text-muted">
                  If you delete your account, <strong>all your data</strong> will
                  be permanently removed. This action cannot be undone.
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button
                    className="btn btn-outline-secondary px-4"
                    onClick={() => setShowDeleteAlert(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger px-4 fw-semibold"
                    onClick={handleDeleteConfirm}
                  >
                    Yes, Delete Anyway
                  </button>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {/* Email */}
                <div className="col-md-6">
                  <div className="shadow-sm rounded p-3 bg-white d-flex align-items-center border">
                    <FaEnvelope className="text-primary me-3 fs-5" />
                    <div className="w-100">
                      <small className="text-muted">Email</small>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleChange}
                          className="form-control form-control-sm mt-1"
                        />
                      ) : (
                        <p className="mb-0 fw-semibold text-dark">
                          {formData.email || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <div className="shadow-sm rounded p-3 bg-white d-flex align-items-center border">
                    <FaPhone className="text-primary me-3 fs-5" />
                    <div className="w-100">
                      <small className="text-muted">Phone</small>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber || ""}
                          onChange={handleChange}
                          className="form-control form-control-sm mt-1"
                        />
                      ) : (
                        <p className="mb-0 fw-semibold text-dark">
                          {formData.phoneNumber || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="col-md-6">
                  <div className="shadow-sm rounded p-3 bg-white d-flex align-items-center border">
                    <FaVenusMars className="text-primary me-3 fs-5" />
                    <div className="w-100">
                      <small className="text-muted">Gender</small>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={formData.gender || ""}
                          onChange={handleChange}
                          className="form-select form-select-sm mt-1"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="mb-0 fw-semibold text-capitalize text-dark">
                          {formData.gender || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div className="col-md-6">
                  <div className="shadow-sm rounded p-3 bg-white d-flex align-items-center border">
                    <FaUserTag className="text-primary me-3 fs-5" />
                    <div>
                      <small className="text-muted">Role</small>
                      <p className="mb-0 fw-semibold text-dark">{user?.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!showDeleteAlert && (
            <div
              className="modal-footer border-0 py-3 d-flex justify-content-between"
              style={{ backgroundColor: "#f1fcf8" }}
            >
              <button
                className="btn btn-outline-danger fw-semibold px-4"
                onClick={handleDeleteClick}
              >
                Delete My Account
              </button>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-secondary fw-semibold px-4"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  className={`btn ${
                    isEditing ? "btn-success" : "btn-primary"
                  } fw-semibold px-4`}
                  style={{
                    backgroundColor: isEditing ? "#11b981" : "#3a83f6",
                    borderColor: isEditing ? "#11b981" : "#3a83f6",
                  }}
                  onClick={handleUpdateClick}
                >
                  {isEditing ? "Submit" : "Update Profile"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
