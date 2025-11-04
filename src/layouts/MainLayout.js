import React from 'react';
import layoutConfig from '../config/layout';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MobileBottomNav from '../components/navigation/MobileBottomNav';
import Footer from '../components/layout/Footer';
import ThemeSwitch from '../components/display/ThemeSwitch';
// import { useAuth } from '../features/auth/hooks/useAuth';

const MainLayout = ({ children, config }) => {
  // const { user, logout } = useAuth();
  const cfg = { ...layoutConfig, ...config };

  const handleLogout = () => {
    // logout();
  };

  const handleProfile = () => {

  };

  return (
    <div className="d-flex flex-column min-vh-100 theme-transition">
      <a href="#main-content" className="skip-link">Skip to content</a>
      {cfg.showTopbar && (
        <Topbar 
          showSearch={false} 
          showNavMenu={true} 
          showUserMenu={true} 
          showThemeToggle={false} 
          showIcons={true} 
          onLogout={handleLogout}
          onProfile={handleProfile}
        />
      )}
      <div className="container-fluid flex-grow-1 pt-3 pt-md-4 pt-lg-4 pb-5 pb-md-5 pb-lg-0" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top))', paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))', backgroundColor: 'var(--color-bg)' }}>
        <div className="row g-0 g-lg-3">
          {cfg.showSidebar && (
            <div className="d-none d-lg-block col-lg-2 col-xl-2">
              <Sidebar showIcons={true} />
            </div>
          )}
          <main id="main-content" role="main" tabIndex="-1" className={cfg.showSidebar ? "col-12 col-lg-10 ms-lg-auto px-3 px-md-4 px-lg-4" : "col-12 px-3 px-md-4 px-lg-4"}>
            {children}
          </main>
        </div>
      </div>
      {/* Mobile bottom navigation */}
      <MobileBottomNav />
      {cfg.showFooter && <Footer />}
    </div>
  );
};

export default MainLayout; 