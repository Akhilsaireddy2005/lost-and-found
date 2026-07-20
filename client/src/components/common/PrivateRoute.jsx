import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function PrivateRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children;
}

export default PrivateRoute;