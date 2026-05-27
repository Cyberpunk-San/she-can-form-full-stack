import express from 'express';
import Submission from '../models/Submission';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Public: Submit form (no auth required) - Dynamic form data
router.post('/', async (req, res) => {
  try {
    const { formData } = req.body;
    
    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ message: 'Form data is required' });
    }
    
    const submission = new Submission({ 
      formData: new Map(Object.entries(formData))
    });
    await submission.save();
    
    res.status(201).json({ message: 'Form Submitted Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: Get all reviewed submissions (no auth required)
router.get('/public', async (req, res) => {
  try {
    const submissions = await Submission.find({ status: 'reviewed' }).sort('-submittedAt');
    const formattedSubmissions = submissions.map(sub => ({
      _id: sub._id,
      formData: Object.fromEntries(sub.formData || new Map()),
      submittedAt: sub.submittedAt
    }));
    res.json(formattedSubmissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all submissions
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find().sort('-submittedAt');
    // Convert Map to object for frontend
    const formattedSubmissions = submissions.map(sub => ({
      _id: sub._id,
      formData: Object.fromEntries(sub.formData || new Map()),
      submittedAt: sub.submittedAt,
      status: sub.status
    }));
    res.json(formattedSubmissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update submission status
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;