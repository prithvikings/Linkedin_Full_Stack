import { useEffect, useState, useContext } from "react";
import { Auth } from "../context/AuthContext";

const LikesModal = ({ postId, onClose }) => {
  const { serverUrl } = useContext(Auth);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/posts/likes/${postId}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setLikes(data);
      } catch (err) {
        console.log("Error fetching likes:", err);
      }
    };
    fetchLikes();
  }, [postId, serverUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[70vh] overflow-y-auto shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Liked by</h2>
        {likes.length > 0 ? (
          likes.map((user) => (
            <div key={user._id} className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400"></div>
                )}
              </div>
              <div>
                <p className="font-medium">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-sm text-gray-500">{user.headline || "User"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No likes yet</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LikesModal;
