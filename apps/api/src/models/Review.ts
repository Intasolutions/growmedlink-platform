import { Schema, model, Document } from 'mongoose';
import { IReview } from '@intelligen/types';
import { REVIEW_STATUSES } from '@intelligen/constants';
import { softDeletePlugin, SoftDeleteDocument } from './plugins/softDelete.js';

export interface ReviewDocument extends Omit<IReview, 'deletedAt' | '_id'>, SoftDeleteDocument, Document {}

const reviewSchema = new Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    studentImage: {
      type: String,
      trim: true,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUSES),
      default: REVIEW_STATUSES.PENDING,
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
reviewSchema.plugin(softDeletePlugin);

// Explicit Index Declarations
reviewSchema.index({ status: 1 });
reviewSchema.index({ isFeatured: 1 });
reviewSchema.index({ createdAt: -1 });

export const Review = model<ReviewDocument>('Review', reviewSchema);
export default Review;
