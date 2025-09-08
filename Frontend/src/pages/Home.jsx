import React, { useContext } from "react";
import { UserDataCtx } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
const Home = () => {
  const { UserData, loading } = useContext(UserDataCtx);


  if (loading) return <div>Loading...</div>; // wait until fetch finishes
  if (!UserData) return <Navigate to="/signin" />; // redirect if not logged in

  // ✅ don't use .user, it's already the user object
  return <div className="w-full min-h-screen bg-[#f5f3f0]">
    <Navbar />
  </div>;
};

export default Home;
