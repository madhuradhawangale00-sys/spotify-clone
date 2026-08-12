import express from 'express';
import { 
  getPlaylists, 
  getPlaylistById, 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist 
} from '../controllers/playlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPlaylists)
  .post(protect, createPlaylist);

router.route('/:id')
  .get(getPlaylistById)
  .put(protect, updatePlaylist)
  .delete(protect, deletePlaylist);

export default router;
