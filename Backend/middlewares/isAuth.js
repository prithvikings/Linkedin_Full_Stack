
import jwt from "jsonwebtoken";

export const isAuth = async (req, res,next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(404).json({ success: false, message: "token not found" });
    }
    req.userId = decoded.id; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
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
