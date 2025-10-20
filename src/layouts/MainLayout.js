/**
 * MainLayout component with Redux integration
 * Manages layout state, theme, and user interactions through Redux
 */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';
import ThemeSwitch from '../components/display/ThemeSwitch';
import { useAuth, useAuthActions } from '../hooks/reduxHooks';
import { useTheme, useThemeActions } from '../hooks/reduxHooks';
import { useUI, useUIActions } from '../hooks/reduxHooks';
import { selectLayoutConfig } from '../features/theme/themeSlice';
import { selectUser, selectIsAuthenticated } from '../features/auth/authSlice';
import { setActiveRoute } from '../features/ui/uiSlice';
import { useLocation } from 'react-router-dom';

/**
 * MainLayout component that provides the main application layout
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Object} props.config - Layout configuration overrides
 * @returns {JSX.Element} Main layout component
 */
const MainLayout = ({ children, config = {} }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Redux state
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const layoutConfig = useSelector(selectLayoutConfig);
  const theme = useTheme();
  const ui = useUI();
  
  // Redux actions
  const authActions = useAuthActions();
  const themeActions = useThemeActions();
  const uiActions = useUIActions();

  // Merge default config with props config
  const cfg = { ...layoutConfig, ...config };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    authActions.logout();
    // Clear any UI state
    uiActions.hideAllModals();
    uiActions.clearNotifications();
    uiActions.clearToasts();
  };

  /**
   * Handle profile action
   */
  const handleProfile = () => {
    uiActions.showModal('profileModal');
  };

  /**
   * Handle theme toggle
   */
  const handleThemeToggle = () => {
    themeActions.toggleTheme();
  };

  /**
   * Handle sidebar toggle
   */
  const handleSidebarToggle = () => {
    themeActions.toggleSidebar();
  };

  // Update active route when location changes
  useEffect(() => {
    dispatch(setActiveRoute(location.pathname));
  }, [location.pathname, dispatch]);

  // Initialize theme on mount
  useEffect(() => {
    themeActions.initializeTheme();
  }, [themeActions]);

  return (
    <div className="d-flex flex-column min-vh-100 theme-transition">
      {/* Topbar */}
      {cfg.showTopbar && (
        <Topbar 
          showSearch={false} 
          showNavMenu={true} 
          showUserMenu={true} 
          showThemeToggle={true} 
          showIcons={true}
          user={user ? { 
            name: user.name || user.email, 
            email: user.email,
            avatar: user.avatar || "https://i.pravatar.cc/30",
            role: user.role
          } : { name: "User", avatar: "https://i.pravatar.cc/30" }}
          onLogout={handleLogout}
          onProfile={handleProfile}
          onThemeToggle={handleThemeToggle}
          onSidebarToggle={handleSidebarToggle}
          isAuthenticated={isAuthenticated}
          theme={theme.theme}
          sidebarCollapsed={cfg.sidebarCollapsed}
        />
      )}
      
      {/* Main content area */}
      <div className="container-fluid flex-grow-1">
        <div className="row">
          {/* Sidebar */}
          {cfg.showSidebar && (
            <Sidebar 
              showIcons={true}
              collapsed={cfg.sidebarCollapsed}
              onToggle={handleSidebarToggle}
              user={user}
              isAuthenticated={isAuthenticated}
            />
          )}
          
          {/* Main content */}
          <main className={
            cfg.showSidebar 
              ? `col-md-${cfg.sidebarCollapsed ? '11' : '10'} ms-sm-auto px-4` 
              : "col-12 px-2"
          }>
            {/* Global loading indicator */}
            {ui.globalLoading && (
              <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75" style={{ zIndex: 9999 }}>
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading...</p>
                </div>
              </div>
            )}
            
            {/* Global error display */}
            {ui.globalError && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> {ui.globalError}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={uiActions.clearGlobalError}
                  aria-label="Close"
                ></button>
              </div>
            )}
            
            {/* Global success display */}
            {ui.globalSuccess && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Success:</strong> {ui.globalSuccess}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={uiActions.clearGlobalSuccess}
                  aria-label="Close"
                ></button>
              </div>
            )}
            
            {/* Main content */}
            {children}
          </main>
        </div>
      </div>
      
      {/* Footer */}
      {cfg.showFooter && <Footer />}
      
      {/* Theme Switch (if needed) */}
      <ThemeSwitch 
        theme={theme.theme}
        onToggle={handleThemeToggle}
      />
    </div>
  );
};

export default MainLayout; 