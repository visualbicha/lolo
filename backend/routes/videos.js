const express = require('express');
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const { videoValidator, validate } = require('../utils/validators');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const videos = await Video.find().populate('createdBy', 'username');
    res.json(videos);
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, videoValidator, validate, async (req, res, next) => {
  try {
    const video = new Video({ ...req.body, createdBy: req.user.userId });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).populate('createdBy', 'username');
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, videoValidator, validate, async (req, res, next) => {
  try {
    const video = await Video.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!video) {
      return res.status(404).json({ message: 'Video not found or you do not have permission to update' });
    }
    res.json(video);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const video = await Video.findOneAndDelete({ _id: req.params.id, createdBy: req.user.userId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found or you do not have permission to delete' });
    }
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;