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
import { Suspense, lazy } from "react";
import "./styles/themes/variables.css";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import ScrollToTop from "./components/navigation/ScrollToTop";
import ErrorBoundary from "./components/common/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";

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

// Client Dashboard Component
const ClientDashboard = lazy(() =>
  import("./features/client/ClientDashboard")
);

// Client Features
const ClientMessages = lazy(() =>
  import("./features/client/ClientMessages")
);
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
                    Protected Routes - Client Portal Only
                    ============================================ */}
                
                {/* Client Dashboard Route */}
                <Route
                  path="/client-dashboard"
                  element={
                    <ProtectedLayout
                      config={{
                        showTopbar: true,
                        showSidebar: false,
                        showFooter: false,
                      }}
                    >
                      <ClientDashboard />
                    </ProtectedLayout>
                  }
                />

                {/* Client Messages Route */}
                <Route
                  path="/client-messages/:clientId"
                  element={
                    <ProtectedLayout
                      config={{
                        showTopbar: true,
                        showSidebar: false,
                        showFooter: false,
                      }}
                    >
                      <ClientMessages />
                    </ProtectedLayout>
                  }
                />

                {/* Meal Plan Management Route */}
                <Route
                  path="/adjust-plan/:clientId"
                  element={
                    <ProtectedLayout>
                      <AdjustPlan />
                    </ProtectedLayout>
                  }
                />

                {/* 404 - Catch all unmatched routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
