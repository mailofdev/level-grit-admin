import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
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
import { getRoutes } from "../navigation/Routes";

const Topbar = ({
  showSearch = true,
  showNavMenu = true,
  showUserMenu = true,
  showThemeToggle = true,
  showIcons = true,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const routes = getRoutes();
  const homeHref = routes?.[0]?.href || "/";
  const isHome = location.pathname === homeHref;
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
      className="navbar navbar-expand-lg navbar-dark px-3 px-md-4 shadow-sm sticky-top fixed-top"
      style={{ 
        paddingTop: 'calc(0.5rem + env(safe-area-inset-top))', 
        minHeight: '56px',
        background: 'linear-gradient(135deg, var(--color-nav-bg) 0%, rgba(40, 167, 69, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1030
      }}
    >
      <div className="container-fluid px-2 px-md-3">
        {/* Left: Logo */}
        <div className="d-flex align-items-center">
          <BrandLogo />
        </div>

        {/* Hamburger toggle */}
        <button
          className="navbar-toggler ms-auto border-0"
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
          aria-label="Toggle navigation"
          aria-expanded={navbarOpen}
          style={{ 
            minWidth: '44px', 
            minHeight: '44px', 
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`}>
          <div className="d-flex w-100 flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between mt-3 mt-lg-0 gap-3 gap-lg-0">
            {showNavMenu && (
              <div className="w-100 w-lg-auto mx-auto mx-lg-0">
                <NavMenu
                  navbarOpen={navbarOpen}
                  setNavbarOpen={setNavbarOpen}
                  onRouteClick={() => setNavbarOpen(false)}
                  showIcons={showIcons}
                />
              </div>
            )}

            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 gap-lg-3  w-lg-auto">
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
      
      {/* Modals rendered via portal to document.body to ensure they appear above all content */}
      {showLogoutModal && createPortal(
        <LogoutModal
          show={showLogoutModal}
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />,
        document.body
      )}
      {showProfileModal && createPortal(
        <ProfileModal
          show={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />,
        document.body
      )}
    </nav>
  );
};

export default Topbar;
