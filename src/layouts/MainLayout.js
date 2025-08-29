import React from 'react';
import layoutConfig from '../config/layout';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';
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
    <div className="d-flex flex-column min-vh-100">
      {cfg.showTopbar && (
        <Topbar 
          showSearch={false} 
          showNavMenu={true} 
          showUserMenu={true} 
          showThemeToggle={true} 
          showIcons={true} 
          // user={
          //   user ? { 
          //   // name: user.name, 
          //   // email: user.email,
          //   avatar: "https://i.pravatar.cc/30" 
          // } : { name: "User", avatar: "https://i.pravatar.cc/30" }}
          onLogout={handleLogout}
          onProfile={handleProfile}
        />
      )}
      <div className="container-fluid flex-grow-1">
        <div className="row">
          {cfg.showSidebar && (
            <Sidebar showIcons={true} />
          )}
          <main className={cfg.showSidebar ? "col-md-10 ms-sm-auto px-4" : "col-12 px-4"}>
            {children}
          </main>
        </div>
      </div>
      {cfg.showFooter && <Footer />}
    </div>
  );
};

export default MainLayout; 