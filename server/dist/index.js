import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { systemKeyMiddleware } from './middleware/systemKey.js';
import geolocateRoutes from './routes/geolocate.js';
import imageRoutes from './routes/images.js';
import sessionRoutes from './routes/session.js';
import suggestionRoutes from './routes/suggestions.js';
import uploadImageRoutes from './routes/uploadImage.js';
import weatherRoutes from './routes/weather.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Apply system key middleware to all API routes
app.use('/api', systemKeyMiddleware);
// Routes
app.use('/api/geolocate', geolocateRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/uploadImage', uploadImageRoutes);
app.use('/api/weather', weatherRoutes);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
