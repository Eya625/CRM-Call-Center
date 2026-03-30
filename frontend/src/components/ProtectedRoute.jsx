import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // pas connecté
  if (!user) {
    return <Navigate to="/" />;
  }

  //  mauvais rôle
  if (user.role !== role) {
    return <Navigate to="/" />;
  }

  //  autorisé
  return children;
}