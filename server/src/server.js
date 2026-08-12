import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import songRoutes from './routes/songRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser & CORS Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Spotify Clone API is running',
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start Express Server
app.listen(PORT, () => {
  console.log(`🎵 Spotify Clone Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
