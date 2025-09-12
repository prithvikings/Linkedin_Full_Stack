import React, { useEffect, useState, useContext } from "react";
import { Auth } from "../context/AuthContext";
import { socket } from "../utils/socket";
import { UserDataCtx } from "../context/UserContext";

const Network = () => {
  const { serverUrl } = useContext(Auth);
  const { imageUrl } = useContext(UserDataCtx);
  const [incoming, setIncoming] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch requests + connections
  const fetchNetwork = async () => {
    try {
      const [reqRes, connRes] = await Promise.all([
        fetch(`${serverUrl}/api/connections/requests`, { credentials: "include" }),
        fetch(`${serverUrl}/api/connections/all`, { credentials: "include" }),
      ]);

      const reqData = await reqRes.json();
      const connData = await connRes.json();

      if (reqRes.ok) setIncoming(reqData.requests || []);
      if (connRes.ok) setConnections(connData.connections || []);
    } catch (err) {
      console.error("Error fetching network:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetwork();

    // 🔹 Realtime updates
    socket.on("connectionUpdate", () => {
      fetchNetwork();
    });

    return () => {
      socket.off("connectionUpdate");
    };
  }, []);

  // 🔹 Handlers
  const handleAccept = async (id) => {
    await fetch(`${serverUrl}/api/connections/accept/${id}`, {
      method: "POST",
      credentials: "include",
    });
    fetchNetwork();
  };

  const handleReject = async (id) => {
    await fetch(`${serverUrl}/api/connections/reject/${id}`, {
      method: "POST",
      credentials: "include",
    });
    fetchNetwork();
  };

  const handleRemove = async (id) => {
    await fetch(`${serverUrl}/api/connections/remove/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchNetwork();
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="w-full min-h-screen p-16 px-48 bg-[#f5f3f0] flex flex-col gap-8">
      {/* Incoming requests */}
      <section>
        <h2 className="text-xl font-bold mb-4">Connection Requests</h2>
        {incoming.length === 0 ? (
          <p className="text-gray-600">No pending requests</p>
        ) : (
          <div className="grid gap-4">
            {incoming.map((req) => (
              <div
                key={req._id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={req.sender.picture || imageUrl}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">
                      {req.sender.firstname} {req.sender.lastname}
                    </p>
                    <p className="text-sm text-gray-500">{req.sender.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(req.sender._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer transition-colors duration-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(req.sender._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition-colors duration-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Connections */}
      <section>
        <h2 className="text-xl font-bold mb-4">My Connections</h2>
        {connections.length === 0 ? (
          <p className="text-gray-600">You have no connections</p>
        ) : (
          <div className="grid gap-4">
            {connections.map((conn) => {
              const other =
                conn.sender._id === conn.receiver._id
                  ? conn.receiver
                  : conn.sender._id === conn.receiver._id
                  ? conn.sender
                  : conn.sender; // fallback

              return (
                <div
                  key={conn._id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={other.picture || imageUrl}
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">
                        {other.firstname} {other.lastname}
                      </p>
                      <p className="text-sm text-gray-500">{other.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(other._id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Network;
