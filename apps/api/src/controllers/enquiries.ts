import { Request, Response } from 'express';
import { Enquiry } from '../models/Enquiry.js';
import { EnquirySchema, EnquiryUpdateSchema } from '@intelligen/utils';
import { verifyTurnstileToken } from '../utils/turnstile.js';
import { sendNotificationEmailToAdmin, sendConfirmationEmailToUser } from '../utils/email.js';
import { ENQUIRY_STATUSES } from '@intelligen/constants';

export const createEnquiry = async (req: Request, res: Response): Promise<any> => {
  try {
    const validatedData = EnquirySchema.parse(req.body);

    const isTokenValid = await verifyTurnstileToken(validatedData.turnstileToken);
    if (!isTokenValid) {
      return res.status(400).json({ success: false, message: 'Invalid Turnstile token' });
    }

    const newEnquiry = await Enquiry.create(validatedData);

    // Fire and forget emails
    sendNotificationEmailToAdmin(newEnquiry);
    sendConfirmationEmailToUser(newEnquiry.email, newEnquiry.name);

    return res.status(201).json({ success: true, data: newEnquiry });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
    }
    console.error('Create Enquiry Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getEnquiries = async (req: Request, res: Response): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const type = req.query.type as string;

    const query: any = {};

    if (status) query.status = status;
    if (type) query.type = type;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Fetch summary metrics
    const [totalLeads, pendingLeads, inProgressLeads, resolvedLeads] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: ENQUIRY_STATUSES.PENDING }),
      Enquiry.countDocuments({ status: ENQUIRY_STATUSES.IN_PROGRESS }),
      Enquiry.countDocuments({ status: ENQUIRY_STATUSES.RESOLVED }),
    ]);

    return res.status(200).json({
      success: true,
      data: enquiries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      metrics: {
        totalLeads,
        pendingLeads,
        inProgressLeads,
        resolvedLeads,
      }
    });
  } catch (error: any) {
    console.error('Get Enquiries Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getEnquiryById = async (req: Request, res: Response): Promise<any> => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    return res.status(200).json({ success: true, data: enquiry });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateEnquiry = async (req: Request, res: Response): Promise<any> => {
  try {
    const validatedData = EnquiryUpdateSchema.parse(req.body);
    
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    if (validatedData.status === ENQUIRY_STATUSES.RESOLVED && enquiry.status !== ENQUIRY_STATUSES.RESOLVED) {
      enquiry.resolvedAt = new Date() as any;
    } else if (validatedData.status && validatedData.status !== ENQUIRY_STATUSES.RESOLVED) {
      enquiry.resolvedAt = null as any;
    }

    if (validatedData.status) enquiry.status = validatedData.status as any;
    if (validatedData.notes !== undefined) enquiry.notes = validatedData.notes;

    await enquiry.save();

    return res.status(200).json({ success: true, data: enquiry });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
    }
    console.error('Update Enquiry Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteEnquiry = async (req: Request, res: Response): Promise<any> => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    return res.status(200).json({ success: true, message: 'Enquiry deleted' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
