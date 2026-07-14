import { Schema, model, Document } from 'mongoose';
import { ICategory } from '@intelligen/types';

export interface CategoryDocument extends Omit<ICategory, '_id'>, Document {}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ slug: 1 });

export const Category = model<CategoryDocument>('Category', categorySchema);
export default Category;
