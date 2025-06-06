const musicMetadata = require('music-metadata');
const axios = require('axios');

async function extractMetadata(audioUrl) {
  try {
    // Download the audio file
    const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // Parse metadata
    const metadata = await musicMetadata.parseBuffer(buffer, 'audio/mpeg');

    // Extract relevant metadata
    const extractedData = {
      title: metadata.common.title || 'Unknown Title',
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      year: metadata.common.year,
      genre: metadata.common.genre,
      duration: metadata.format.duration,
      bitrate: metadata.format.bitrate,
      sampleRate: metadata.format.sampleRate,
      picture: metadata.common.picture ? {
        format: metadata.common.picture[0].format,
        data: metadata.common.picture[0].data.toString('base64')
      } : null
    };

    return extractedData;
  } catch (error) {
    console.error('Error extracting metadata:', error);
    throw new Error('Failed to extract metadata from audio file');
  }
}

module.exports = { extractMetadata }; 