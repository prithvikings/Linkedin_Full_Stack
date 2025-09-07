import React, { createContext, useEffect, useState } from "react";

export const Auth = createContext();

const AuthContext = ({ children }) => {
  const serverUrl = "http://localhost:3000";
  const [isloggedin, setIsloggedin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(serverUrl + "/api/auth/verify", {
          method: "GET",
          credentials: "include", // ✅ send cookies
        });
        const data = await res.json();
        console.log(data);
        if (data.success) {
          setIsloggedin(true);
        } else {
          setIsloggedin(false);
        }
      } catch (err) {
        setIsloggedin(false);
        console.error("Error verifying user:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  let value = {
    serverUrl,
    isloggedin,
    setIsloggedin,
    loading,
  };

  return <Auth.Provider value={value}>{children}</Auth.Provider>;
};

export default AuthContext;
