const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/zip",
    "application/x-zip-compressed",
    "application/octet-stream"
  ];
  if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.zip')) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed. Please upload images or a ZIP file."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 50MB max for zip uploads
});

module.exports = upload;