import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import formFieldRoutes from './routes/formFields';
import submissionRoutes from './routes/submissions';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err: Error) => console.error('❌ MongoDB Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/form-fields', formFieldRoutes);
app.use('/api/submissions', submissionRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'She Can Foundation API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});