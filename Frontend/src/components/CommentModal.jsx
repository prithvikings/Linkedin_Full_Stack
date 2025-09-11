import { useContext, useEffect, useState } from "react";
import { Auth } from "../context/AuthContext";
import { UserDataCtx } from "../context/UserContext";

const CommentsModal = ({ postId, comments, setComments, onClose }) => {
  const { serverUrl } = useContext(Auth);
  const { UserData } = useContext(UserDataCtx);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  // fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/posts/comments/${postId}`, {
          credentials: "include",
        });
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.log("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [postId]);

  // add comment
  const handleAdd = async () => {
    if (!newComment.trim()) return;
    const res = await fetch(`${serverUrl}/api/posts/comment/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text: newComment }),
    });
    const data = await res.json();
    setComments(data); // backend sends full updated comments
    setNewComment("");
  };

  // edit comment
const handleEdit = async (commentId) => {
  const res = await fetch(`${serverUrl}/api/posts/comment/${commentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ text: newComment }),
  });
  const data = await res.json(); 
  setComments(data); // ✅ always replace with backend array
  setNewComment("");
  setEditingComment(null);
};

// delete comment
  // delete comment
  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(`${serverUrl}/api/posts/comment/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error deleting comment:", err);
    }
  };




  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md w-[500px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3">Comments</h2>

        {comments.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet</p>
        )}

        {comments.map((c) => (
          <div key={c._id} className="flex items-start gap-2 mb-3">
            <img
              src={c.user?.picture || "/default-avatar.png"}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {c.user?.firstname} {c.user?.lastname}
              </p>
              <p className="text-gray-700 text-sm">{c.text}</p>

              {c.user?._id === UserData._id && (
                <div className="text-xs text-blue-500 flex gap-2 cursor-pointer mt-1">
                  <span
                    onClick={() => {
                      setEditingComment(c._id);
                      setNewComment(c.text);
                    }}
                  >
                    Edit
                  </span>
                  <span onClick={() => handleDelete(c._id)}>Delete</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Input for add/edit */}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 border px-2 py-1 rounded"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {editingComment ? (
            <button
              onClick={() => handleEdit(editingComment)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Update
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Post
            </button>
          )}
        </div>

        <button onClick={onClose} className="mt-4 text-sm text-red-500">
          Close
        </button>
      </div>
    </div>
  );
};

export default CommentsModal;
