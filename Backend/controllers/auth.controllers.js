import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { validateSignUpData } from "./validate.js";
import jwt from "jsonwebtoken";

//Signup controller
export const signup = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    validateSignUpData(req);

    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ firstname, lastname, username, email, password: passwordHash });
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 8 * 3600000,
    });

    return res.status(201).json({ success: true, message: "User added successfully", data: savedUser });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Server error, please try again later" });
  }
};


// Signin controller
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 8 * 3600000, // 8h
    });

    return res.status(200).json({
      success: true,
      message: `${user.firstname} welcome back!`,
      data: user,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Server error, please try again later" });
  }
};


// Signout controller
export const signout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.send("Logout Successful!!");
  } catch (err) {
    console.error(err.message); // log on backend
    res.status(400).json({ success: false, message: err.message }); // ✅ send to frontend
  }
};



export const verifyUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User verified",
      user,
    });
  } catch (err) {
    console.error(err.message);

    // JWT expired/invalid → respond accordingly
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired, please log in again" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    return res.status(500).json({ success: false, message: "Server error, please try again later" });
  }
};
