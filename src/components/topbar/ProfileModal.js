import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../../features/users/userSlice";
import Loader from "../../components/display/Loader"; // adjust path if needed

const ProfileModal = ({ show, onClose }) => {
  const userId = sessionStorage.getItem("user_id");
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    if (show && userId) {
      dispatch(fetchUserById(userId));
    }
  }, [show, userId, dispatch]);

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">Profile</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body text-center">
            {loading && (
              <Loader fullScreen size="60px" color="#0d6efd" text="Loading profile..." />
            )}

            {!loading && error && <p className="text-danger">{error}</p>}

            {!loading && !error && currentUser && (
              <>
                <img
                  src={currentUser.avatar || "https://i.pravatar.cc/80"}
                  alt="avatar"
                  className="rounded-circle mb-3"
                  width="80"
                  height="80"
                />
                <h6>
                  {`${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
                    "User"}
                </h6>
                {currentUser.email && (
                  <p className="mb-1 text-muted">
                    <strong>Email:</strong> {currentUser.email}
                  </p>
                )}
                {currentUser.phoneNumber && (
                  <p className="mb-1">
                    <strong>Phone:</strong> {currentUser.phoneNumber}
                  </p>
                )}
                {currentUser.gender && (
                  <p className="mb-1">
                    <strong>Gender:</strong> {currentUser.gender}
                  </p>
                )}
                {currentUser.role && (
                  <p className="mb-1">
                    <strong>Role:</strong> {currentUser.role}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
