// userouter.js

import express from "express";
import { getCurrentUser, updateUserProfile, getProfileByUserName, search } from "../controllers/usercontroller.js";
import { isAuth } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userouter = express.Router();

// Place the specific '/search' route before the dynamic ':username' route
userouter.get("/search", isAuth, search);

userouter.get("/me", isAuth, getCurrentUser);
userouter.get("/:username", isAuth, getProfileByUserName);

userouter.put("/updateprofile", isAuth, upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 }
]), updateUserProfile);

export default userouter;