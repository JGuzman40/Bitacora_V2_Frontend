// src/componentes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Si no hay token o usuario, redirigir al login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo cumple
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />; // o a una página de acceso denegado
  }

  return children;
}

export default PrivateRoute;
