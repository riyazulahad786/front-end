import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import useAuth from your AuthContext

function ProtectedRoute({ element }) {
  const { isLoggedIn } = useAuth();

  // If not logged in, redirect to login page
  return isLoggedIn ? element : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
