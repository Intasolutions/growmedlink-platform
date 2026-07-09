import multer from 'multer';
import { Request } from 'express';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

// Stricter set for public (unauthenticated) uploads — no SVG to prevent XSS via SVG scripts
const PUBLIC_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Supported types are JPG, JPEG, PNG, WEBP, and SVG.'));
  }
};

const publicFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (PUBLIC_ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WEBP images are accepted.'));
  }
};

// Admin upload — 5 MB, all image types including SVG
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// Public upload — 2 MB, raster images only, no SVG
export const publicUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: publicFileFilter,
});

export default upload;
