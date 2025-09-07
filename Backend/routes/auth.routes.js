import express from "express";
import { signup,signin, signout } from "../controllers/auth.controllers.js";

const authrouter=express.Router();


authrouter.post("/signup",signup);
authrouter.post("/signin",signin);
authrouter.get("/signout",signout);


export default authrouter;
