/**
 * Main Application Component
 * 
 * This is the root component that sets up routing, authentication, theming,
 * and error boundaries for the entire application.
 * 
 * Features:
 * - Lazy loading for better performance
 * - Protected routes with role-based access
 * - Global error handling with ErrorBoundary
 * - Theme and authentication context providers
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { useDispatch } from "react-redux";
import "./styles/themes/variables.css";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import ScrollToTop from "./components/navigation/ScrollToTop";
import ErrorBoundary from "./components/common/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";
import BackButtonHandler from "./components/common/BackButtonHandler";
import { usePWASession } from "./hooks/usePWASession";
import { ROLES } from "./utils/roles";
import { restoreSession } from "./features/auth/authSlice";

// ============================================
// Lazy Load Components - Performance Optimization
// ============================================
// Lazy loading reduces initial bundle size by splitting code into chunks
// Components are loaded only when their routes are accessed

// Authentication Components
const LandingPage = lazy(() => import("./features/landing/LandingPage"));
const LoginForm = lazy(() => import("./features/auth/LoginForm"));
const RegisterForm = lazy(() => import("./features/auth/RegisterForm"));
const ResetPasswordForm = lazy(() =>
  import("./features/auth/ResetPasswordForm")
);
const RegisterClientForm = lazy(() =>
  import("./features/auth/RegisterClientForm")
);

// Dashboard Components
const AdminDashboard = lazy(() =>
  import("./features/dashboard/AdminDashboard")
);
const TrainerDashboard = lazy(() =>
  import("./features/trainer/TrainerDashboard")
);
const ClientDashboard = lazy(() =>
  import("./features/client/ClientDashboard")
);
const PaymentManagement = lazy(() =>
  import("./features/payments/PaymentManagement")
);

// Client Management Components
const AllClients = lazy(() => import("./features/users/AllClients"));
const ClientDetails = lazy(() => import("./features/users/ClientDetails"));


// Communication Components
const Messages = lazy(() => import("./features/conversations/Messages"));
const AdjustPlan = lazy(() => import("./features/adjustPlan/AdjustPlan"));

// Static Pages
const NotFound = lazy(() => import("./features/errors/NotFound"));
const TermsAndConditions = lazy(() =>
  import("./features/static/TermsAndConditions")
);
const PrivacyPolicy = lazy(() => import("./features/static/PrivacyPolicy"));
const ContactUs = lazy(() => import("./features/static/ContactUs"));
const CancellationPolicy = lazy(() =>
  import("./features/static/CancellationPolicy")
);
const AboutUs = lazy(() => import("./features/static/AboutUs"));
const Services = lazy(() => import("./features/static/Services"));
const Testimonials = lazy(() => import("./features/static/Testimonials"));

// ============================================
// Loading Component
// ============================================
/**
 * Fallback component shown while lazy-loaded components are being fetched
 * Provides visual feedback during code splitting
 */
const PageLoader = () => (
  <div className="d-flex align-items-center justify-content-center min-vh-100">
    <div className="text-center">
      <div
        className="spinner-border text-primary mb-3"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">Loading...</p>
    </div>
  </div>
);

// ============================================
// Protected Layout Wrapper
// ============================================
/**
 * Wrapper component that combines ProtectedRoute and MainLayout
 * Ensures only authenticated users can access protected routes
 * 
 * @param {Object} children - Child components to render
 * @param {Object} config - Layout configuration (showTopbar, showSidebar, etc.)
 */
function ProtectedLayout({ children, config }) {
  return (
    <ProtectedRoute>
      <MainLayout config={config}>{children}</MainLayout>
    </ProtectedRoute>
  );
}

