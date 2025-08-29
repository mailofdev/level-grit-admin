import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/themes/variables.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/navigation/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import Invitations from "./features/invitations/Invitations";
import InvitationDetails from "./features/invitations/InvitationDetails";
import NotFound from "./features/errors/NotFound";
import Dashboard from "./features/dashboard/Dashboard";
import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";
import ResetPasswordForm from "./features/auth/ResetPasswordForm";
import Users from "./features/users/Users";
import UserDetails from "./features/users/UserDetails";
import Templates from "./features/templates/Templates";
import TemplateDetails from "./features/templates/TemplatesDetails";

function ProtectedLayout({ children, config }) {
  return (
    <ProtectedRoute>
      <MainLayout config={config}>{children}</MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
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
            path="/users"
            element={
              <ProtectedLayout>
                <Users />
              </ProtectedLayout>
            }
          />
           <Route
            path="/users/new"
            element={
              <ProtectedLayout>
                <UserDetails />
              </ProtectedLayout>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedLayout>
                <UserDetails />
              </ProtectedLayout>
            }
          />
          <Route
            path="/invitations"
            element={
              <ProtectedLayout>
                <Invitations />
              </ProtectedLayout>
            }
          />
          <Route
            path="/invitations/new"
            element={
              <ProtectedLayout>
                <InvitationDetails />
              </ProtectedLayout>
            }
          />
          <Route
            path="/invitations/:id"
            element={
              <ProtectedLayout>
                <InvitationDetails />
              </ProtectedLayout>
            }
          />
            <Route
            path="/templates"
            element={
              <ProtectedLayout>
                <Templates />
              </ProtectedLayout>
            }
          />

          <Route
            path="/templates/:id"
            element={
              <ProtectedLayout>
                <TemplateDetails />
              </ProtectedLayout>
            }
          />

          <Route
            path="/templates/new"
            element={
              <ProtectedLayout>
                <TemplateDetails />
              </ProtectedLayout>
            }
          />


          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
