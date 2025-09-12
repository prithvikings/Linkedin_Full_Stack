import express from "express";
import {
  createPost,
  getFeedPosts,
  getMyPosts,
  like,
  getLikes,
  addComment,
  getComments,
  editComment,
  deleteComment
} from "../controllers/post.Controllers.js";
import { isAuth } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";


const postrouter=express.Router();


postrouter.post("/create",isAuth,upload.single("image"),createPost);
postrouter.get("/getfeed",isAuth,getFeedPosts);
postrouter.get("/myposts", isAuth, getMyPosts);
postrouter.post("/like/:id", isAuth, like);
postrouter.get("/likes/:id", isAuth, getLikes);
postrouter.post("/comment/:id", isAuth, addComment); // add
postrouter.get("/comments/:id", isAuth, getComments); // view
postrouter.put("/comment/:commentId", isAuth, editComment); // edit
postrouter.delete("/comment/:commentId", isAuth, deleteComment); // delete

export default postrouter;
