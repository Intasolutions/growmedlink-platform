import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import { Review } from '../models/Review.js';
import { REVIEW_STATUSES } from '@intelligen/constants';
import mongoose from 'mongoose';

dotenv.config();

const mockReviews = [
  {
    studentName: 'Emily Watson',
    studentImage: '',
    rating: 5,
    comment: 'GrowMedLink was instrumental in getting my student visa approved for Australia. The pre-nursing guidance is top-notch and cleared up all my doubts!',
    status: REVIEW_STATUSES.APPROVED,
    isFeatured: true,
  },
  {
    studentName: 'Rohan Sharma',
    studentImage: '',
    rating: 5,
    comment: 'The IELTS preparation course here is excellent. The trainers are incredibly supportive, and the mock tests gave me the exact confidence I needed. Highly recommended!',
    status: REVIEW_STATUSES.APPROVED,
    isFeatured: true,
  },
  {
    studentName: 'Sarah Jenkins',
    studentImage: '',
    rating: 4,
    comment: 'Fantastic experience working with the immigration experts. They handled my documentation process smoothly and kept me updated at every stage.',
    status: REVIEW_STATUSES.APPROVED,
    isFeatured: true,
  },
  {
    studentName: 'Ahmed Ali',
    studentImage: '',
    rating: 5,
    comment: 'Truly the best guidance platform for studying healthcare abroad. They have deep expertise and a very streamlined transition process.',
    status: REVIEW_STATUSES.APPROVED,
    isFeatured: true,
  },
  {
    studentName: 'Clara Oswald',
    studentImage: '',
    rating: 5,
    comment: 'The nursing career pathways they lay out are so detailed. They helped me plan my transition from education to registration in Canada seamlessly.',
    status: REVIEW_STATUSES.APPROVED,
    isFeatured: false,
  }
];

const seedReviews = async () => {
  console.log('[seed] Seeding initial student reviews...');

  try {
    await connectDatabase();

    // Check if any reviews already exist
    const count = await Review.countDocuments();
    if (count > 0) {
      console.log(`[seed] Database already contains ${count} reviews. Skipping seeding.`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Insert reviews
    await Review.insertMany(mockReviews);
    console.log(`[seed] Successfully seeded ${mockReviews.length} reviews!`);

    await mongoose.connection.close();
    console.log('[seed] Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[seed] FATAL ERROR during seeding reviews:', error);
    try {
      await mongoose.connection.close();
    } catch {}
    process.exit(1);
  }
};

seedReviews();
