const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const Song = require('../models/Song');

router.post('/upload', upload.single('song'), async (req, res) => {
  try {
    const { title, artist } = req.body;
    const file = req.file;

    const newSong = new Song({
      title,
      artist,
      url: file.path
    });

    await newSong.save();

    res.status(201).json(newSong);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
