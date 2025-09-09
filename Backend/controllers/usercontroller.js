import User from "../models/userModel.js";
import uploadoncloudinary from "../config/cloudinary.js";

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


export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const {
      firstname,
      lastname,
      headline,
      bio,
      email,
      username,
      location,
      skills,
      education,
      experiences
    } = req.body;

    const files = req.files || {};
    let profilePicture, coverPicture;

    if (files.profilePicture) {
      profilePicture = await uploadoncloudinary(files.profilePicture[0].path);
    }
    if (files.coverPicture) {
      coverPicture = await uploadoncloudinary(files.coverPicture[0].path);
    }

    // Build update object dynamically
    const updateFields = {
      firstname,
      lastname,
      headline,
      bio,
      email,
      username,
      location,
      skills,
      education,
      experiences,
    };

    if (profilePicture) updateFields.picture = profilePicture.url;
    if (coverPicture) updateFields.cover = coverPicture.url;

    let user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true, // <-- important for Mongoose validation
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (err) {
    console.error("Update profile error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};
