import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Service } from '../models/Service.js';
import { CategorySchema } from '@intelligen/utils';

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

/**
 * List all categories
 */
export const listCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new category
 */
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validationResult = CategorySchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    let { name, slug, order, isActive } = validationResult.data;
    if (!slug) {
      slug = slugify(name);
    }

    const existingName = await Category.findOne({ name });
    if (existingName) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: { name: ['A category with this name already exists'] },
      });
      return;
    }

    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: { slug: ['A category with this slug already exists'] },
      });
      return;
    }

    const category = new Category({ name, slug, order: order ?? 0, isActive: isActive ?? true });
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing category
 */
export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validationResult = CategorySchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    let { name, slug, order, isActive } = validationResult.data;
    if (!slug) {
      slug = slugify(name);
    }

    const existingName = await Category.findOne({ name, _id: { $ne: id } });
    if (existingName) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: { name: ['A category with this name already exists'] },
      });
      return;
    }

    const existingSlug = await Category.findOne({ slug, _id: { $ne: id } });
    if (existingSlug) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: { slug: ['A category with this slug already exists'] },
      });
      return;
    }

    category.name = name;
    category.slug = slug;
    if (order !== undefined) (category as any).order = order;
    if (isActive !== undefined) (category as any).isActive = isActive;
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    // Check if any product is assigned to this category
    const linkedProduct = await Product.findOne({ category: id });
    if (linkedProduct) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete category: it is currently referenced by one or more products.',
      });
      return;
    }

    // Check if any service is assigned to this category
    const linkedService = await Service.findOne({ category: id });
    if (linkedService) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete category: it is currently referenced by one or more services.',
      });
      return;
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
