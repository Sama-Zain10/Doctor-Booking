import multer from "multer";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      const err = new Error("Only JPG, PNG or WEBP images are allowed");
      err.statusCode = 400;
      return cb(err);
    }
    cb(null, true);
  },
}).single("avatar");

export const handleAvatarUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE") {
      return next({ message: "Image must be 2MB or less", statusCode: 400 });
    }
    next({ message: err.message, statusCode: err.statusCode || 400 });
  });
};