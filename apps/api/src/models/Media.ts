import { Schema, model, Document } from 'mongoose';
import { IMedia } from '@intelligen/types';
import { softDeletePlugin, SoftDeleteDocument } from './plugins/softDelete.js';

export interface MediaDocument extends Omit<IMedia, 'deletedAt' | '_id'>, SoftDeleteDocument, Document {}

const mediaSchema = new Schema(
  {
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true,
    },
    folder: {
      type: String,
      required: [true, 'Folder is required'],
      trim: true,
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
      unique: true,
      trim: true,
    },
    secureUrl: {
      type: String,
      required: [true, 'Secure URL is required'],
      trim: true,
    },
    width: {
      type: Number,
      required: [true, 'Width is required'],
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
    },
    size: {
      type: Number,
      required: [true, 'Size is required'],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploaded by user reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Register Soft Delete Plugin
mediaSchema.plugin(softDeletePlugin);

// Explicit Index Declarations
mediaSchema.index({ folder: 1 });

export const Media = model<MediaDocument>('Media', mediaSchema);
export default Media;
