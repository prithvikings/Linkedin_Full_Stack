import express from "express";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  getConnectionStatus,   // ✅ this exists
} from "../controllers/connection.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const connectionrouter = express.Router();

// Requests
connectionrouter.post("/request/:userId", isAuth, sendConnectionRequest);
connectionrouter.post("/accept/:userId", isAuth, acceptConnectionRequest);
connectionrouter.post("/reject/:userId", isAuth, rejectConnectionRequest);

// Status
connectionrouter.get("/status/:userId", isAuth, getConnectionStatus);

// Remove
connectionrouter.delete("/remove/:userId", isAuth, removeConnection);

export default connectionrouter;
