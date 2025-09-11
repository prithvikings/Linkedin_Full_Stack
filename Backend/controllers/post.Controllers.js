import Post from "../models/postModel.js";
import uploadoncloudinary from "../config/cloudinary.js";
import { io } from "../index.js";


export const createPost = async (req, res) => {
  try{

    let {description} = req.body;
    let newPost;
    if(req.file){
      const image = await uploadoncloudinary(req.file.path);
       newPost = new Post({
        author: req.userId,
        description,
        image
      });
      await newPost.save();
      res.status(201).json(newPost);
    }
    else{
      newPost = new Post({
        author: req.userId,
        description
      });
      await newPost.save();
      res.status(201).json(newPost);
    }
  }catch(err){
    res.status(500).json({error: err.message});
  }
}
export const getFeedPosts = async (req, res) => {
  try{
    const posts = await Post.find().populate("author").sort({createdAt: -1});
    res.status(200).json(posts);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

// ✅ Toggle like/unlike
export const like = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId; // comes from isAuth middleware

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // check if already liked
    if (post.likes.includes(userId)) {
      // unlike → remove userId
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // like → add userId
      post.likes.push(userId);
    }
    await post.save();
    io.emit("likeUpdate", { postId, userId, likes: post.likes });
    
    // populate likes count and author for frontend
    const updatedPost = await Post.findById(postId)
      .populate("author", "firstname lastname picture headline")
      .populate("likes", "firstname lastname");

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getLikes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "likes",
      "firstname lastname picture headline"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post.likes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Add comment
export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { text } = req.body;
    if (!text || text.trim() === "")
      return res.status(400).json({ message: "Comment cannot be empty" });

    post.comments.push({ user: req.userId, text });
    await post.save();

    // repopulate with user details
    const updatedPost = await Post.findById(req.params.id).populate(
      "comments.user",
      "firstname lastname picture"
    );

    // ✅ emit socket event
    io.emit("commentAdded", {
      postId: req.params.id,
      comments: updatedPost.comments,
    });

    res.status(200).json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all comments of a post
export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "comments.user",
      "firstname lastname picture"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit comment
export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const post = await Post.findOne({ "comments._id": commentId });
    if (!post) return res.status(404).json({ message: "Comment not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Authorization
    if (comment.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update text
    comment.text = text;
    await post.save();

    await post.populate("comments.user", "firstname lastname picture");

    // ✅ emit socket event
    io.emit("commentEdited", {
      postId: post._id,
      comments: post.comments,
    });

    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const post = await Post.findOne({ "comments._id": commentId });
    if (!post) return res.status(404).json({ message: "Comment not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // check ownership
    if (comment.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ remove comment correctly
    post.comments.pull(commentId);
    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      "comments.user",
      "firstname lastname picture"
    );

    // ✅ emit socket event
    io.emit("commentDeleted", {
      postId: post._id,
      comments: updatedPost.comments,
    });

    res.status(200).json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
