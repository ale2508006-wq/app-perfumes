import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function UserRoute({ children }) {
  const { dbUser, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="page-loader">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?mode=user" replace />;
  }

  if (dbUser?.role === "administrador") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}