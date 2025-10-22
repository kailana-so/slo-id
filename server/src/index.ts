import dotenv from 'dotenv';

// Load environment variables FIRST, before any other imports
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import geolocateRoutes from './routes/geolocate.js';
import imageRoutes from './routes/images.js';
import sessionRoutes from './routes/session.js';
import suggestionRoutes from './routes/suggestions.js';
import uploadImageRoutes from './routes/uploadImage.js';
import weatherRoutes from './routes/weather.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// All API routes (no system key required)
app.use('/api/session', sessionRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/geolocate', geolocateRoutes);
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
