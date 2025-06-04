const express = require('express');
const router = express.Router();
const { cloudinary } = require('../config/cloudinary');

// GET all songs from Cloudinary
router.get('/cloud-songs', async (req, res) => {
  try {
    console.log('Fetching songs from Cloudinary...');
    
    // Verify Cloudinary configuration
    if (!cloudinary.config().cloud_name) {
      throw new Error('Cloudinary not properly configured');
    }

    const resources = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',     // mp3 files are under 'video' in Cloudinary
      max_results: 100
    });

    console.log('Cloudinary response:', resources);

    if (!resources || !resources.resources) {
      console.error('Invalid response from Cloudinary:', resources);
      return res.status(500).json({ error: 'Invalid response from Cloudinary' });
    }

    // Filter audio files
    const audioFiles = resources.resources.filter(file => 
      ['mp3', 'wav', 'ogg', 'm4a'].includes(file.format)
    );
    console.log('Found audio files:', audioFiles.length);

    const songs = audioFiles.map(file => ({
      title: file.public_id.split('/').pop(), // Get the filename without the path
      url: file.secure_url,
      size: file.bytes,
      created_at: file.created_at,
      format: file.format
    }));

    res.json(songs);
  } catch (err) {
    console.error('Error fetching songs from Cloudinary:', err);
    res.status(500).json({ 
      error: 'Failed to fetch songs from Cloudinary',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
