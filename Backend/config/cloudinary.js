import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadoncloudinary = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  try {
    if (!file) return;
    const uploadResult = await cloudinary.uploader.upload(file);
    fs.unlinkSync(file);
    return uploadResult.secure_url;
  } catch (err) {
    fs.unlinkSync(file);
    console.error("Error uploading to Cloudinary:", err);
  }
};

export default uploadoncloudinary;
