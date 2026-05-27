import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';

dotenv.config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const count = await User.countDocuments({ isAdmin: true });
    console.log(`STATUS: Found ${count} admin users in the database.`);
    if (count > 0) {
      const admin = await User.findOne({ isAdmin: true });
      console.log(`ADMIN_EMAIL: ${admin?.email}`);
    }
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdmin();
