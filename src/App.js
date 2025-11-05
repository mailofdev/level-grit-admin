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
import InstallPrompt from "./InstallPrompt";

// Lazy load components for better performance - reduces initial bundle size
const LandingPage = lazy(() => import("./features/landing/LandingPage"));
const LoginForm = lazy(() => import("./features/auth/LoginForm"));
const RegisterForm = lazy(() => import("./features/auth/RegisterForm"));
const ResetPasswordForm = lazy(() =>
  import("./features/auth/ResetPasswordForm")
);
const RegisterClientForm = lazy(() =>
  import("./features/auth/RegisterClientForm")
);
// const Dashboard = lazy(() => import("./features/dashboard/Dashboard")); // Not used in routes
const AdminDashboard = lazy(() =>
  import("./features/dashboard/AdminDashboard")
);
const AllClients = lazy(() => import("./features/users/AllClients"));
const ClientDetails = lazy(() => import("./features/users/ClientDetails"));
const Messages = lazy(() => import("./features/users/Messages"));
const AdjustPlan = lazy(() => import("./features/adjustPlan/AdjustPlan"));
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
const TrainerDashboard = lazy(() =>
  import("./features/trainer/TrainerDashboard")
);
const ClientDashboard = lazy(() =>
  import("./features/client/ClientDashboard")
);
const ClientMessages = lazy(() =>
  import("./features/client/ClientMessages")
);
const ClientMessaging = lazy(() =>
  import("./features/messaging/ClientMessaging")
);

// Loading fallback component
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

function ProtectedLayout({ children, config }) {
  return (
    <ProtectedRoute>
      <MainLayout config={config}>{children}</MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
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

                {/* Static Pages */}
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

                {/* Protected routes */}
                <Route
                  path="/trainer-dashboard"
                  element={
                    <ProtectedLayout
                      config={{
                        showTopbar: true,
                        showSidebar: false,
                        showFooter: false,
                      }}
                    >
                      <TrainerDashboard />
                    </ProtectedLayout>
                  }
                />
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
                <Route
                  path="/AllClients"
                  element={
                    <ProtectedLayout>
                      <AllClients />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/client-details/:clientId"
                  element={
                    <ProtectedLayout>
                      <ClientDetails />
                    </ProtectedLayout>
                  }
                />

                <Route
                  path="/messages/:clientId"
                  element={
                    <ProtectedLayout>
                      <Messages isTrainer={true} />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/adjust-plan/:clientId"
                  element={
                    <ProtectedLayout>
                      <AdjustPlan />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedLayout>
                      <AdminDashboard />
                    </ProtectedLayout>
                  }
                />

                {/* Trainer Features */}
                <Route
                  path="/messages/:clientId"
                  element={
                    <ProtectedLayout>
                      <ClientMessaging />
                    </ProtectedLayout>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
          <InstallPrompt />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
