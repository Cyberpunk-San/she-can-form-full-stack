import mongoose from 'mongoose';

const formFieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'email', 'textarea', 'number', 'tel', 'date', 'select'], 
    default: 'text' 
  },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  options: { type: [String], default: [] },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('FormField', formFieldSchema);