import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Page } from '../src/models/Page.js';
import { PAGE_KEYS } from '@intelligen/constants';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const defaultPages = [
  {
    key: PAGE_KEYS.ABOUT,
    title: 'About Us',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'About Us' }]
        }
      ]
    },
    metaTitle: 'About Us | GrowMedLink',
    metaDescription: 'Learn more about GrowMedLink and our mission.',
  },
  {
    key: PAGE_KEYS.PRIVACY,
    title: 'Privacy Policy',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Privacy Policy' }]
        }
      ]
    },
    metaTitle: 'Privacy Policy | GrowMedLink',
    metaDescription: 'Read our privacy policy to understand how we protect your data.',
  },
  {
    key: PAGE_KEYS.TERMS,
    title: 'Terms & Conditions',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Terms & Conditions' }]
        }
      ]
    },
    metaTitle: 'Terms & Conditions | GrowMedLink',
    metaDescription: 'Our terms and conditions of service.',
  }
];

const seedPages = async () => {
  try {
    console.log('Connecting to database...');
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to database.');

    console.log('Seeding pages...');
    for (const pageData of defaultPages) {
      const page = await Page.findOneAndUpdate(
        { key: pageData.key },
        { $setOnInsert: pageData },
        { upsert: true, new: true }
      );
      if (page.isNew) {
        console.log(`Created page: ${page.key}`);
      } else {
        console.log(`Page already exists: ${page.key}`);
      }
    }
    
    console.log('Pages seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding pages:', error);
    process.exit(1);
  }
};

seedPages();
