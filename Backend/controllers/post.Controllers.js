import Post from "../models/postModel.js";
import uploadoncloudinary from "../config/cloudinary.js";


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

    // repopulate to get user details + text
    const updatedPost = await Post.findById(req.params.id).populate(
      "comments.user",
      "firstname lastname picture"
    );

    res.status(200).json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get all comments of a post
export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments.user", "firstname lastname picture");
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

    // Find post containing this comment
    const post = await Post.findOne({ "comments._id": commentId });
    if (!post) return res.status(404).json({ message: "Comment not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Authorization
    if (comment.user.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this comment" });
    }

    // Update text
    comment.text = text;
    await post.save();

    // repopulate updated comments
    await post.populate("comments.user", "firstname lastname picture");

    res.status(200).json(post.comments); // return updated comments array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete comment
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

    // ✅ remove comment
    comment.remove();
    await post.save();

    // ✅ return updated comments array
    const updatedPost = await Post.findById(post._id).populate(
      "comments.user",
      "firstname lastname picture"
    );

    res.status(200).json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getUserPosts = async (req, res) => {
  try{
    const posts = await Post.find({author: req.params.userId}).populate("author").sort({createdAt: -1});
    res.status(200).json(posts);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

export const deletePost = async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message: "Post not found"});
    if(post.author.toString() !== req.userId) return res.status(403).json({message: "You are not authorized to delete this post"});
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "Post deleted successfully"});
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

export const editPost = async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message: "Post not found"});
    if(post.author.toString() !== req.userId) return res.status(403).json({message: "You are not authorized to edit this post"});
    const {description} = req.body;
    post.description = description || post.description;
    if(req.file){
      const image = await uploadoncloudinary(req.file.path);
      post.image = image;
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, post, {new: true});
    res.status(200).json(updatedPost);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

export const getPostById = async (req, res) => {
  try{
    const post = await Post.findById(req.params.id).populate("author").populate("comments.user");
    if(!post) return res.status(404).json({message: "Post not found"});
    res.status(200).json(post);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

