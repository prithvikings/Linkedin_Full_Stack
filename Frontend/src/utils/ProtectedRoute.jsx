import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserDataCtx } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { UserData, loading } = useContext(UserDataCtx);

  if (loading) {
    return <div className="w-full flex items-center justify-center text-2xl font-bold">Loading...</div>;
  }

  if (!UserData) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
