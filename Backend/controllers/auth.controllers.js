import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { validateSignUpData } from "./validate.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    validateSignUpData(req);
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("Email already exists");

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();
    const token = await jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true, // prevents JS access
      secure: true, // ✅ required for HTTPS
      sameSite: "None",
    });

    res
      .status(201)
      .json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    console.log(err);
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid email or password");

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res
      .status(200)
      .json({ message: `${user.firstname} welcome back!`, data: user });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

export const signout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.send("Logout Successful!!");
  } catch (err) {
    console.log(err.message);
  }
};
