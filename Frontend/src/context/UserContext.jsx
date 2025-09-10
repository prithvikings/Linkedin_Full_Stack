import React, { createContext, useEffect, useState, useContext } from "react";
import { Auth } from "../context/AuthContext";

export const UserDataCtx = createContext();

const UserContext = ({ children }) => {
  const [UserData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ add loading
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const { serverUrl } = useContext(Auth);
  const [createPostmodal, setcreatePostmodal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(serverUrl + "/api/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ send cookie
        });
        const data = await res.json();
        if (res.ok) {
          setUserData(data.user); // ✅ set user from backend
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserData(null);
      } finally {
        setLoading(false); // ✅ stop loading
      }
    };

    fetchUserData();
  }, [serverUrl]);

  return (
    <UserDataCtx.Provider value={{ UserData, setUserData, loading , editProfileOpen, setEditProfileOpen, createPostmodal, setcreatePostmodal}}>
      {children}
    </UserDataCtx.Provider>
  );
};

export default UserContext;
