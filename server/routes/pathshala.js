import express from 'express';
import PathshalaVideo from '../models/PathshalaVideo.js';

const router = express.Router();

// GET all videos
router.get('/', async (req, res) => {
  try {
    const videos = await PathshalaVideo.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add video
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `vid-${Date.now()}`;
    }
    const video = await PathshalaVideo.create(data);
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE video
router.delete('/:id', async (req, res) => {
  try {
    await PathshalaVideo.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
