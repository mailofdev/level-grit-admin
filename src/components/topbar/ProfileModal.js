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
      
      // TODO: Implement client account deletion API call when backend is ready
      // For now, show error message
      setDeleteError("Account deletion is not available yet. Please contact support.");
      setDeleting(false);
      
      // On successful deletion, logout and redirect
      // dispatch(logout());
      // window.location.href = "/";
    } catch (error) {
      // Handle error
      setDeleteError(error || "Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      style={{ 
        display: "block", 
        background: "rgba(0,0,0,0.75)", 
        backdropFilter: "blur(6px)",
        zIndex: 1055,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg overflow-hidden" style={{ borderRadius: "1rem", background: "#f7f8f8" }}>
          {/* Header */}
          <div className="modal-header text-white border-0" style={{ background: "linear-gradient(135deg, #36d198 0%, #07976a 100%)" }}>
            <h5 className="modal-title fw-bold d-flex align-items-center">
              <FaDumbbell className="me-2 fs-4" /> {user.fullName?.split(" ")[0]}'s Profile
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Avatar */}
          <div className="text-center py-2 position-relative" style={{ background: "linear-gradient(90deg, #36d198, #07976a)", color: "#fff" }}>
            {/* <div className="rounded-circle mx-auto shadow d-flex align-items-center justify-content-center" style={{ width: "110px", height: "110px", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)", fontSize: "48px" }}>
              <FaUser />
            </div> */}
            <h4 className="mt-3 mb-1 fw-bold text-uppercase">{user.fullName}</h4>
            <span className="badge" style={{ background: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
              {getRoleIcon(user.role, "emoji")} {user.role}
            </span>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {showDeleteAlert ? (
              <div className="text-center py-5">
                <h5 className="text-danger fw-bold">⚠️ Warning: Account Deletion</h5>
                <p className="text-muted">
                  If you delete your account, <strong>all your data</strong> will be permanently removed.
                </p>
                
                {deleteError && (
                  <Alert variant="danger" className="mt-3 mb-0">
                    {deleteError}
                  </Alert>
                )}
                
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button 
                    className="btn btn-outline-secondary px-4" 
                    onClick={() => {
                      setShowDeleteAlert(false);
                      setDeleteError(null);
                    }}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-danger px-4 fw-semibold d-flex align-items-center gap-2" 
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
                <div className="col-md-6">
                  <div className="shadow-sm rounded py-2 px-3 bg-white d-flex align-items-center border">
                    <FaDumbbell className="text-primary me-3 fs-5" />
                    <div className="w-100">
                      <small className="text-muted">Goal</small>
                      {isEditing ? (
                        <Form.Select
                          name="goal"
                          value={formData.goal}
                          onChange={handleChange}
                          className="mt-1"
                        >
                          <option value="">Select fitness goal</option>
                          <option value={0}>Muscle Gain</option>
                          <option value={1}>Fat Loss</option>
                        </Form.Select>
                      ) : (
                        <p className="mb-0 fw-semibold text-dark">
                          {formData.goal === 0 ? "Muscle Gain" : formData.goal === 1 ? "Fat Loss" : "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!showDeleteAlert && (
            <div className="modal-footer border-0 py-3 d-flex justify-content-between" style={{ backgroundColor: "#f1fcf8" }}>
              <button className="btn btn-outline-danger fw-semibold px-4" onClick={handleDeleteClick}>Delete My Account</button>
              <div className="d-flex gap-3">
                <button className="btn btn-outline-secondary fw-semibold px-4" onClick={onClose}>Close</button>
                <button className={`btn ${isEditing ? "btn-success" : "btn-primary"} fw-semibold px-4`} style={{ backgroundColor: isEditing ? "#11b981" : "#3a83f6", borderColor: isEditing ? "#11b981" : "#3a83f6" }} onClick={handleUpdateClick} disabled={updating}>
                  {updating ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" /> Updating...
                    </>
                  ) : (
                    isEditing ? "Submit" : "Update Profile"
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

// ProfileField component
const ProfileField = ({ icon: Icon, label, name, value, isEditing, onChange, type = "text", options = [], disabled = false }) => (
  <div className="col-md-6">
    <div className="shadow-sm rounded py-2 px-3 bg-white d-flex align-items-center border">
      <Icon className="text-primary me-3 fs-5" />
      <div className="w-100">
        <small className="text-muted">{label}</small>
        {isEditing && !disabled ? (
          type === "select" ? (
            <select name={name} value={value || ""} onChange={onChange} className="form-select form-select-sm mt-1">
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
              className="form-control form-control-sm mt-1"
            />
          )
        ) : (
          <p className="mb-0 fw-semibold text-dark">{value || "Not specified"}</p>
        )}
      </div>
    </div>
  </div>
);

export default ProfileModal;
