import express from "express";
import { signup,signin, signout } from "../controllers/auth.controllers.js";

const authrouter=express.Router();


authrouter.post("/signup",signup);
authrouter.post("/signin",signin);
authrouter.post("/signout",signout);


export default authrouter;
