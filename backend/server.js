import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, seedEquipmentTypes, cleanupExpiredCache } from './models/database.js';
import { EQUIPMENT_TYPES } from './utils/constants.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize database on startup
initializeDatabase();
seedEquipmentTypes(EQUIPMENT_TYPES);

// Clean up expired cache entries on startup and every 24 hours
cleanupExpiredCache();
setInterval(cleanupExpiredCache, 24 * 60 * 60 * 1000);

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Recipe Cleanup Time Estimator API',
    version: '1.0.0',
    status: 'running'
  });
});

// API Routes
import analyzeRoutes from './routes/analyze.js';
import feedbackRoutes from './routes/feedback.js';
import photoAnalysisRoutes from './routes/photoAnalysis.js';

app.use('/api', analyzeRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', photoAnalysisRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
