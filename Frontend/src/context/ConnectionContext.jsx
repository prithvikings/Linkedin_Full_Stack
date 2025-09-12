import React, { createContext, useState, useEffect, useContext } from "react";
import { socket } from "../utils/socket";
import { UserDataCtx } from "./UserContext";

export const ConnectionCtx = createContext();

const ConnectionProvider = ({ children }) => {
  const { UserData } = useContext(UserDataCtx);
  const [statuses, setStatuses] = useState({}); 
  // { "userId123": "pending", "userId456": "connected" }

  useEffect(() => {
    if (!UserData?._id) return;

    socket.emit("register", UserData._id);

    socket.on("statusUpdate", ({ updatedUserId, status }) => {
      setStatuses((prev) => ({
        ...prev,
        [updatedUserId]: status,
      }));
    });

    return () => socket.off("statusUpdate");
  }, [UserData]);

  return (
    <ConnectionCtx.Provider value={{ statuses, setStatuses}}>
      {children}
    </ConnectionCtx.Provider>
  );
};

export default ConnectionProvider;
