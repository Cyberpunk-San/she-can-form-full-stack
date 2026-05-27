import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Submission from '../src/models/Submission';

dotenv.config();

async function testConnection() {
  console.log('Connecting to:', process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected successfully!');

    // Test insertion
    console.log('Testing data insertion...');
    const testSub = new Submission({
      formData: new Map(Object.entries({
        name: 'Test Connection User',
        email: 'test@connection.org',
        message: 'This is a test message to verify connection'
      }))
    });

    const saved = await testSub.save();
    console.log('✅ Document saved successfully:', saved._id);

    // Test retrieval
    console.log('Testing data retrieval...');
    const retrieved = await Submission.findById(saved._id);
    if (retrieved) {
      console.log('✅ Document retrieved successfully!');
      console.log('Data:', Object.fromEntries(retrieved.formData || new Map()));
    } else {
      console.error('❌ Failed to retrieve document.');
    }

    // Clean up test document
    await Submission.findByIdAndDelete(saved._id);
    console.log('✅ Test document cleaned up.');

  } catch (error) {
    console.error('❌ Database connection/operation failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

testConnection();
