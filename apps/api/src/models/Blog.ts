import { Schema, model, Document } from 'mongoose';
import { IBlog } from '@intelligen/types';
import { softDeletePlugin, SoftDeleteDocument } from './plugins/softDelete.js';

export interface BlogDocument extends Omit<IBlog, 'deletedAt' | '_id' | 'publishedAt'>, SoftDeleteDocument, Document {
  publishedAt: Date | null;
}

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    subHeading: {
      type: String,
      trim: true,
      default: '',
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    summary: {
      type: String,
      required: [true, 'Blog summary is required'],
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: [true, 'Blog content body is required'],
      default: {},
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author user reference is required'],
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: [true, 'Featured image reference is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
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
  },
  {
    timestamps: true,
  }
);

// Register Soft Delete Plugin
blogSchema.plugin(softDeletePlugin);

// Explicit Index Declarations
blogSchema.index({ tags: 1 });
blogSchema.index({ publishedAt: 1 });

export const Blog = model<BlogDocument>('Blog', blogSchema);
export default Blog;
