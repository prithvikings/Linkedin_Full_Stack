import React from 'react'

const Post = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Author info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          {post.author?.picture ? (
            <img
              src={post.author.picture}
              alt="Author"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-400"></div>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-sm">
            {post.author?.firstname} {post.author?.lastname}
          </h4>
          <p className="text-xs text-gray-500">
            {post.author?.headline || "User"}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-800 text-sm mb-3">{post.description}</p>

      {/* Image if available */}
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
      <div className="flex justify-between text-gray-500 text-sm pt-2 border-t">
        <button className="hover:text-blue-500">Like</button>
        <button className="hover:text-blue-500">Comment</button>
        <button className="hover:text-blue-500">Share</button>
      </div>
    </div>
  );
};

export default Post