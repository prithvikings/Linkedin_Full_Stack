import React, { createContext } from "react";

export const Auth = createContext();

const AuthContext = ({ children }) => {
  const serverUrl = "http://localhost:3000";

 

  let value = {
    serverUrl,
  };

  return <Auth.Provider value={value}>{children}</Auth.Provider>;
};

export default AuthContext;
