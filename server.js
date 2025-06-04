const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const songRoutes = require('./routes/cloudSongs');
const uploadRoutes = require('./routes/upload');

// Load environment variables
const result = dotenv.config({ silent: true });
if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

console.log('Environment variables loaded from:', path.resolve(process.cwd(), '.env'));
console.log('Available environment variables:', {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? '***' : undefined,
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY ? '***' : undefined,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET ? '***' : undefined
});

// Check required environment variables
const requiredEnvVars = ['PORT', 'MONGO_URI', 'CLOUD_NAME', 'CLOUD_API_KEY', 'CLOUD_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/songs', songRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
  // Start server only after successful database connection
  app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});
