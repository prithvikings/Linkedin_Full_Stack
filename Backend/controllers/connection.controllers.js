import Connection from "../models/connectionModel.js";
import User from "../models/userModel.js";

// Send a connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.userId;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot connect with yourself." });
    }

    // check existing
    const existing = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: `Connection already ${existing.status}.` });
    }

    const newConnection = await Connection.create({ sender: senderId, receiver: receiverId });

    res.status(201).json(
      await newConnection.populate("sender receiver", "firstname lastname email picture")
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept a connection request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connection = await Connection.findById(connectionId);

    if (!connection) return res.status(404).json({ message: "Request not found." });
    if (connection.status !== "pending") return res.status(400).json({ message: "Request already processed." });
    if (connection.receiver.toString() !== req.userId) return res.status(403).json({ message: "Not authorized." });

    connection.status = "accepted";
    await connection.save();

    await User.findByIdAndUpdate(connection.sender, { $push: { connections: connection.receiver } });
    await User.findByIdAndUpdate(connection.receiver, { $push: { connections: connection.sender } });

    res.status(200).json(
      await connection.populate("sender receiver", "firstname lastname email picture")
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject a connection request
export const rejectConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connection = await Connection.findById(connectionId);

    if (!connection) return res.status(404).json({ message: "Request not found." });
    if (connection.status !== "pending") return res.status(400).json({ message: "Already processed." });
    if (connection.receiver.toString() !== req.userId) return res.status(403).json({ message: "Not authorized." });

    connection.status = "rejected";
    await connection.save();

    res.status(200).json(
      await connection.populate("sender receiver", "firstname lastname email picture")
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Incoming requests
export const getConnectionRequests = async (req, res) => {
  try {
    const requests = await Connection.find({ receiver: req.userId, status: "pending" })
      .populate("sender", "firstname lastname email picture");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sent requests
export const getSentRequests = async (req, res) => {
  try {
    const requests = await Connection.find({ sender: req.userId, status: "pending" })
      .populate("receiver", "firstname lastname email picture");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// All accepted connections
export const getConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }],
      status: "accepted",
    }).populate("sender receiver", "firstname lastname email picture");

    res.status(200).json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a connection
export const removeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connection = await Connection.findById(connectionId);

    if (!connection) return res.status(404).json({ message: "Connection not found." });
    if (connection.status !== "accepted") return res.status(400).json({ message: "Not an active connection." });
    if (![connection.sender.toString(), connection.receiver.toString()].includes(req.userId)) {
      return res.status(403).json({ message: "Not authorized." });
    }

    await Connection.findByIdAndDelete(connectionId);

    await User.findByIdAndUpdate(connection.sender, { $pull: { connections: connection.receiver } });
    await User.findByIdAndUpdate(connection.receiver, { $pull: { connections: connection.sender } });

    res.status(200).json({ message: "Connection removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
