import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserDataCtx } from "../context/UserContext";

const PublicRoute = ({ children }) => {
  const { UserData, loading } = useContext(UserDataCtx);

  if (loading) return <div>Loading...</div>; // wait for auth check

  if (UserData) {
    // already logged in → go to Home
    return <Navigate to="/" replace />;
  }

  return children; // not logged in → show Signin/Signup
};

export default PublicRoute;
