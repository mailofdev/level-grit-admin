import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/themes/variables.css";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/navigation/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import NotFound from "./features/errors/NotFound";
import Dashboard from "./features/dashboard/Dashboard";
import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";
import ResetPasswordForm from "./features/auth/ResetPasswordForm";
import Messages from "./features/users/Messages";
import AdjustPlan from "./features/adjustPlan/AdjustPlan";
import RegisterClientForm from "./features/auth/RegisterClientForm";
import AllClients from "./features/users/AllClients";
import ClientDetails from "./features/users/ClientDetails";
import LandingPage from "./features/landing/LandingPage";
import AdminDashboard from "./features/dashboard/AdminDashboard";
function ProtectedLayout({ children, config }) {
  return (
    <ProtectedRoute>
      <MainLayout config={config}>{children}</MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />     
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/register-client" element={<RegisterClientForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />


          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout config={{ showTopbar: true, showSidebar: false, showFooter: false }}>
                <Dashboard />
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
           <Route
            path="/admin-dashboard"
            element={
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            }
          />

          <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
