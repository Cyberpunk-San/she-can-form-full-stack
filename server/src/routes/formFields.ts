import express from 'express';
import FormField from '../models/FormField';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Public: Get all active form fields (for users to see)
router.get('/', async (req, res) => {
  try {
    const fields = await FormField.find({ isActive: true }).sort('order');
    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get ALL fields (including inactive)
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const fields = await FormField.find().sort('order');
    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create new field
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { fieldName, label, type, required, placeholder, options, order } = req.body;
    
    const existingField = await FormField.findOne({ fieldName });
    if (existingField) {
      return res.status(400).json({ message: 'Field name already exists' });
    }
    
    const field = new FormField({ fieldName, label, type, required, placeholder, options, order });
    await field.save();
    res.status(201).json(field);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update field
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const field = await FormField.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    res.json(field);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete field
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const field = await FormField.findByIdAndDelete(req.params.id);
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    res.json({ message: 'Field deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;