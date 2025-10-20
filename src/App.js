import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { PersistGate } from 'redux-persist/integration/react';
import './styles/themes/variables.css';
import './App.css';
import ProtectedRoute from './components/navigation/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Loader from './components/display/Loader';
import ErrorFallback from './components/common/ErrorFallback';
import { persistor } from './redux/store';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./features/landing/LandingPage'));
const LoginForm = lazy(() => import('./features/auth/LoginForm'));
const RegisterForm = lazy(() => import('./features/auth/RegisterForm'));
const RegisterClientForm = lazy(() => import('./features/auth/RegisterClientForm'));
const ResetPasswordForm = lazy(() => import('./features/auth/ResetPasswordForm'));
const NotFound = lazy(() => import('./features/errors/NotFound'));

// Static pages
const TermsAndConditions = lazy(() => import('./features/static/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./features/static/PrivacyPolicy'));
const ContactUs = lazy(() => import('./features/static/ContactUs'));
const CancellationPolicy = lazy(() => import('./features/static/CancellationPolicy'));

// Dashboard components
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const AdminDashboard = lazy(() => import('./features/dashboard/AdminDashboard'));
const TrainerDashboard = lazy(() => import('./features/trainer/TrainerDashboard'));

// User management
const AllClients = lazy(() => import('./features/users/AllClients'));
const ClientDetails = lazy(() => import('./features/users/ClientDetails'));
const Messages = lazy(() => import('./features/users/Messages'));

// Feature components
const AdjustPlan = lazy(() => import('./features/adjustPlan/AdjustPlan'));
const MealPlanManager = lazy(() => import('./features/mealPlans/MealPlanManager'));
const ClientMessaging = lazy(() => import('./features/messaging/ClientMessaging'));
const ProgressTracker = lazy(() => import('./features/progress/ProgressTracker'));
const SubscriptionManager = lazy(() => import('./features/subscription/SubscriptionManager'));

/**
 * ProtectedLayout component that wraps protected routes with authentication and layout
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Object} props.config - Layout configuration object
 * @returns {JSX.Element} Protected layout component
 */
function ProtectedLayout({ children, config }) {
  return (
    <ProtectedRoute>
      <MainLayout config={config}>{children}</MainLayout>
    </ProtectedRoute>
  );
}

/**
 * Loading component for Suspense fallback
 * @returns {JSX.Element} Loading spinner component
 */
function LoadingFallback() {
  return <Loader fullScreen text="Loading..." />;
}

/**
 * Main App component with routing, error boundaries, and context providers
 * @returns {JSX.Element} Main application component
 */
function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application Error:', error, errorInfo);
        // Here you could send error to monitoring service like Sentry
      }}
    >
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/index.html" element={<Navigate to="/" replace />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/register-client" element={<RegisterClientForm />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />

                {/* Static Pages */}
                <Route path="/terms-conditions" element={<TermsAndConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/cancellation-policy" element={<CancellationPolicy />} />

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
                  path="/dashboard"
                  element={
                    <ProtectedLayout>
                      <Dashboard />
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
                <Route
                  path="/all-clients"
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
                      <Messages />
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

                {/* Trainer Features */}
                <Route
                  path="/meal-plans"
                  element={
                    <ProtectedLayout>
                      <MealPlanManager />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/client-messaging/:clientId"
                  element={
                    <ProtectedLayout>
                      <ClientMessaging />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/progress"
                  element={
                    <ProtectedLayout>
                      <ProgressTracker />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <ProtectedLayout>
                      <SubscriptionManager />
                    </ProtectedLayout>
                  }
                />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </PersistGate>
      </ErrorBoundary>
    );
  }

export default App;
