import express from "express";
import { getCurrentUser,updateUserProfile } from "../controllers/usercontroller.js";
import { isAuth } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
const userouter = express.Router();

userouter.get("/me", isAuth, getCurrentUser);
userouter.put("/updateprofile", isAuth, upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 }
]),updateUserProfile);

export default userouter;