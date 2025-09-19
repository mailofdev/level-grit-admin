import getRoleIcon from "../common/CommonFunctions";

const ProfileModal = ({ show, onClose, user }) => {

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">{getRoleIcon(user?.role, 'emoji')} Profile</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
              <>
                <h6>
                  <p className="mb-1">
                    <strong>Full name:</strong> {user?.fullName}
                  </p>
                </h6>
                {user?.email && (
                  <p className="mb-1">
                    <strong>Email:</strong> {user?.email}
                  </p>
                )}
                {user?.phoneNumber && (
                  <p className="mb-1">
                    <strong>Phone:</strong> {user?.phoneNumber}
                  </p>
                )}
                {user?.gender && (
                  <p className="mb-1">
                    <strong>Gender:</strong> {user?.gender}
                  </p>
                )}
                {user?.role && (
                  <>
                  <p className="mb-1">
                    <strong>Role:</strong> {user?.role}
                  </p>
                  </>
                )}
              </>
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
