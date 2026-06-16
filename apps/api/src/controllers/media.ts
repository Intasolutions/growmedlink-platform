import { Request, Response, NextFunction } from 'express';
import { Media } from '../models/Media.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/media.js';

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
