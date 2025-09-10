import React, { useContext, useEffect, useState } from "react";
import { UserDataCtx } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Editprofile from "../components/Editprofile";
import Createpost from "../components/Createpost";
import { Auth } from "../context/AuthContext";
import PostCard from "../components/Post";
const Home = () => {
  const { serverUrl } = useContext(Auth);

  const {
    UserData,
    loading,
    editProfileOpen,
    setEditProfileOpen,
    setcreatePostmodal,
    createPostmodal,
  } = useContext(UserDataCtx);

  const [posts, setPosts] = useState([]); // store feed posts

  if (loading) return <div>Loading...</div>;
  if (!UserData) return <Navigate to="/signin" />;

  const handleeditProfileOpen = () => {
    setEditProfileOpen(!editProfileOpen);
  };

  // Fetch posts
  const getPost = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/posts/getfeed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      setPosts(data); // save posts in state
    } catch (err) {
      console.log("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f3f0]">
      {createPostmodal && <Createpost />}
      {editProfileOpen && <Editprofile />}
      <Navbar />

      {/* Main layout */}
      <div className="flex items-start justify-evenly mt-6 px-4 lg:px-12 py-4">
        {/* Left Column - Profile */}
        <div className="bg-white rounded-lg shadow w-72 flex flex-col relative">
          {/* Cover */}
          <div className="w-full h-24 bg-gray-200 rounded-t-lg">
            {UserData.cover ? (
              <img
                src={UserData.cover}
                alt="Cover"
                className="w-full h-full object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-t-lg"></div>
            )}
          </div>

          {/* Profile picture */}
          <div className="w-20 h-20 rounded-full border-4 border-white -mt-10 ml-4 bg-gray-400">
            {UserData.picture ? (
              <img
                src={UserData.picture}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-400 rounded-full"></div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col px-4 pb-4 mt-2">
            <h2 className="font-semibold text-lg">
              {UserData.firstname} {UserData.lastname}
            </h2>
            <p className="text-sm text-gray-600">
              {UserData.headline || "Mern Developer"}
            </p>
            <p className="text-sm text-gray-500">
              {UserData.location || "India"}
            </p>

            <button
              onClick={handleeditProfileOpen}
              className="cursor-pointer mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Middle Column - Feed */}
        <div className="flex-1 max-w-2xl flex flex-col gap-4 mx-4">
          {/* Post input */}
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-400 overflow-hidden">
              {UserData.picture ? (
                <img
                  src={UserData.picture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <input
              onClick={() => setcreatePostmodal(true)}
              type="text"
              placeholder="Start a post"
              className="flex-1 border border-gray-300 rounded-full px-6 py-2 cursor-pointer hover:bg-gray-100 focus:outline-none"
              readOnly
            />
          </div>

          {/* Posts Feed */}
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <p className="text-center text-gray-500">No posts yet</p>
          )}
        </div>

        {/* Right Column - Suggestions/Ads */}
        <div className="hidden lg:block bg-white rounded-lg shadow w-72 h-72 p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Suggestions</h3>
          <p className="text-sm text-gray-500">Work in progress...</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
