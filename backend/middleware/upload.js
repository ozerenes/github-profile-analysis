/**
 * Multer config for CV (PDF) upload. Single field "cv", memory storage.
 * Limit from config (10MB) to match frontend and docs.
 */

const multer = require('multer');
const { config } = require('../config');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxPdfBytes },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype === 'application/pdf');
  },
});

function cvUpload(req, res, next) {
  upload.single('cv')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          Object.assign(new Error(`PDF must be under ${config.maxPdfMb}MB`), { status: 400 })
        );
      }
      if (
        err.code === 'LIMIT_UNEXPECTED_FILE' ||
        (err.message && err.message.includes('Unexpected field'))
      ) {
        return next(Object.assign(new Error('Upload field must be named "cv"'), { status: 400 }));
      }
      return next(Object.assign(new Error(err.message || 'Upload failed'), { status: 400 }));
    }
    next();
  });
}

module.exports = { cvUpload, upload };
