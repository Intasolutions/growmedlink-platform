import { Request, Response, NextFunction } from 'express';
import { Media } from '../models/Media.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/media.js';

// Magic bytes for raster image formats — guards against MIME type spoofing
const IMAGE_SIGNATURES: { mime: string; bytes: number[]; offset?: number }[] = [
  { mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },
  { mime: 'image/png',  bytes: [0x89, 0x50, 0x4E, 0x47] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF header
];

function validateImageMagicBytes(buffer: Buffer, mimetype: string): boolean {
  for (const sig of IMAGE_SIGNATURES) {
    if (sig.mime !== mimetype && !(mimetype === 'image/jpg' && sig.mime === 'image/jpeg')) continue;
    const offset = sig.offset ?? 0;
    return sig.bytes.every((b, i) => buffer[offset + i] === b);
  }
  return false;
}

function sanitiseFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
}

/**
 * Public upload for review photos — folder hardcoded to 'reviews', no auth required.
 * Applies magic-byte validation and filename sanitisation.
 */
export const uploadPublicReviewPhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    // Verify actual file content matches declared MIME type
    if (!validateImageMagicBytes(req.file.buffer, req.file.mimetype)) {
      res.status(400).json({ success: false, message: 'File content does not match the declared image type.' });
      return;
    }

    const safeFilename = sanitiseFilename(req.file.originalname);
    const uploadResult = await uploadToCloudinary(req.file.buffer, 'reviews', safeFilename);

    const media = new Media({
      filename: safeFilename,
      folder: 'reviews',
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      size: uploadResult.bytes || req.file.size,
      uploadedBy: null,
    });

    await media.save();

    res.status(201).json({ success: true, message: 'File uploaded successfully', data: media });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle image upload directly to Cloudinary and register in database
 */
export const uploadMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const folder = req.body.folder || 'general';

    // Upload to Cloudinary using streaming service
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      folder,
      req.file.originalname
    );

    // Save metadata in database
    const media = new Media({
      filename: req.file.originalname,
      folder,
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      size: uploadResult.bytes || req.file.size,
      uploadedBy: req.user?._id,
    });

    await media.save();

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: media,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * List all non-deleted media records (with folder filter option)
 */
export const listMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter: any = {};
    if (req.query.folder) {
      filter.folder = req.query.folder;
    }

    // Query documents. Soft-deleted ones are auto-filtered out by the plugin hooks.
    const mediaList = await Media.find(filter)
      .populate('uploadedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: mediaList,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete media record from database and destroy from Cloudinary
 */
export const deleteMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);
    if (!media) {
      res.status(404).json({ success: false, message: 'Media record not found or already deleted' });
      return;
    }

    // Remote deletion from Cloudinary
    await deleteFromCloudinary(media.publicId);

    // Mongoose schema soft delete invocation
    await media.softDelete();

    res.status(200).json({
      success: true,
      message: 'Media asset deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
