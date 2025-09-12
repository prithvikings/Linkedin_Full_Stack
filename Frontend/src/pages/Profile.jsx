import React, { useEffect, useState, useContext } from "react";
import { Auth } from "../context/AuthContext";
import { UserDataCtx } from "../context/UserContext";
import Editprofile from "../components/Editprofile";
import PostCard from "../components/Post";

const Profile = () => {
  const { serverUrl } = useContext(Auth);
  const { UserData, loading, editProfileOpen, setEditProfileOpen, imageUrl } =
    useContext(UserDataCtx);

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Fetch user's posts
  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/posts/myposts`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (UserData) fetchUserPosts();
  }, [UserData]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!UserData) return <div className="p-6 text-center">No profile found</div>;

  return (
    <div className="w-full min-h-screen bg-[#f5f3f0]">
      {/* Edit Modal */}
      {editProfileOpen && <Editprofile />}

      <div className="w-full max-w-4xl mx-auto p-6 flex flex-col gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          {/* Cover */}
          <div className="h-40 bg-gray-200 rounded-lg mb-12 relative">
            {UserData.cover ? (
              <img
                className="w-full h-40 object-cover rounded-lg"
                src={UserData.cover}
                alt="cover"
              />
            ) : (
              <div className="w-full h-40 bg-gray-300 rounded-lg"></div>
            )}
            {/* Avatar */}
            <div className="absolute -bottom-12 left-6">
              <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden">
                <img
                  src={UserData.picture || imageUrl}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-16 px-2">
            <h1 className="text-2xl font-bold">
              {UserData.firstname} {UserData.lastname}
            </h1>
            <p className="text-gray-600">{UserData.headline || "No headline"}</p>
            <p className="text-sm text-gray-500">{UserData.email}</p>
            <p className="mt-2 text-gray-700">
              {UserData.bio || "No bio added yet."}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-4 px-2">
            <button
              onClick={() => setEditProfileOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer hover:shadow-lg transition-shadow"
            >
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer hover:shadow-lg transition-shadow">
              Change Password
            </button>
          </div>
        </div>

        {/* User Posts */}
        <div className="bg-gray-200 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">My Posts</h2>
          {loadingPosts ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">You haven’t posted anything yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} setPosts={setPosts} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
