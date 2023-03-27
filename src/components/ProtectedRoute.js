import { Navigate } from "react-router-dom";

import { UserAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { getAuthenticatedUser } = UserAuth();

  if (!getAuthenticatedUser()) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
