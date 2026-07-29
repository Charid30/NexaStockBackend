// src/middlewares/upload.middleware.js
const multer = require('multer');
const path   = require('path');
const crypto = require('crypto');

const storage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, `src/uploads/${folder}`),
  filename:    (req, file, cb) => {
    const ext      = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    cb(null, filename);
  },
});

const imageFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  cb(new Error('Format de fichier non autorisé. Utilisez JPG, PNG ou WEBP.'));
};

const uploadLogo    = multer({ storage: storage('logos'),    fileFilter: imageFilter, limits: { fileSize: 2 * 1024 * 1024 } }).single('logo');
const uploadProduct = multer({ storage: storage('products'), fileFilter: imageFilter, limits: { fileSize: 2 * 1024 * 1024 } }).single('image');

module.exports = { uploadLogo, uploadProduct };
