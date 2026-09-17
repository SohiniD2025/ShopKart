import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { fetchProfile } from "../services/api";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        await fetchProfile();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    verifySession();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
