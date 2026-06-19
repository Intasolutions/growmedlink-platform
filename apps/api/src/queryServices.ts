import dotenv from 'dotenv';
import connectDatabase from './config/database.js';
import { Service } from './models/Service.js';

dotenv.config();

const run = async () => {
  await connectDatabase();
  const services = await Service.find({});
  console.log('ACTIVE SERVICES IN DATABASE:');
  services.forEach(s => {
    console.log(`- Title: ${s.title}, Slug: ${s.slug}, Category: ${s.category}, ID: ${s._id}`);
  });
  process.exit(0);
};

run();
