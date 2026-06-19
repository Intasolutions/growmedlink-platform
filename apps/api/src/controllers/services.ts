import { Request, Response, NextFunction } from 'express';
import { Service } from '../models/Service.js';
import { ServiceSchema } from '@intelligen/utils';

/**
 * List all non-deleted services with optional category/featured filters
 */
export const listServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter: any = {};
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.isFeatured) {
      filter.isFeatured = req.query.isFeatured === 'true';
    }

    // Soft-deleted documents are automatically excluded by mongoose middleware plugin
    const services = await Service.find(filter)
      .populate('image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single service by its unique slug
 */
export const getServiceBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const service = await Service.findOne({ slug }).populate('image');
    
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single service by its MongoDB ObjectId (used for Admin Edit view)
 */
export const getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).populate('image');
    
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new service (restricted to Admin/Super Admin)
 */
export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validationResult = ServiceSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { slug } = validationResult.data;
    const existing = await Service.findOne({ slug });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: { slug: ['A service with this slug already exists'] },
      });
      return;
    }

    const service = new Service(validationResult.data);
    await service.save();

    const populated = await Service.findById(service._id).populate('image');

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing service (restricted to Admin/Super Admin)
 */
export const updateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validationResult = ServiceSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const service = await Service.findById(id);
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service not found or already deleted',
      });
      return;
    }

    const { slug } = validationResult.data;
    const existing = await Service.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: { slug: ['A service with this slug already exists'] },
      });
      return;
    }

    Object.assign(service, validationResult.data);
    await service.save();

    const populated = await Service.findById(service._id).populate('image');

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a service (restricted to Admin/Super Admin)
 */
export const deleteService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service not found or already deleted',
      });
      return;
    }

    await service.softDelete();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
