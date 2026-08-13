import express from 'express';
import { registerUser, loginUser, getUserProfile, toggleLikeSong, addRecentlyPlayed } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.post('/like-song', protect, toggleLikeSong);
router.post('/recently-played', protect, addRecentlyPlayed);

export default router;


