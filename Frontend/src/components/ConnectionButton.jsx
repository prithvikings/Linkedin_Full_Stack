import { useContext, useEffect, useState } from "react";
import { Auth } from "../context/AuthContext";
import { ConnectionCtx } from "../context/ConnectionContext";

const ConnectionButton = ({ userId }) => {
  const { serverUrl } = useContext(Auth);
  const { statuses, setStatuses } = useContext(ConnectionCtx);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/connections/status/${userId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setStatuses((prev) => ({ ...prev, [userId]: data.status }));
    } catch (err) {
      console.error("Error fetching status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [userId]);

  const status = statuses[userId] || "none";

  // Handlers
  const updateStatus = (newStatus) =>
    setStatuses((prev) => ({ ...prev, [userId]: newStatus }));

  const handleSend = async () => {
    const res = await fetch(`${serverUrl}/api/connections/request/${userId}`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) updateStatus("pending");
  };

  const handleAccept = async () => {
    const res = await fetch(`${serverUrl}/api/connections/accept/${userId}`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) updateStatus("connected");
  };

  const handleReject = async () => {
    const res = await fetch(`${serverUrl}/api/connections/reject/${userId}`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) updateStatus("none");
  };

  const handleRemove = async () => {
    const res = await fetch(`${serverUrl}/api/connections/remove/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) updateStatus("none");
  };

  if (loading) return <button className="px-4 py-2 bg-gray-300 rounded">Loading...</button>;
  if (status === "self") return null;

  return (
    <div>
      {status === "none" && (
        <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer">
          Connect
        </button>
      )}
      {status === "pending" && (
        <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition cursor-pointer" disabled>
          Pending
        </button>
      )}
      {status === "received" && (
        <div className="flex gap-2">
          <button onClick={handleAccept} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer">
            Accept
          </button>
          <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer">
            Reject
          </button>
        </div>
      )}
      {status === "connected" && (
        <button onClick={handleRemove} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition cursor-pointer">
          Remove
        </button>
      )}
    </div>
  );
};

export default ConnectionButton;
