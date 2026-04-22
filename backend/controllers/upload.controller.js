const cloudinary = require("../config/cloudinary");

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = "luxury-interiors") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// ─── POST /api/upload/image (single) ─────────────────────────────────────────
const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No image file provided.");
      error.statusCode = 400;
      return next(error);
    }

    const folder = req.query.folder || "luxury-interiors/general";
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/upload/images (multiple) ──────────────────────────────────────
const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      const error = new Error("No image files provided.");
      error.statusCode = 400;
      return next(error);
    }

    const folder = req.query.folder || "luxury-interiors/general";

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, folder)
    );

    const results = await Promise.all(uploadPromises);

    const urls = results.map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
      width: r.width,
      height: r.height,
    }));

    res.status(200).json({
      success: true,
      count: urls.length,
      images: urls,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/upload/delete (delete from Cloudinary) ──────────────────────
const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      const error = new Error("Public ID is required.");
      error.statusCode = 400;
      return next(error);
    }

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ success: true, message: "Image deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadSingleImage, uploadMultipleImages, deleteImage };