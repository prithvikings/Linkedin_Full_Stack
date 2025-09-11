import express from 'express';
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectionRequests,
  getSentRequests,
  getConnections,
  removeConnection,
} from "../controllers/connection.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const connectionrouter = express.Router();

// Requests
connectionrouter.post('/request/:receiverId', isAuth, sendConnectionRequest);
connectionrouter.post('/accept/:connectionId', isAuth, acceptConnectionRequest);
connectionrouter.post('/reject/:connectionId', isAuth, rejectConnectionRequest);

// Fetch requests / connections
connectionrouter.get('/requests', isAuth, getConnectionRequests); // incoming
connectionrouter.get('/sent', isAuth, getSentRequests);           // outgoing
connectionrouter.get('/all', isAuth, getConnections);             // accepted

// Remove
connectionrouter.delete('/remove/:connectionId', isAuth, removeConnection);

export default connectionrouter;
