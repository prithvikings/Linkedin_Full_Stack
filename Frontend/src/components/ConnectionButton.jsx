import { useContext, useEffect, useState } from "react";
import { Auth } from "../context/AuthContext";
import { socket } from "../utils/socket";

const ConnectionButton = ({ userId }) => {
  const { serverUrl } = useContext(Auth);
  const [status, setStatus] = useState("loading"); // "none", "pending", "received", "connected", "self"

  // Fetch initial connection status
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/connections/status/${userId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setStatus(data.status);
    } catch (err) {
      console.error("Error fetching status:", err);
    }
  };

  useEffect(() => {
    fetchStatus();

    socket.on("statusUpdate", (data) => {
      if (data.updatedUserId === userId) {
        setStatus(data.status);
      }
    });

    return () => socket.off("statusUpdate");
  }, [userId]);

  // Handlers
  const handleSend = async () => {
    await fetch(`${serverUrl}/api/connections/request/${userId}`, {
      method: "POST",
      credentials: "include",
    });
    fetchStatus();
  };

  const handleAccept = async () => {
    await fetch(`${serverUrl}/api/connections/accept/${userId}`, {
      method: "POST",
      credentials: "include",
    });
    fetchStatus();
  };

  const handleReject = async () => {
    await fetch(`${serverUrl}/api/connections/reject/${userId}`, {
      method: "POST",
      credentials: "include",
    });
    fetchStatus();
  };

  const handleRemove = async () => {
    await fetch(`${serverUrl}/api/connections/remove/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchStatus();
  };

  // Render
  if (status === "loading") return <button className="px-4 py-2 bg-gray-300 rounded">Loading...</button>;
  if (status === "self") return null;

  return (
    <div>
      {status === "none" && (
        <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded">
          Connect
        </button>
      )}
      {status === "pending" && (
        <button className="px-4 py-2 bg-yellow-500 text-white rounded" disabled>
          Pending
        </button>
      )}
      {status === "received" && (
        <div className="flex gap-2">
          <button onClick={handleAccept} className="px-4 py-2 bg-green-600 text-white rounded">
            Accept
          </button>
          <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded">
            Reject
          </button>
        </div>
      )}
      {status === "connected" && (
        <button onClick={handleRemove} className="px-4 py-2 bg-gray-600 text-white rounded">
          Remove
        </button>
      )}
    </div>
  );
};

export default ConnectionButton;
