import React, { createContext, useEffect, useState, useContext } from "react";
import { Auth } from "../context/AuthContext";
import { socket } from "../utils/socket"; // ✅ import socket

export const UserDataCtx = createContext();

const UserContext = ({ children }) => {
  const [UserData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [createPostmodal, setcreatePostmodal] = useState(false);
  const { serverUrl } = useContext(Auth);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(serverUrl + "/api/user/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setUserData(data.user);

          // ✅ Register socket with backend
          if (data.user?._id) {
            socket.emit("register", data.user._id);
          }
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [serverUrl]);

  return (
    <UserDataCtx.Provider
      value={{
        UserData,
        setUserData,
        loading,
        editProfileOpen,
        setEditProfileOpen,
        createPostmodal,
        setcreatePostmodal,
      }}
    >
      {children}
    </UserDataCtx.Provider>
  );
};

export default UserContext;
