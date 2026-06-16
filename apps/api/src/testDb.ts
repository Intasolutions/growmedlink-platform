import dotenv from 'dotenv';
import connectDatabase from './config/database.js';
import { User } from './models/User.js';
import { Service } from './models/Service.js';
import { Blog } from './models/Blog.js';
import { Page } from './models/Page.js';
import { Enquiry } from './models/Enquiry.js';
import { Settings } from './models/Settings.js';
import { Media } from './models/Media.js';
import { AuditLog } from './models/AuditLog.js';

dotenv.config();

const test = async () => {
  console.log('[testDb] Starting Database connection test...');
  
  if (!process.env.MONGODB_URI) {
    console.warn('[testDb] WARNING: MONGODB_URI environment variable is missing.');
    console.log('[testDb] Schema models compiled successfully. Set MONGODB_URI in a .env file to run connection check.');
    process.exit(0);
  }

  try {
    await connectDatabase();
    console.log('[testDb] Connection check successful.');
    console.log('[testDb] Verified Mongoose Models:');
    console.log(`- User model status: OK (${User.modelName})`);
    console.log(`- Service model status: OK (${Service.modelName})`);
    console.log(`- Blog model status: OK (${Blog.modelName})`);
    console.log(`- Page model status: OK (${Page.modelName})`);
    console.log(`- Enquiry model status: OK (${Enquiry.modelName})`);
    console.log(`- Settings model status: OK (${Settings.modelName})`);
    console.log(`- Media model status: OK (${Media.modelName})`);
    console.log(`- AuditLog model status: OK (${AuditLog.modelName})`);
    console.log('[testDb] All database models loaded and initialized without errors.');
    process.exit(0);
  } catch (error) {
    console.error('[testDb] Verification run failed:', error);
    process.exit(1);
  }
};

test();
