import express from 'express';
import { getSongs, getSongById, createSong, deleteSong } from '../controllers/songController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSongs)
  .post(protect, createSong);

router.route('/:id')
  .get(getSongById)
  .delete(protect, deleteSong);

export default router;
