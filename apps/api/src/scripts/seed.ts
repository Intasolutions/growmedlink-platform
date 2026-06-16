import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import { User } from '../models/User.js';
import { ROLES } from '@intelligen/constants';
import mongoose from 'mongoose';

dotenv.config();

const seedSuperAdmin = async () => {
  console.log('[seed] Seeding initial Super Admin user...');

  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD;
  const adminName = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  if (!adminEmail || !adminPassword) {
    console.error('[seed] FATAL ERROR: SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD environment variables must be defined to seed.');
    process.exit(1);
  }

  try {
    await connectDatabase();

    // Check if any Super Admin exists in the database
    const existingAdmin = await User.findOne({ role: ROLES.SUPER_ADMIN });
    if (existingAdmin) {
      console.log(`[seed] A user with SUPER_ADMIN role already exists: ${existingAdmin.email}. Skipping seeding.`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Check if the target email is already taken by any user
    const existingEmail = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingEmail) {
      console.error(`[seed] ERROR: The email ${adminEmail} is already taken by user: ${existingEmail.name} with role: ${existingEmail.role}. Cannot create Super Admin.`);
      await mongoose.connection.close();
      process.exit(1);
    }

    // Create Super Admin document
    const superAdmin = new User({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: ROLES.SUPER_ADMIN,
    });

    await superAdmin.save();
    console.log(`[seed] Super Admin account created successfully: ${adminEmail}`);

    await mongoose.connection.close();
    console.log('[seed] Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[seed] FATAL ERROR during seeding:', error);
    try {
      await mongoose.connection.close();
    } catch {}
    process.exit(1);
  }
};

seedSuperAdmin();
