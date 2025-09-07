import React, { useContext } from "react";
import { Auth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { isloggedin, loading } = useContext(Auth);

  if (loading) return <div>Loading...</div>; // wait for auth check

  if (!isloggedin) return <Navigate to="/signin" />; // redirect if not logged in

  return <div>Welcome Back!</div>;
};

export default Home;
