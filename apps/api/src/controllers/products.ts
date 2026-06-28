import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';
import { ProductSchema } from '@intelligen/utils';

/**
 * List all non-deleted products with optional featured filter
 */
export const listProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter: any = {};

    if (req.query.isFeatured) {
      filter.isFeatured = req.query.isFeatured === 'true';
    }

    // Soft-deleted documents are automatically excluded by mongoose middleware plugin
    const products = await Product.find(filter)
      .populate('image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single product by its unique slug
 */
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).populate('image');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single product by its MongoDB ObjectId (used for Admin Edit view)
 */
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('image');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product (restricted to Admin/Super Admin)
 */
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validationResult = ProductSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { slug } = validationResult.data;
    const existing = await Product.findOne({ slug });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: { slug: ['A product with this slug already exists'] },
      });
      return;
    }

    const product = new Product(validationResult.data);
    await product.save();

    const populated = await Product.findById(product._id).populate('image');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing product (restricted to Admin/Super Admin)
 */
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validationResult = ProductSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found or already deleted',
      });
      return;
    }

    const { slug } = validationResult.data;
    const existing = await Product.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: { slug: ['A product with this slug already exists'] },
      });
      return;
    }

    Object.assign(product, validationResult.data);
    await product.save();

    const populated = await Product.findById(product._id).populate('image');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a product (restricted to Admin/Super Admin)
 */
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found or already deleted',
      });
      return;
    }

    await product.softDelete();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
