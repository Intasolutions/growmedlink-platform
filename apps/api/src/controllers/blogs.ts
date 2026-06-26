import { Request, Response, NextFunction } from 'express';
import { Blog } from '../models/Blog.js';
import { CreateBlogSchema, UpdateBlogSchema } from '@intelligen/utils';

/**
 * Recursive text extractor to retrieve plain text content from a Tiptap JSON document structure
 */
const extractTextFromTiptap = (node: any): string => {
  if (!node) return '';
  if (node.type === 'text' && typeof node.text === 'string') {
    return node.text;
  }
  if (Array.isArray(node.content)) {
    return node.content.map(extractTextFromTiptap).join(' ');
  }
  return '';
};

/**
 * Calculate reading time using the rule: 200 words = 1 minute
 */
const calculateReadingTime = (content: any): number => {
  if (!content) return 1;
  const text = extractTextFromTiptap(content);
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  return Math.ceil(words / 200) || 1;
};

/**
 * List all non-deleted blogs (with pagination, search, tags, featured, and status filters)
 */
export const listBlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter: any = {};

    // RBAC: Restricted statuses check
    const isEmployee = req.user && ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(req.user.role);
    if (!isEmployee) {
      // Public users always get published articles
      filter.status = 'published';
    } else if (req.query.status) {
      filter.status = req.query.status;
    }

    // Search query filter (regex on title or summary)
    if (req.query.search) {
      const searchStr = req.query.search as string;
      filter.$or = [
        { title: { $regex: searchStr, $options: 'i' } },
        { summary: { $regex: searchStr, $options: 'i' } },
      ];
    }

    // Tag filtering
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    // Featured articles query
    if (req.query.featured) {
      filter.isFeatured = req.query.featured === 'true';
    }

    // Pagination bounds
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .populate('author', 'name email role')
      .populate('image')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch a single blog by its slug
 */
export const getBlogBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug })
      .populate('author', 'name email role')
      .populate('image');

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    // Block non-published reads for public
    const isEmployee = req.user && ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(req.user.role);
    if (blog.status !== 'published' && !isEmployee) {
      res.status(403).json({ success: false, message: 'Access denied to this draft' });
      return;
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch a single blog by its ID (for Admin edit forms)
 */
export const getBlogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate('author', 'name email role')
      .populate('image');

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new blog post (restricted to SUPER_ADMIN, ADMIN, EDITOR)
 */
export const createBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validationResult = CreateBlogSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { slug, content, status } = validationResult.data;
    const existing = await Blog.findOne({ slug });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: { slug: ['A blog with this slug already exists'] },
      });
      return;
    }

    // Auto-calculate reading time
    const readingTime = calculateReadingTime(content);

    const blog = new Blog({
      ...validationResult.data,
      readingTime,
      author: req.user?._id,
      publishedAt: status === 'published' ? new Date() : null,
    });

    if (blog.isFeatured) {
      await Blog.updateMany({}, { isFeatured: false });
    }

    await blog.save();

    const populated = await Blog.findById(blog._id)
      .populate('author', 'name email role')
      .populate('image');

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing blog post (restricted to SUPER_ADMIN, ADMIN, EDITOR)
 */
export const updateBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validationResult = UpdateBlogSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found or already deleted' });
      return;
    }

    const { slug, content, status } = validationResult.data;

    // Check slug uniqueness
    if (slug) {
      const existing = await Blog.findOne({ slug, _id: { $ne: id } });
      if (existing) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: { slug: ['A blog with this slug already exists'] },
        });
        return;
      }
    }

    // Update fields
    Object.assign(blog, validationResult.data);

    // Recalculate reading time if content changed
    if (content) {
      blog.readingTime = calculateReadingTime(content);
    }

    // Handle status changes for publishing date
    if (status) {
      if (status === 'published' && !blog.publishedAt) {
        blog.publishedAt = new Date();
      } else if (status !== 'published') {
        blog.publishedAt = null;
      }
    }

    if (validationResult.data.isFeatured === true) {
      await Blog.updateMany({ _id: { $ne: id } }, { isFeatured: false });
    }

    await blog.save();

    const populated = await Blog.findById(blog._id)
      .populate('author', 'name email role')
      .populate('image');

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a blog post (restricted to SUPER_ADMIN, ADMIN, EDITOR)
 */
export const deleteBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found or already deleted' });
      return;
    }

    await blog.softDelete();

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
