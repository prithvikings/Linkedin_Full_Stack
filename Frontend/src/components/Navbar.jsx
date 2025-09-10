import React, { useState } from "react";
import {
  FaLinkedin,
  FaHome,
  FaBriefcase,
  FaComments,
  FaBell,
  FaTh,
} from "react-icons/fa";
import { FiUsers, FiSearch } from "react-icons/fi";
import {  useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Auth } from "../context/AuthContext";
import { UserDataCtx } from "../context/UserContext";

const Navbar = () => {
  const [isProfilePop, setIsProfilePop] = useState(false);
  const navigate = useNavigate();
    const { serverUrl } = useContext(Auth);
      const {  UserData,setUserData } = useContext(UserDataCtx);
    
  

  const handleProfileClick = () => {
    setIsProfilePop(!isProfilePop);
  };

  const handleViewProfileClick = () => {
    // Logic to view profile
    navigate(`/profile/${UserData._id}`);
  }

  const handleSignOut = async () => {
    try{
      // Logic to sign out user
      const response = await fetch(serverUrl+'/api/auth/signout', {
        method: 'GET',
        credentials: 'include' // Include cookies if needed
      });
      if(response.ok){
        setUserData(null); // Clear user data in context
        navigate('/signin'); // Redirect to login page
      } else {
        console.error("Failed to sign out");
      }
    }
    catch(err){
      console.error("Error signing out:", err);
    }
  }


  return (
    <div className="w-full bg-white shadow-md px-4 md:px-10 lg:px-32 py-4 flex justify-between items-center relative">
      {/* Left section */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* LinkedIn Logo */}
        <FaLinkedin className="text-[#0A66C2] text-3xl md:text-4xl" />

        {/* Search Box (hidden on small screens) */}
        <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-3 py-2 w-40 md:w-64">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 md:gap-8 text-gray-600">
        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <FaHome className="text-lg md:text-xl" />
          <span className="hidden md:block text-xs">Home</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <FiUsers className="text-lg md:text-xl" />
          <span className="hidden md:block text-xs">My Network</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <FaBriefcase className="text-lg md:text-xl" />
          <span className="hidden md:block text-xs">Jobs</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <FaComments className="text-lg md:text-xl" />
          <span className="hidden md:block text-xs">Messaging</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <FaBell className="text-lg md:text-xl" />
          <span className="hidden md:block text-xs">Notifications</span>
        </div>

        {/* Profile Popup */}
        {isProfilePop && (
          <div className="absolute top-16 right-6 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
            <div className="flex flex-col items-center p-4 border-b border-gray-200">
              <img
                src={UserData.picture}
                alt="profile"
                className="w-20 h-20 rounded-full mb-3"
              />
              <h3 className="font-semibold text-gray-800">{UserData.firstname+" "+UserData.lastname}</h3>
              <p className="text-sm text-gray-500 mb-3">
                Software Engineer | React Dev
              </p>
              <button 
              onClick={handleViewProfileClick}
              className="w-full bg-[#0A66C2] text-white py-2 rounded-full text-sm font-medium hover:bg-[#004182] transition cursor-pointer">
                View Profile
              </button>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer transition ease-in-out duration-200">
                Settings & Privacy
              </button>
              <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer transition ease-in-out duration-200">
                Help
              </button>
              <button
              onClickCapture={handleSignOut}
              className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer transition ease-in-out duration-200">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Profile Icon */}
        <div
          className="flex flex-col items-center cursor-pointer hover:text-black"
          onClick={handleProfileClick}
        >
          <img
            src={UserData.picture}
            alt="profile"
            className="w-6 h-6 md:w-7 md:h-7 rounded-full"
          />
          <span className="hidden md:block text-xs">Me</span>
        </div>

        <div className="hidden md:flex flex-col items-center cursor-pointer hover:text-black">
          <FaTh className="text-xl" />
          <span className="text-xs">For Business</span>
        </div>

        <div className="hidden md:flex flex-col items-center cursor-pointer hover:text-black">
          <span className="text-yellow-500 text-xl">▢</span>
          <span className="text-xs">Premium</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
