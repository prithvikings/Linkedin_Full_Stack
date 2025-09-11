import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
  {
    text: { type: String, required: true },  // ✅ fix key name
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
],
  },
  { timestamps: true }
);

 const Post = mongoose.model("Post", postSchema);
export default Post;