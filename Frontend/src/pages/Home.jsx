import React, { useContext } from "react";
import { UserDataCtx } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Editprofile from "../components/Editprofile";
import User from "../../../Backend/models/userModel";
const Home = () => {
  const { UserData, loading,editProfileOpen,setEditProfileOpen } = useContext(UserDataCtx);

  if (loading) return <div>Loading...</div>; // wait until fetch finishes
  if (!UserData) return <Navigate to="/signin" />; // redirect if not logged in


  const handleeditProfileOpen=()=>{
    setEditProfileOpen(!editProfileOpen);
  }

  // ✅ don't use .user, it's already the user object
  return (
    <div className="w-full min-h-screen bg-[#f5f3f0] ">
      {editProfileOpen&&<Editprofile />}
      <Navbar />
      <div className="flex items-start mt-4 justify-evenly h-[90vh] space-x-2">


        <div className="bg-white p-4 rounded shadow w-78 flex flex-col relative gap-8">
          <div className="bg-gray-200 h-18 w-full rounded-md  "></div>
          <div className="w-16 h-16 rounded-full border-2 border-white -mt-8 bg-gray-600 absolute top-22 left-8"></div>
          <div className="flex flex-col justify-start mt-4">
            <h2 className="font-medium text-lg">{UserData.firstname} {UserData.lastname}</h2>
            <p className="text-sm text-gray-500 font-medium">{UserData.headline ||"Mern Developer"}</p>
            {UserData.location ? <p className="text-sm text-gray-500 font-medium">{UserData.location}</p> : <p className="text-sm text-gray-500 font-medium">India</p>}
            <button
            onClick={handleeditProfileOpen}
            className="bg-blue-500 text-white py-2 w-1/2 rounded mt-4 cursor-pointer hover:bg-blue-600 transition ease-in-out duration-200">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow w-2xl flex justify-evenly gap-2 h-24 items-center">
          <div className="bg-gray-500 rounded-full w-12 h-12"></div>
          <div className="w-[70%]">
            <input
              type="text"
              placeholder="Start a post"
              className="border w-full border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>


        <div className="bg-white p-4 rounded shadow w-78 h-72">Post 3</div>
      </div>
    </div>
  );
};

export default Home;
