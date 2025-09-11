import Connection from "../models/connectionModel";
import User from "../models/userModel";

// Send a connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId=req.userId;
    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot connect with yourself." });
    }
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });
    if (existingConnection) {
      return res.status(400).json({ message: "Connection request already exists." });
    }
    const newConnection = new Connection({ sender: senderId, receiver: receiverId });
    await newConnection.save();
    res.status(201).json(newConnection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept a connection request
export const acceptConnectionRequest =async (req,res)=>{
  try{
    const { connectionId } = req.params;
    const connection = await Connection 
      .findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection request not found." });
    }
    if(connection.status!=='pending'){
      return res.status(400).json({ message: "Connection request is not pending its in under processing." });
    }
    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request." });
    }
    connection.status = 'accepted';
    await connection.save();
    await User.findByIdAndUpdate(req.userId, { $push: { connections: connection.sender } });
    await User.findByIdAndUpdate(connection.sender, { $push: { connections: req.userId } });
    res.status(200).json(connection);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
}

// Reject a connection request
export const rejectConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connection = await Connection
      .findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection request not found." });
    }
    if(connection.status!=='pending'){
      return res.status(400).json({ message: "Connection request is not pending its in under processing." });
    }
    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to reject this request." });
    }
    connection.status = 'rejected';
    await connection.save();
    res.status(200).json(connection);
  }
  catch (error) { 
    res.status(500).json({ message: error.message });
  }
};

// Get all connection requests for the logged-in user
export const getConnectionRequests = async (req, res) => {
  try {
    const connections = await Connection
      .find({ receiver: req.userId, status: 'pending' })
      .populate('sender', 'name email');
    res.status(200).json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

// remove a connection
export const removeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found." });
    }
    if (connection.status !== 'accepted') {
      return res.status(400).json({ message: "Connection is not active." });
    }
    if (connection.sender.toString() !== req.userId && connection.receiver.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not authorized to remove this connection." });
    }
    await Connection.findByIdAndDelete(connectionId);
    await User.findByIdAndUpdate(req.userId, { $pull: { connections: { $in: [connection.sender, connection.receiver] } } });
    await User.findByIdAndUpdate(connection.sender, { $pull: { connections: req.userId } });
    await User.findByIdAndUpdate(connection.receiver, { $pull: { connections: req.userId } });
    res.status(200).json({ message: "Connection removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};