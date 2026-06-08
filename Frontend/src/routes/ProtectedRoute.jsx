import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ✅ Blocks unauthenticated users — redirects to /login
export const PrivateRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ✅ Blocks non-admin users — redirects to /dashboard
export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ✅ Blocks logged-in users from seeing login/signup again
export const GuestRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    // Redirect based on role
    if (user.role === "admin") return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
