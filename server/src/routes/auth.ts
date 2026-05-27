import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
        { id: user._id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
        );
        
        res.json({
        token,
        user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
    });

    // Setup default admin (run once)
    router.post('/setup', async (req, res) => {
    try {
        const existingAdmin = await User.findOne({ isAdmin: true });
        if (!existingAdmin) {
        const admin = new User({
            email: process.env.ADMIN_EMAIL || 'admin@shecan.org',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            name: 'She Can Admin'
        });
        await admin.save();
        res.json({ message: 'Admin created! Email: admin@shecan.org, Password: admin123' });
        } else {
        res.json({ message: 'Admin already exists' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin' });
    }
});

export default router;