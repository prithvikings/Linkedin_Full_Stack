import Connection from "../models/connectionModel.js";
import User from "../models/userModel.js";
import { io, userSocketMap } from "../index.js";
import Notification from "../models/notificationModel.js";

// 🔹 Helper: emit status update safely
const emitStatus = (targetUserId, updatedUserId, status) => {
  const socketId = userSocketMap.get(targetUserId);
  if (socketId) {
    io.to(socketId).emit("statusUpdate", { updatedUserId, status });
  }
};

const emitConnectionUpdate = (userId) => {
  const socketId = userSocketMap.get(userId);
  if (socketId) {
    io.to(socketId).emit("connectionUpdate"); // just notify, frontend will refetch
  }
};


// 🔹 Send connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId: receiverId } = req.params;
    const senderId = req.userId;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot connect with yourself." });
    }

    const existing = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: `Connection already ${existing.status}.` });
    }

    let notification = await Notification.create({
      receiver: receiverId,
      relatedUser: senderId,
      type: "connectionrequest",
    });
    const newConnection = await Connection.create({ sender: senderId, receiver: receiverId });

    const populated = await newConnection.populate("sender receiver", "firstname lastname email picture");
    res.status(201).json(populated);

    emitStatus(receiverId, senderId, "received"); // receiver sees "received"
    emitStatus(senderId, receiverId, "pending");  // sender sees "pending"
    emitConnectionUpdate(receiverId);
emitConnectionUpdate(senderId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Accept connection request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { userId: senderId } = req.params;      // sender of request
    const receiverId = req.userId;                // current user (receiver)

    const connection = await Connection.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (!connection) {
      return res.status(404).json({ message: "Request not found." });
    }

    connection.status = "accepted";
    let notification = await Notification.create({
      receiver: connection.sender,
      relatedUser: receiverId,
      type: "connectionAccepted",
    });
    await connection.save();

    await User.findByIdAndUpdate(senderId, { $addToSet: { connections: receiverId } });
    await User.findByIdAndUpdate(receiverId, { $addToSet: { connections: senderId } });

    const populated = await connection.populate("sender receiver", "firstname lastname email picture");
    
    res.status(200).json(populated);

    emitStatus(senderId, receiverId, "connected");
    emitStatus(receiverId, senderId, "connected");
    emitConnectionUpdate(senderId);
emitConnectionUpdate(receiverId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Reject connection request
export const rejectConnectionRequest = async (req, res) => {
  try {
    const { userId: senderId } = req.params;
    const receiverId = req.userId;

    const connection = await Connection.findOneAndDelete({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (!connection) {
      return res.status(404).json({ message: "Request not found." });
    }

    res.status(200).json({ message: "Request rejected." });
    emitStatus(senderId, receiverId, "none");
    emitConnectionUpdate(senderId);
emitConnectionUpdate(receiverId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Remove an existing connection
export const removeConnection = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const currentUserId = req.userId;

    const connection = await Connection.findOneAndDelete({
      $or: [
        { sender: currentUserId, receiver: otherUserId, status: "accepted" },
        { sender: otherUserId, receiver: currentUserId, status: "accepted" },
      ],
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found." });
    }

    await User.findByIdAndUpdate(connection.sender, { $pull: { connections: connection.receiver } });
    await User.findByIdAndUpdate(connection.receiver, { $pull: { connections: connection.sender } });

    res.status(200).json({ message: "Connection removed successfully." });

    emitStatus(otherUserId, currentUserId, "none");
    emitStatus(currentUserId, otherUserId, "none");
    emitConnectionUpdate(otherUserId);
emitConnectionUpdate(currentUserId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get connection status between two users
export const getConnectionStatus = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const currentUserId = req.userId;

    if (otherUserId === currentUserId) {
      return res.json({ status: "self" });
    }

    const connection = await Connection.findOne({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    });

    if (!connection) return res.json({ status: "none" });

    if (connection.status === "pending") {
      return res.json({
        status: connection.sender.toString() === currentUserId ? "pending" : "received",
      });
    }

    if (connection.status === "accepted") {
      return res.json({ status: "connected" });
    }

    return res.json({ status: "none" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all pending requests for the logged-in user
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Connection.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "firstname lastname email picture");

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all connections for the logged-in user
export const getAllConnections = async (req, res) => {
  try {
    const userId = req.userId;

    const connections = await Connection.find({
      $or: [
        { sender: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    })
      .populate("sender", "firstname lastname email picture")
      .populate("receiver", "firstname lastname email picture");

    res.status(200).json({ connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
