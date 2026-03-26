import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { isAuthenticated, loading, dbUser } = useAuth();

  if (loading) {
    return <div className="page-loader">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?mode=admin" replace />;
  }

  if (dbUser?.role !== "administrador") {
    return <Navigate to="/products" replace />;
  }

  return children;
}