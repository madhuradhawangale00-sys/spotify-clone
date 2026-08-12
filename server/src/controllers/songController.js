import Song from '../models/Song.js';

// @desc    Get all songs (with optional search/genre filter)
// @route   GET /api/songs
// @access  Public
export const getSongs = async (req, res) => {
  try {
    const { search, genre } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { album: { $regex: search, $options: 'i' } },
      ];
    }

    if (genre && genre !== 'All') {
      query.genre = { $regex: genre, $options: 'i' };
    }

    const songs = await Song.find(query).sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get song by ID
// @route   GET /api/songs/:id
// @access  Public
export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (song) {
      // Increment play count when single song requested
      song.plays += 1;
      await song.save();
      res.json(song);
    } else {
      res.status(404).json({ message: 'Song not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Invalid song ID format' });
  }
};

// @desc    Create a new song
// @route   POST /api/songs
// @access  Private
export const createSong = async (req, res) => {
  try {
    const { title, artist, album, duration, durationSeconds, coverUrl, audioUrl, genre } = req.body;

    if (!title || !artist || !audioUrl) {
      return res.status(400).json({ message: 'Title, artist, and audioUrl are required' });
    }

    const song = new Song({
      title,
      artist,
      album: album || 'Single',
      duration: duration || '3:30',
      durationSeconds: durationSeconds || 210,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
      audioUrl,
      genre: genre || 'Pop',
      uploadedBy: req.user._id,
    });

    const createdSong = await song.save();
    res.status(201).json(createdSong);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a song
// @route   DELETE /api/songs/:id
// @access  Private
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Check ownership or admin status
    if (song.uploadedBy && song.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this song' });
    }

    await song.deleteOne();
    res.json({ message: 'Song removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
