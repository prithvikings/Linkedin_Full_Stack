import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
    try {

        let notification=await Notification.find({receiver:req.userId}).populate('relatedUser',"firstName lastName profilePicture")
        .populate("relatedPost","image description")
    
    
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}


export const deleteNotifications = async (req, res) => {
    try {
        let {id}=req.params
        let notification=await Notification.findByIdAndDelete({
            _id:id,
            receiver:req.userId
        })
        if(!notification){
            return res.status(404).json({message:"No notification found"})
        }
        res.status(200).json({message:"Notification deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}


export const clearAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({receiver:req.userId})
        res.status(200).json({message:"All notifications cleared"})
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}