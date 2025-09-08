import React from "react";
import { FaLinkedin, FaHome, FaBriefcase, FaComments, FaBell, FaTh } from "react-icons/fa";
import { FiUsers, FiSearch } from "react-icons/fi";

const Navbar = () => {
  return (
    <div className="w-full bg-white shadow-md px-32 py-2 flex justify-between items-center">
      
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* LinkedIn Logo */}
        <FaLinkedin className="text-[#0A66C2] text-4xl" />

        {/* Search Box */}
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-64">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none w-full"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-8 text-gray-600">
        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <FaHome className="text-xl" />
          <span className="text-xs">Home</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <FiUsers className="text-xl" />
          <span className="text-xs">My Network</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <FaBriefcase className="text-xl" />
          <span className="text-xs">Jobs</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <FaComments className="text-xl" />
          <span className="text-xs">Messaging</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <FaBell className="text-xl" />
          <span className="text-xs">Notifications</span>
        </div>

        {/* Profile (use placeholder image) */}
        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="profile"
            className="w-6 h-6 rounded-full"
          />
          <span className="text-xs">Me</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <FaTh className="text-xl" />
          <span className="text-xs">For Business</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:text-black">
          <span className="text-yellow-500 text-xl">▢</span>
          <span className="text-xs">Premium</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