// ============================================
// Main App Component
// ============================================
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// App Content Component - Handles PWA session and routing
function AppContent() {
  const dispatch = useDispatch();
  const [isResuming, setIsResuming] = React.useState(false);
  
  // Initialize PWA session management
  const { restoreSession: restorePWASession } = usePWASession();

  // Restore session to Redux state on app initialization
  React.useEffect(() => {
    // Restore session from localStorage to Redux state on mount
    dispatch(restoreSession());
  }, [dispatch]);

  // Handle app resume with smooth transition
  React.useEffect(() => {
    let resumeTimeout;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // App resumed, show brief loading state for smooth transition
        setIsResuming(true);
        
        // Restore session if needed (both sessionStorage and Redux state)
        if (!sessionStorage.getItem('auth_data')) {
          restorePWASession();
          dispatch(restoreSession());
        } else {
          // Ensure Redux state is synced even if sessionStorage exists
          dispatch(restoreSession());
        }
        
        // Hide loading state after brief delay for smooth UX
        resumeTimeout = setTimeout(() => {
          setIsResuming(false);
        }, 300);
      } else {
        setIsResuming(false);
      }
    };

    const handleFocus = () => {
      // App brought to foreground
      if (!sessionStorage.getItem('auth_data')) {
        restorePWASession();
        dispatch(restoreSession());
      } else {
        // Ensure Redux state is synced
        dispatch(restoreSession());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      if (resumeTimeout) clearTimeout(resumeTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch, restorePWASession]);

  return (
    <>
      {isResuming && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--color-bg)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isResuming ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none'
          }}
        />
      )}
      <BackButtonHandler />
      <Suspense fallback={<PageLoader />}>
        <Routes>
                {/* ============================================
                    Public Routes - No Authentication Required
                    ============================================ */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route
                  path="/index.html"
                  element={<Navigate to="/" replace />}
                />
                <Route path="/register" element={<RegisterForm />} />
                <Route
                  path="/register-client"
                  element={<RegisterClientForm />}
                />
                <Route path="/reset-password" element={<ResetPasswordForm />} />

                {/* Static Information Pages */}
                <Route
                  path="/terms-conditions"
                  element={<TermsAndConditions />}
                />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route
                  path="/cancellation-policy"
                  element={<CancellationPolicy />}
                />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/services" element={<Services />} />
                <Route path="/testimonials" element={<Testimonials />} />

                {/* ============================================
                    Protected Routes - Authentication Required
                    ============================================ */}
                
                {/* Dashboard Routes - Role-based access */}
                <Route
                  path="/trainer-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
                      <MainLayout
                        config={{
                          showTopbar: true,
                          showSidebar: false,
                          showFooter: false,
                        }}
                      >
                        <TrainerDashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/client-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
                      <MainLayout
                        config={{
                          showTopbar: true,
                          showSidebar: false,
                          showFooter: false,
                        }}
                      >
                        <ClientDashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATOR]}>
                      <MainLayout>
                        <AdminDashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment-management"
                  element={
                    <ProtectedLayout>
                      <PaymentManagement />
                    </ProtectedLayout>
                  }
                />

                {/* Client Management Routes - Trainer/Admin only */}
                <Route
                  path="/AllClients"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.TRAINER, ROLES.ADMINISTRATOR]}>
                      <MainLayout>
                        <AllClients />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/client-details/:clientId"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.TRAINER, ROLES.ADMINISTRATOR]}>
                      <MainLayout>
                        <ClientDetails />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages/:clientId"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.TRAINER, ROLES.ADMINISTRATOR]}>
                      <MainLayout>
                        <Messages isTrainer={true} />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/client-messages/:trainerId"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
                      <MainLayout
                        config={{
                          showTopbar: true,
                          showSidebar: false,
                          showFooter: false,
                        }}
                      >
                        <Messages isTrainer={false} />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Meal Plan Management - Trainer only */}
                <Route
                  path="/adjust-plan/:clientId"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
                      <MainLayout>
                        <AdjustPlan />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                {/* 404 - Catch all unmatched routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
      </Suspense>
    </>
  );
}

export default App;
