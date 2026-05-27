import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB.');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@shecan.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin user with email "${adminEmail}" already exists!`);
      // Update password just in case it was modified
      existingAdmin.password = adminPassword;
      await existingAdmin.save();
      console.log('Admin password reset/updated successfully.');
    } else {
      console.log('Creating default admin user...');
      const admin = new User({
        email: adminEmail,
        password: adminPassword,
        name: 'She Can Admin',
        isAdmin: true
      });
      await admin.save();
      console.log('✅ Admin user created successfully!');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

createAdmin();
