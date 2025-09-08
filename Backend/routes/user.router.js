import express from "express";
import { getCurrentUser } from "../controllers/usercontroller.js";
import { isAuth } from "../middlewares/isAuth.js";

const userouter = express.Router();

userouter.get("/me", isAuth, getCurrentUser);

export default userouter;