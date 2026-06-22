import { Request, Response } from 'express';
import { Enquiry } from '../models/Enquiry.js';
import { Blog } from '../models/Blog.js';
import { Service } from '../models/Service.js';
import { ENQUIRY_STATUSES } from '@intelligen/constants';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private (SUPER_ADMIN, ADMIN)
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Run all count queries in parallel for performance
    const [
      totalEnquiries,
      newEnquiries,
      resolvedEnquiries,
      totalBlogs,
      publishedBlogs,
      totalServices,
      recentLeads
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: ENQUIRY_STATUSES.NEW }),
      Enquiry.countDocuments({ status: ENQUIRY_STATUSES.RESOLVED }),
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      Service.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).select('name email type status createdAt')
    ]);

    res.status(200).json({
      success: true,
      data: {
        enquiries: {
          total: totalEnquiries,
          new: newEnquiries,
          resolved: resolvedEnquiries
        },
        blogs: {
          total: totalBlogs,
          published: publishedBlogs,
          drafts: totalBlogs - publishedBlogs
        },
        services: {
          total: totalServices
        },
        recentLeads
      }
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
