import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserDataCtx } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { UserData, loading } = useContext(UserDataCtx);

  // Wait until we finish checking the backend
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!UserData) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
