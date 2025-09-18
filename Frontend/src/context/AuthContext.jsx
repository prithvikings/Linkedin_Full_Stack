import React, { createContext } from "react";
export const Auth = createContext();

const AuthContext = ({ children }) => {
  const serverUrl = "https://linkedin-full-stack.onrender.com";

 

  let value = {
    serverUrl,
  };

  return <Auth.Provider value={value}>{children}</Auth.Provider>;
};

export default AuthContext;
