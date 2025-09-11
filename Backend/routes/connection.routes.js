import express from 'express';
import {sendConnectionRequest,acceptConnectionRequest,rejectConnectionRequest,getConnectionRequests,removeConnection} from "../controllers/connection.controllers.js";
import {isAuth} from "../middlewares/isAuth.js";
let connectionrouter = express.Router();

connectionrouter.post('/request/:receiverId', isAuth, sendConnectionRequest);
connectionrouter.post('/accept/:connectionId', isAuth, acceptConnectionRequest);
connectionrouter.post('/reject/:connectionId', isAuth, rejectConnectionRequest);
connectionrouter.get('/requests', isAuth, getConnectionRequests);
connectionrouter.delete('/remove/:connectionId', isAuth, removeConnection);

export default connectionrouter;