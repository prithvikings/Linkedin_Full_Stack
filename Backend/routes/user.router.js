// userouter.js

import express from "express";
import { getCurrentUser, updateUserProfile, getProfileByUserName, search, getSuggestedUsers } from "../controllers/usercontroller.js";
import { isAuth } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userouter = express.Router();

// CORRECTED: Place the specific '/search' and '/suggestedUsers' routes
// BEFORE the dynamic ':username' route.
userouter.get("/search", isAuth, search);
userouter.get("/suggestedUsers", isAuth, getSuggestedUsers);

userouter.get("/me", isAuth, getCurrentUser);
userouter.get("/:username", isAuth, getProfileByUserName);

userouter.put("/updateprofile", isAuth, upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 }
]), updateUserProfile);

export default userouter;