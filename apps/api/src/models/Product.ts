import { Schema, model, Document } from 'mongoose';
import { IProduct } from '@intelligen/types';
import { softDeletePlugin, SoftDeleteDocument } from './plugins/softDelete.js';

export interface ProductDocument extends Omit<IProduct, 'deletedAt' | '_id'>, SoftDeleteDocument, Document {}

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: [true, 'Product image reference is required'],
    },
    details: {
      type: Schema.Types.Mixed,
      required: [true, 'Rich text details content is required'],
      default: {},
    },
    fees: {
      type: String,
      required: [true, 'Fees is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    otherDetails: {
      type: Schema.Types.Mixed,
      default: {},
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
productSchema.plugin(softDeletePlugin);

export const Product = model<ProductDocument>('Product', productSchema);
export default Product;
