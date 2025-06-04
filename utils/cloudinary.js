const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Debug environment variables
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY ? '***' : undefined,
  api_secret: process.env.CLOUD_API_SECRET ? '***' : undefined
});

// Configure Cloudinary
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  throw new Error('Missing required Cloudinary environment variables');
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'songs',
    resource_type: 'auto',
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a']
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });

module.exports = {
  cloudinary,
  upload
}; 