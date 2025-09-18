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
    const userId = req.userId;
    let {
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

    // Parse JSON fields
    if (education) {
      try {
        education = JSON.parse(education);
      } catch {
        education = [];
      }
    }
    if (experiences) {
      try {
        experiences = JSON.parse(experiences);
      } catch {
        experiences = [];
      }
    }

    // Handle skills (comma separated string -> array)
    if (skills && typeof skills === "string") {
      skills = skills.split(",").map((s) => s.trim());
    }

    const files = req.files || {};
    let profilePicture, coverPicture;

    if (files.profilePic) {
  profilePicture = await uploadoncloudinary(files.profilePic[0].path);
}
if (files.coverPic) {
  coverPicture = await uploadoncloudinary(files.coverPic[0].path);
}


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

   if (profilePicture) updateFields.picture = profilePicture; // ✅ string now
if (coverPicture) updateFields.cover = coverPicture; 


    let user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};


export const getProfileByUserName=async(req,res)=>{
    try{
        const {username}=req.params;
        const user=await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({
            success:true,
            message:"User profile fetched successfully",
            user
        });
    }catch(err){
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
}


export const search=async(req,res)=>{
  try{
    const {query}=req.query;
    if(!query || query.trim()===""){
      return res.status(400).json({ success: false, message: "Query parameter is required" });
    }
    const regex=new RegExp(query,"i");
    const users=await User.find({
      $or:[
        {firstname:regex},
        {lastname:regex},
        {username:regex},
        {headline:regex},
        {location:regex},
        {skills:regex}
      ]
    }).select("-password").limit(10);
    return res.status(200).json({
      success:true,
      message:"Search results fetched successfully",
      users
    });

  }catch(err){
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Server error, please try again later" });
  }
}


export const getSuggestedUsers=async(req,res)=>{
  try{
    let currentUser=await User.findById(req.userId).select('connections');
    let suggest=await User.find({_id: { $ne: req.userId, $nin: currentUser.connections }})
    .select('-password')
    .limit(5);
    return res.status(200).json({
      success:true,
      message:"Suggested users fetched successfully",
      suggest
    });
  }catch(err){
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Server error, please try again later" });
  }
}