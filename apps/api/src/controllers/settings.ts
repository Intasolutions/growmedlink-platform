import { Request, Response } from 'express';
import { Settings } from '../models/Settings.js';
import { SettingsSchema } from '@intelligen/utils';

export const getSettings = async (req: Request, res: Response): Promise<any> => {
  try {
    let settings = await Settings.findOne().populate('logo');
    
    if (!settings) {
      // Fallback if not seeded
      settings = await Settings.create({
        companyName: 'GrowMedLink',
        contactEmail: 'info@growmedlink.com',
        contactPhone: '+1234567890',
        address: '123 Global Way',
        seoDefaultTitle: 'GrowMedLink',
        seoDefaultDescription: 'GrowMedLink',
      });
    }

    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Get Settings Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<any> => {
  try {
    const validatedData = SettingsSchema.parse(req.body);

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(validatedData);
    } else {
      Object.assign(settings, validatedData);
    }

    await settings.save();
    
    // Populate logo before returning
    await settings.populate('logo');

    return res.status(200).json({ success: true, data: settings });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
    }
    console.error('Update Settings Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
