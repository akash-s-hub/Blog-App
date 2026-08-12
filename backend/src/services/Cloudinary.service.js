const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file, path) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `blog-app/${path}` },
      (error, result) => {
        if (error) {
          console.error("cloudinary upload error: ", error);
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });
}

async function deleteFromCloudinary(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("cloudinary delete error: ", error);
    // don't throw — a failed cleanup shouldn't block the user's update
  }
}

module.exports = { uploadToCloudinary, deleteFromCloudinary };