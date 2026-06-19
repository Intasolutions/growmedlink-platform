import { Schema, model } from 'mongoose';
import { IPage } from '@intelligen/types';
import { PAGE_KEYS } from '@intelligen/constants';

const pageSchema = new Schema<IPage>(
  {
    key: {
      type: String,
      required: [true, 'Page key identifier is required'],
      unique: true,
      trim: true,
      lowercase: true,
      enum: {
        values: [PAGE_KEYS.ABOUT, PAGE_KEYS.PRIVACY, PAGE_KEYS.TERMS],
        message: '{VALUE} is not a valid page key',
      },
    },
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: [true, 'Page content blocks are required'],
      default: {},
    },
    metaTitle: {
      type: String,
      default: '',
      trim: true,
    },
    metaDescription: {
      type: String,
      default: '',
      trim: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
    canonicalUrl: {
      type: String,
      default: '',
      trim: true,
    },
    ogImage: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes

export const Page = model<IPage>('Page', pageSchema);
export default Page;
