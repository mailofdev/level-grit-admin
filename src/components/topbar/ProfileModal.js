import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaVenusMars,
  FaUserTag,
  FaDumbbell,
  FaBirthdayCake,
  FaWeight,
} from "react-icons/fa";
import { Form, Spinner, Alert } from "react-bootstrap";
import getRoleIcon from "../common/CommonFunctions";
import { GetProfileData, UpdateProfileData } from "../../api/authAPI";
import { deleteTrainerThunk } from "../../features/trainer/trainerThunks";
import { logout } from "../../features/auth/authSlice";

const ProfileModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch profile
  useEffect(() => {
    if (!show) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await GetProfileData();
        setUser(data);

        const fields = {
          fullName: data.fullName || "",
          gender: data.gender || "",
          phoneNumber: data.phoneNumber || "",
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().split("T")[0]
            : "",
          height: data.height || "",
          weight: data.weight || "",
          targetWeight: data.targetWeight || "",
          goal: data.goal !== undefined ? data.goal : "",
        };

        setFormData(fields);
        setInitialData(fields);
      } catch (err) {
        // Error fetching profile
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [show]);

  if (!show) return null;

  if (loading) return (
    <div className="text-center p-5">
      <Spinner animation="border" variant="success" /> Loading profile...
    </div>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      ["height", "weight", "targetWeight", "goal"].includes(name)
        ? value === "" ? "" : Number(value)
        : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleUpdateClick = async () => {
    if (isEditing) {
      try {
        setUpdating(true);

        // Only send fields that changed
        const updatedFields = {};
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== initialData[key]) {
            updatedFields[key] = formData[key];
          }
        });

        // Convert dateOfBirth to ISO string if updated
        if (updatedFields.dateOfBirth) {
          const dob = new Date(updatedFields.dateOfBirth);
          updatedFields.dateOfBirth = dob.toISOString();
        }

        if (Object.keys(updatedFields).length > 0) {
          const updated = await UpdateProfileData(updatedFields);
          setUser({ ...user, ...updated });
          setInitialData({ ...initialData, ...updatedFields });
          setFormData({ ...formData, ...updatedFields });
        }

        setIsEditing(false);
      } catch (err) {
        // Error updating profile
      } finally {
        setUpdating(false);
      }
    } else {
      setIsEditing(true);
      setShowDeleteAlert(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);
      
      // Get userId from user object (try multiple possible field names)
      const userId = user?.userId || user?.id || user?._id;
      
      if (!userId) {
        setDeleteError("User ID not found. Please try logging out and logging back in.");
        setDeleting(false);
        return;
      }
      
      // Call delete trainer API with userId
      await dispatch(deleteTrainerThunk(userId)).unwrap();
      
      // On successful deletion, logout and redirect
      dispatch(logout());
      // Clear session from both storages
      sessionStorage.removeItem("auth_data");
      localStorage.removeItem("auth_data");
      localStorage.removeItem("auth_timestamp");
      window.location.href = "/";
    } catch (error) {
      // Handle error
      setDeleteError(error || "Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div
      className="modal fade show d-block glass-effect position-fixed top-0 start-0 end-0 bottom-0"
      tabIndex="-1"
      style={{ 
        background: "rgba(0,0,0,0.75)", 
        zIndex: 1055
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "600px", width: "95%" }}>
        <div className="modal-content border-0 shadow-lg d-flex flex-column rounded-3 bg-light" style={{ maxHeight: "90vh" }}>
          {/* Header - Compact */}
          <div className="modal-header text-white border-0 flex-shrink-0 gradient-primary py-2 px-3">
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="d-flex align-items-center gap-2">
                <FaDumbbell className="fs-5" />
                <h5 className="modal-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                  {user.fullName?.split(" ")[0]}'s Profile
                </h5>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge px-2 py-1 text-white" style={{ 
                  background: "rgba(255,255,255,0.25)", 
                  border: "1px solid rgba(255,255,255,0.3)", 
                  fontSize: "0.75rem" 
                }}>
                  {getRoleIcon(user.role, "emoji")} {user.role}
                </span>
                <button type="button" className="btn-close btn-close-white" onClick={onClose} style={{ fontSize: "0.75rem" }}></button>
              </div>
            </div>
          </div>

          {/* Body - Scrollable */}
          <div className="modal-body p-3 overflow-auto flex-grow-1" style={{ maxHeight: "calc(90vh - 140px)" }}>
            {showDeleteAlert ? (
              <div className="text-center py-4">
                <h5 className="text-danger fw-bold mb-3" style={{ fontSize: "1.1rem" }}>⚠️ Warning: Account Deletion</h5>
                <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                  If you delete your account, <strong>all your data</strong> will be permanently removed.
                </p>
                
                {deleteError && (
                  <Alert variant="danger" className="mt-3 mb-3" style={{ fontSize: "0.85rem" }}>
                    {deleteError}
                  </Alert>
                )}
                
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
                  <button 
                    className="btn btn-outline-secondary px-3 touch-target" 
                    style={{ fontSize: "0.875rem" }}
                    onClick={() => {
                      setShowDeleteAlert(false);
                      setDeleteError(null);
                    }}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-danger px-3 fw-semibold d-flex align-items-center justify-content-center gap-2 touch-target" 
                    style={{ fontSize: "0.875rem" }}
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete Anyway"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="row g-2">
                {/* Full Name */}
                <ProfileField icon={FaUser} label="Full Name" name="fullName" value={formData.fullName} isEditing={isEditing} onChange={handleChange} />
                {/* Email */}
                <ProfileField icon={FaEnvelope} label="Email" name="email" value={user.email} isEditing={false} disabled />
                {/* Phone */}
                <ProfileField icon={FaPhone} label="Phone" name="phoneNumber" value={formData.phoneNumber} isEditing={isEditing} onChange={handleChange} type="text" />
                {/* Gender */}
                <ProfileField icon={FaVenusMars} label="Gender" name="gender" value={formData.gender} isEditing={isEditing} onChange={handleChange} type="select" options={["male","female","other"]} />
                {/* Role */}
                <ProfileField icon={FaUserTag} label="Role" name="role" value={user.role} isEditing={false} disabled />
                {/* Date of Birth */}
                <ProfileField icon={FaBirthdayCake} label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} isEditing={isEditing} onChange={handleChange} type="date" />
                {/* Height */}
                <ProfileField icon={FaWeight} label="Height (cm)" name="height" value={formData.height} isEditing={isEditing} onChange={handleChange} type="number" />
                {/* Weight */}
                <ProfileField icon={FaWeight} label="Weight (kg)" name="weight" value={formData.weight} isEditing={isEditing} onChange={handleChange} type="number" />
                {/* Target Weight */}
                <ProfileField icon={FaDumbbell} label="Target Weight (kg)" name="targetWeight" value={formData.targetWeight} isEditing={isEditing} onChange={handleChange} type="number" />
                {/* Goal */}
                <div className="col-12 col-md-6">
                  <div className="shadow-sm rounded py-2 px-2 bg-white d-flex align-items-center border">
                    <FaDumbbell className="text-primary me-2" style={{ fontSize: "1rem", flexShrink: 0 }} />
                    <div className="w-100">
                      <small className="text-muted" style={{ fontSize: "0.75rem" }}>Goal</small>
                      {isEditing ? (
                        <Form.Select
                          name="goal"
                          value={formData.goal}
                          onChange={handleChange}
                          className="mt-1"
                          style={{ fontSize: "0.875rem", padding: "0.25rem 0.5rem" }}
                        >
                          <option value="">Select fitness goal</option>
                          <option value={0}>Muscle Gain</option>
                          <option value={1}>Fat Loss</option>
                        </Form.Select>
                      ) : (
                        <p className="mb-0 fw-semibold text-dark" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                          {formData.goal === 0 ? "Muscle Gain" : formData.goal === 1 ? "Fat Loss" : "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Compact */}
          {!showDeleteAlert && (
            <div className="modal-footer border-0 flex-shrink-0 py-2 px-3" style={{ 
              backgroundColor: "#f1fcf8",
              flexWrap: "wrap",
              gap: "0.5rem"
            }}>
              <button 
                className="btn btn-outline-danger fw-semibold px-3" 
                style={{ minHeight: "38px", fontSize: "0.875rem" }}
                onClick={handleDeleteClick}
              >
                Delete Account
              </button>
              <div className="d-flex gap-2 ms-auto">
                <button 
                  className="btn btn-outline-secondary fw-semibold px-3" 
                  style={{ minHeight: "38px", fontSize: "0.875rem" }}
                  onClick={onClose}
                >
                  Close
                </button>
                <button 
                  className={`btn fw-semibold px-3`} 
                  style={{ 
                    backgroundColor: isEditing ? "#11b981" : "#3a83f6", 
                    borderColor: isEditing ? "#11b981" : "#3a83f6",
                    color: "#fff",
                    minHeight: "38px", 
                    fontSize: "0.875rem" 
                  }} 
                  onClick={handleUpdateClick} 
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" /> Updating...
                    </>
                  ) : (
                    isEditing ? "Submit" : "Update"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ProfileField component - Compact version
const ProfileField = ({ icon: Icon, label, name, value, isEditing, onChange, type = "text", options = [], disabled = false }) => (
  <div className="col-12 col-md-6">
    <div className="shadow-sm rounded px-2 bg-white d-flex align-items-center border" style={{ minHeight: "48px", paddingTop: "0.375rem", paddingBottom: "0.375rem" }}>
      <Icon className="text-primary me-2" style={{ fontSize: "0.9rem", flexShrink: 0 }} />
      <div className="w-100" style={{ minWidth: 0 }}>
        <small className="text-muted d-block" style={{ fontSize: "0.7rem", lineHeight: "1.2", marginBottom: "0.125rem" }}>{label}</small>
        {isEditing && !disabled ? (
          type === "select" ? (
            <select 
              name={name} 
              value={value || ""} 
              onChange={onChange} 
              className="form-select form-select-sm"
              style={{ fontSize: "0.875rem", padding: "0.25rem 0.5rem", marginTop: "0.125rem" }}
            >
              <option value="">Select</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={value || ""}
              onChange={onChange}
              className="form-control form-control-sm"
              style={{ fontSize: "0.875rem", padding: "0.25rem 0.5rem", marginTop: "0.125rem" }}
            />
          )
        ) : (
          <p className="mb-0 fw-semibold text-dark" style={{ fontSize: "0.875rem", marginTop: "0.125rem", wordBreak: "break-word" }}>
            {value || "Not specified"}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default ProfileModal;
