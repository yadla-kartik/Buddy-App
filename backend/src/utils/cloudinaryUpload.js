const { cloudinary, ensureConfigured } = require("../config/cloudinary");

const uploadImageBuffer = (buffer, options = {}) => {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );

    stream.end(buffer);
  });
};

module.exports = {
  uploadImageBuffer,
};

