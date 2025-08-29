// src/components/navigation/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth);
  const storedToken = sessionStorage.getItem("access_token");

  if (!token && !storedToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
