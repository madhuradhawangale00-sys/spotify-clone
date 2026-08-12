import Playlist from '../models/Playlist.js';

// @desc    Get all playlists
// @route   GET /api/playlists
// @access  Public
export const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate('owner', 'name avatar')
      .populate('songs')
      .sort({ createdAt: -1 });

    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single playlist by ID
// @route   GET /api/playlists/:id
// @access  Public
export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('owner', 'name avatar')
      .populate('songs');

    if (playlist) {
      res.json(playlist);
    } else {
      res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Invalid playlist ID format' });
  }
};

// @desc    Create a new playlist
// @route   POST /api/playlists
// @access  Private
export const createPlaylist = async (req, res) => {
  try {
    const { title, description, coverUrl, songs, isPublic, gradient } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Playlist title is required' });
    }

    const playlist = new Playlist({
      title,
      description: description || '',
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
      owner: req.user._id,
      songs: songs || [],
      isPublic: isPublic !== undefined ? isPublic : true,
      gradient: gradient || 'from-purple-900 via-indigo-900 to-[#121212]',
    });

    const createdPlaylist = await playlist.save();
    const populatedPlaylist = await createdPlaylist.populate('owner', 'name avatar');

    res.status(201).json(populatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a playlist (title, description, coverUrl, songs)
// @route   PUT /api/playlists/:id
// @access  Private
export const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check ownership
    if (playlist.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this playlist' });
    }

    const { title, description, coverUrl, songs, isPublic, gradient } = req.body;

    if (title) playlist.title = title;
    if (description !== undefined) playlist.description = description;
    if (coverUrl) playlist.coverUrl = coverUrl;
    if (songs) playlist.songs = songs;
    if (isPublic !== undefined) playlist.isPublic = isPublic;
    if (gradient) playlist.gradient = gradient;

    const updatedPlaylist = await playlist.save();
    const populatedPlaylist = await updatedPlaylist.populate(['owner', 'songs']);

    res.json(populatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a playlist
// @route   DELETE /api/playlists/:id
// @access  Private
export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check ownership
    if (playlist.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this playlist' });
    }

    await playlist.deleteOne();
    res.json({ message: 'Playlist removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
