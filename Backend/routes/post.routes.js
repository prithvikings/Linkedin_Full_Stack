import express from "express";
import { createPost,getFeedPosts } from "../controllers/post.Controllers.js";
import { isAuth } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";


const postrouter=express.Router();


postrouter.post("/create",isAuth,upload.single("image"),createPost);
postrouter.get("/getfeed",isAuth,getFeedPosts);

export default postrouter;
