import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import BrandLogo from "../topbar/BrandLogo";
import NavMenu from "../topbar/NavMenu";
import SearchBar from "../topbar/SearchBar";
import UserMenu from "../topbar/UserMenu";
import ThemeSwitch from "../display/ThemeSwitch";
import LogoutModal from "../topbar/LogoutModal";
import ProfileModal from "../topbar/ProfileModal";
import { logout } from "../../features/auth/authSlice";
import { getDecryptedUser } from "../common/CommonFunctions";

const Topbar = ({
  showSearch = true,
  showNavMenu = true,
  showUserMenu = true,
  showThemeToggle = true,
  showIcons = true,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = getDecryptedUser();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const navRef = useRef(null);

  const handleProfileClick = () => setShowProfileModal(true);
  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleLogoutConfirm = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarOpen && navRef.current && !navRef.current.contains(event.target)) {
        setNavbarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navbarOpen]);

  return (
    <nav
      ref={navRef}
      className="navbar navbar-expand-lg navbar-dark px-3 shadow-sm sticky-top fixed-top"
    >
      <div className="container-fluid">
        {/* Left: Back (mobile) + Logo */}
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            aria-label="Back"
            className="btn btn-outline-secondary btn-sm d-lg-none"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
            style={{ borderRadius: "9999px" }}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <BrandLogo />
        </div>

        {/* Hamburger toggle */}
        <button
          className="navbar-toggler ms-auto bg-dark"
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`}>
          <div className="d-flex w-100 flex-column flex-lg-row align-items-center justify-content-between">
            {showNavMenu && (
              <div className="mx-auto">
                <NavMenu
                  navbarOpen={navbarOpen}
                  setNavbarOpen={setNavbarOpen}
                  onRouteClick={() => setNavbarOpen(false)}
                  showIcons={showIcons}
                />
              </div>
            )}

            <div className="d-flex flex-column flex-lg-row align-items-center gap-3">
              {showSearch && <SearchBar />}
              {showThemeToggle && <ThemeSwitch enableThemeAlert />}
              {showUserMenu && (
                <UserMenu
                  user={user}
                  onProfile={handleProfileClick}
                  onLogout={handleLogoutClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLogoutModal && (
        <LogoutModal
          show={showLogoutModal}
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
      {showProfileModal && (
        <ProfileModal
          show={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </nav>
  );
};

export default Topbar;
