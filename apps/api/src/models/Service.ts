import { Schema, model, Document } from 'mongoose';
import { IService } from '@intelligen/types';
import { SERVICE_CATEGORIES } from '@intelligen/constants';
import { softDeletePlugin, SoftDeleteDocument } from './plugins/softDelete.js';

export interface ServiceDocument extends Omit<IService, 'deletedAt' | '_id'>, SoftDeleteDocument, Document {}

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [SERVICE_CATEGORIES.IMMIGRATION, SERVICE_CATEGORIES.LANGUAGE],
        message: '{VALUE} is not a valid service category',
      },
    },
    description: {
      type: String,
      required: [true, 'Description summary is required'],
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: [true, 'Rich text content structure is required'],
      default: {},
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: [true, 'Service image reference is required'],
    },
    secondaryImage: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
    },
    secondaryHeading: {
      type: String,
      trim: true,
      default: '',
    },
    metaTitle: {
      type: String,
      required: [true, 'SEO meta title is required'],
      trim: true,
    },
    metaDescription: {
      type: String,
      required: [true, 'SEO meta description is required'],
      trim: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
    canonicalUrl: {
      type: String,
      trim: true,
      default: '',
    },
    ogImage: {
      type: String,
      trim: true,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Soft Delete Plugin Registration
serviceSchema.plugin(softDeletePlugin);

// Explicit Index Declarations
serviceSchema.index({ category: 1 });

export const Service = model<ServiceDocument>('Service', serviceSchema);
export default Service;
