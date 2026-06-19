import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Settings } from '../src/models/Settings.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/growmedlink-intelligen';

const seedSettings = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[seed] Connected to MongoDB.');

    const count = await Settings.countDocuments();
    if (count > 0) {
      console.log('[seed] Settings already exist. Skipping seed.');
      process.exit(0);
    }

    const defaultSettings = {
      companyName: 'GrowMedLink',
      contactEmail: 'info@growmedlink.com',
      contactPhone: '+1234567890',
      address: '123 Global Way, Suite 400, Toronto, ON M5V 1A1, Canada',
      socialLinks: {
        facebook: 'https://facebook.com/growmedlink',
        instagram: 'https://instagram.com/growmedlink',
        linkedin: 'https://linkedin.com/company/growmedlink',
        twitter: 'https://twitter.com/growmedlink',
      },
      seoDefaultTitle: 'GrowMedLink | Study & Work Abroad',
      seoDefaultDescription: 'GrowMedLink offers expert immigration and language academy services to help you achieve your dreams of working and studying abroad.',
    };

    const newSettings = await Settings.create(defaultSettings);
    console.log('[seed] Seeded default settings:', newSettings._id);

    process.exit(0);
  } catch (error) {
    console.error('[seed] Error seeding settings:', error);
    process.exit(1);
  }
};

seedSettings();
