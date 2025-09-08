import User from "../models/userModel.js";


export const getCurrentUser=async(req,res)=>{
    try{
        const userId=req.userId;
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success:true,
            message:"Current user fetched successfully",
            user
        });


    }catch(err){
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
}