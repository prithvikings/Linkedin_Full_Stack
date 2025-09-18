// notification.controllers.js

import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
    try {
        let notifications = await Notification.find({ receiver: req.userId })
            .populate('relatedUser', "firstname lastname picture") 
            .populate("relatedPost", "image description");

        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

export const deleteNotifications = async (req, res) => {
    try {
        let { id } = req.params;
        let notification = await Notification.findByIdAndDelete({
            _id: id,
            receiver: req.userId
        });
        if (!notification) {
            return res.status(404).json({ success: false, message: "No notification found" });
        }
        res.status(200).json({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}


export const clearAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ receiver: req.userId });
        res.status(200).json({ success: true, message: "All notifications cleared" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}