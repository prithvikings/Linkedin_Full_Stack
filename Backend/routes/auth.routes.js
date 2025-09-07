import express from "express";
import { signup,signin, signout,verifyUser } from "../controllers/auth.controllers.js";


const authrouter=express.Router();


authrouter.post("/signup",signup);
authrouter.post("/signin",signin);
authrouter.get("/signout",signout);
authrouter.get("/verify",verifyUser)

export default authrouter;
