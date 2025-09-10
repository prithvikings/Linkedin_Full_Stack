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