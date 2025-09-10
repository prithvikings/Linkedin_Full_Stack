import React, { useRef, useState, useContext } from "react";
import { RxCross1 } from "react-icons/rx";
import { UserDataCtx } from "../context/UserContext";
import { Auth } from "../context/AuthContext";

const Createpost = () => {
  const { createPostmodal, setcreatePostmodal } = useContext(UserDataCtx); 
  const { serverUrl } = useContext(Auth);

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [frontendPostImage, setFrontendPostImage] = useState("");
  const [backendPostImage, setBackendPostImage] = useState(null);

  const postImageRef = useRef();

  if (!createPostmodal) return null;

  const handleClose = () => setcreatePostmodal(false);

  // Image handler
  const handlePostImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFrontendPostImage(URL.createObjectURL(file));
      setBackendPostImage(file);
    }
  };

  // Save post
  const handleSavePost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("description", description);
      if (backendPostImage) formData.append("image", backendPostImage);

      const res = await fetch(`${serverUrl}/api/posts/create`, {
        method: "POST",
        body: formData,
        credentials: "include", // for cookies
      });

      const data = await res.json();
      console.log("Post created:", data);

      setLoading(false);
      handleClose();
    } catch (err) {
      console.error("Error creating post:", err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed w-full h-[100vh] top-0 left-0 z-[100] flex justify-center items-center">
      {/* Background overlay */}
      <div
        onClick={handleClose}
        className="w-full h-full bg-black opacity-50 absolute"
      ></div>

      {/* Modal */}
      <div className="w-[90%] h-[90%] max-w-[500px] bg-white absolute z-[200] shadow-lg rounded-lg p-4 flex flex-col items-start gap-4 overflow-y-auto">
        {/* Close button */}
        <RxCross1
          className="absolute top-4 right-4 cursor-pointer"
          onClick={handleClose}
        />

        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

        {/* Image preview */}
        <div
          onClick={() => postImageRef.current.click()}
          className="bg-gray-200 w-full h-[50%] flex justify-around items-center rounded-md cursor-pointer"
        >
          {frontendPostImage ? (
            <img
              src={frontendPostImage}
              alt="Post"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <span className="text-gray-600">Click to upload an image</span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={postImageRef}
          onChange={handlePostImageChange}
          className="hidden"
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write something..."
          className="border border-gray-300 rounded-md p-2 resize-none outline-none focus:border-blue-500 w-full mt-4 h-[20%]"
        ></textarea>

        {/* Submit */}
        <button
          disabled={loading}
          onClick={handleSavePost}
          className={`w-1/2 cursor-pointer mt-4 py-2 rounded-md text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default Createpost;
