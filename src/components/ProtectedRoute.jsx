import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowSurvey = false }) {
  const { isAuthenticated, needsSurvey } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (needsSurvey && !allowSurvey) {
    return <Navigate to="/survey" replace />;
  }

  return children;
}
