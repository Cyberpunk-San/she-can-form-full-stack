import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  formData: { type: Map, of: mongoose.Schema.Types.Mixed, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' }
});

export default mongoose.model('Submission', submissionSchema);