import cloudinary from '../config/cloudinary.js';

/* Upload Single Image */
export const uploadSingleToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {

    if (!fileBuffer) {
      return reject(new Error("File buffer is required"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "rozseva/categories", // Specify the folder in Cloudinary where the image will be stored
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

