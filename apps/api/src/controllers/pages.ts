import { Request, Response } from 'express';
import { Page } from '../models/Page.js';
import { PAGE_KEYS } from '@intelligen/constants';

const VALID_KEYS = Object.values(PAGE_KEYS);

export const getPage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { key } = req.params;

    if (!VALID_KEYS.includes(key as any)) {
      return res.status(400).json({ success: false, message: 'Invalid page key' });
    }

    const page = await Page.findOne({ key });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    return res.status(200).json({ success: true, data: page });
  } catch (error: any) {
    console.error('Get Page Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch page' });
  }
};

export const updatePage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { key } = req.params;
    
    if (!VALID_KEYS.includes(key as any)) {
      return res.status(400).json({ success: false, message: 'Invalid page key' });
    }

    const {
      title,
      content,
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      ogImage
    } = req.body;

    const page = await Page.findOneAndUpdate(
      { key },
      { 
        title, 
        content,
        metaTitle,
        metaDescription,
        keywords,
        canonicalUrl,
        ogImage
      },
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    return res.status(200).json({ success: true, data: page });
  } catch (error: any) {
    console.error('Update Page Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update page' });
  }
};
