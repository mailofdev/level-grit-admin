
import getRoleIcon from "../common/CommonFunctions";
const UserMenu = ({ user, onProfile, onLogout }) => {

  return (
    <ul className="navbar-nav mb-2 mb-lg-0 ms-lg-3">
      <li className="nav-item dropdown">
        <button
          className="nav-link dropdown-toggle d-flex align-items-center bg-transparent border-0"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <div
            className="rounded-circle bg-secondary d-flex justify-content-center align-items-center me-2"
            style={{ width: "30px", height: "30px" }}
          >
            {getRoleIcon(user?.role)}
          </div>
          <span className="text-white">{user?.fullName || "User"}</span>
        </button>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <li>
            <button className="dropdown-item" type="button" onClick={onProfile}>
              Profile
            </button>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item" type="button" onClick={onLogout}>
              Logout
            </button>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default UserMenu;
