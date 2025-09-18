import { useContext, useEffect, useState } from "react";
import { Auth } from "../context/AuthContext";
import { UserDataCtx } from "../context/UserContext";
import { ThumbsUp, MessageSquare } from "lucide-react";
import LikesModal from "./LikesModal";
import CommentsModal from "./CommentModal";
import { socket } from "../utils/socket.js";
import ConnectionButton from "./ConnectionButton";

const Post = ({ post }) => {
  const { serverUrl } = useContext(Auth);

  const { UserData,imageUrl,handleGetProfile } = useContext(UserDataCtx);

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const hasLiked = likes.some(
    (id) => id.toString() === UserData._id.toString()
  );

  const handlePostLike = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/posts/like/${post._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) return;
      const data = await response.json();
      setLikes(data.likes);
    } catch (err) {
      console.log("Error liking post:", err);
    }
  };

  useEffect(()=>{
    socket.on("likeUpdate",(data)=>{
      if(data.postId===post._id){
        setLikes(data.likes);
      }
    })
    return ()=>socket.off("likeUpdate");
  },[post._id])

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          {post.author?.picture ? (
            <img
              src={post.author.picture}
              alt="Author"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={imageUrl}
              alt="Author"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex justify-between w-full items-center">
          <div>
            <h4 className="font-semibold text-sm">
            {post.author?.firstname} {post.author?.lastname}
          </h4>
          <p className="text-xs text-gray-500">
            {post.author?.headline || "User"}
          </p>
          </div>
          
    {/* ✅ Connection button */}
    <ConnectionButton userId={post.author?._id} />
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-800 text-sm mb-3">{post.description}</p>

      {/* Image */}
      {post.image && (
        <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden mb-3">
          <img
            src={post.image}
            alt="Post content"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center text-gray-500 text-sm pt-2 border-t">
        {/* Like */}
        <button
          onClick={handlePostLike}
          className={`flex items-center gap-2 transition hover:cursor-pointer ${
            hasLiked ? "text-blue-600 font-semibold" : "hover:text-blue-500"
          }`}
        >
          <ThumbsUp
            size={18}
            className={hasLiked ? "fill-blue-600 text-blue-600" : ""}
          />
          Like
        </button>

        {/* Like Count */}
        {likes.length > 0 && (
          <span
            onClick={() => setShowLikesModal(true)}
            className="cursor-pointer text-gray-600 hover:underline"
          >
            {likes.length} Likes
          </span>
        )}

        {/* Comments */}
        <button
          onClick={() => setShowCommentsModal(true)}
          className="flex items-center gap-2 hover:text-blue-500 hover:cursor-pointer"
        >
          <MessageSquare size={18} />
          Comment {comments.length > 0 && <span>({comments.length})</span>}
        </button>

        <button className="hover:text-blue-500">Share</button>
      </div>

      {/* Likes Modal */}
      {showLikesModal && (
        <LikesModal
          postId={post._id}
          likes={likes}
          onClose={() => setShowLikesModal(false)}
        />
      )}

      {/* Comments Modal */}
      {showCommentsModal && (
        <CommentsModal
          postId={post._id}
          comments={comments}
          setComments={setComments}
          onClose={() => setShowCommentsModal(false)}
        />
      )}
    </div>
  );
};

export default Post;
