const UserMenu = ({ user, onProfile, onLogout }) => (
  <ul className="navbar-nav mb-2 mb-lg-0 ms-lg-3">
    <li className="nav-item dropdown">
      <button
        className="nav-link dropdown-toggle d-flex align-items-center bg-transparent border-0"
        id="userDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          src={user?.avatar || "https://i.pravatar.cc/30"}
          alt="avatar"
          className="rounded-circle me-2"
          width="30"
          height="30"
        />
        <span className="text-white">{user?.name || "User"}</span>
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

export default UserMenu;
