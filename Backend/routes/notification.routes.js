import express from "express";
const notificationRouter = express.Router();
import { getNotifications,deleteNotifications,clearAllNotifications } from "../controllers/notification.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";

notificationRouter.get("/get",isAuth, getNotifications);
notificationRouter.delete("/delete/:id",isAuth, deleteNotifications);
notificationRouter.delete("/clear",isAuth, clearAllNotifications);
export default notificationRouter;