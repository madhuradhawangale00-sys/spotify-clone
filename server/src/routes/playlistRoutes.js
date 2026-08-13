import express from 'express';
import { 
  getPlaylists, 
  getPlaylistById, 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
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

router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);

export default router;

