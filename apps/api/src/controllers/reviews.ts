import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review.js';
import { ReviewSchema, ReviewUpdateSchema } from '@intelligen/utils';
import { REVIEW_STATUSES } from '@intelligen/constants';

/**
 * List all non-deleted approved reviews (Public endpoint)
 */
export const listPublicReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await Review.find({ status: REVIEW_STATUSES.APPROVED })
      .populate('service', 'title category')
      .sort({ isFeatured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit a review (Public endpoint - defaults to Pending)
 */
export const submitReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validationResult = ReviewSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const reviewData = {
      ...validationResult.data,
      status: REVIEW_STATUSES.PENDING,
      isFeatured: false,
    };

    const review = new Review(reviewData);
    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and is pending approval',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a review by its MongoDB ObjectId (used for Admin Edit view)
 */
export const getReviewById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id).populate('service', 'title category');
    
    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Review not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all reviews with filters/pagination (Admin endpoint)
 */
export const listAdminReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const isFeatured = req.query.isFeatured as string;

    const query: any = {};

    if (status) query.status = status;
    if (isFeatured) query.isFeatured = isFeatured === 'true';

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('service', 'title category')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing review (Admin endpoint)
 */
export const updateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validationResult = ReviewUpdateSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Review not found or already deleted',
      });
      return;
    }

    Object.assign(review, validationResult.data);
    await review.save();

    const populated = await Review.findById(review._id).populate('service', 'title category');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a review (Admin endpoint)
 */
export const deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Review not found or already deleted',
      });
      return;
    }

    await review.softDelete();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
