import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import { Media } from '../models/Media.js';
import { User } from '../models/User.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDatabase();
    
    // Find superadmin user to reference
    const admin = await User.findOne({ role: 'SUPER_ADMIN' });
    if (!admin) {
      console.error('No admin user found to attribute media to.');
      process.exit(1);
    }
    
    const count = await Media.countDocuments({});
    if (count > 0) {
      console.log('Media library already seeded with items.');
      process.exit(0);
    }
    
    const mockMedia = [
      {
        filename: 'canada_visa_banner.jpg',
        folder: 'services',
        publicId: 'services/canada_visa_banner',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1570560000/sample.jpg',
        width: 1200,
        height: 800,
        size: 512000,
        uploadedBy: admin._id,
      },
      {
        filename: 'ielts_coaching.jpg',
        folder: 'services',
        publicId: 'services/ielts_coaching',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1570560000/sample.jpg',
        width: 1200,
        height: 800,
        size: 256000,
        uploadedBy: admin._id,
      }
    ];
    
    await Media.insertMany(mockMedia);
    console.log('Seeded 2 mock media assets successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding media failed:', error);
    process.exit(1);
  }
};

seed();
