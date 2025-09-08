import React, { useContext } from "react";
import { UserDataCtx } from "../context/UserContext";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { UserData, loading } = useContext(UserDataCtx);

  if (loading) return <div>Loading...</div>; // wait for fetch
  if (!UserData) return <Navigate to="/signin" />; // redirect if not logged in

  return <div>Welcome Back, {UserData.firstname}!</div>;
};

export default Home;
