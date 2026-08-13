import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        likedSongs: user.likedSongs,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('likedSongs')
      .populate('recentlyPlayed');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle liked song for user
// @route   POST /api/auth/like-song
// @access  Private
export const toggleLikeSong = async (req, res) => {
  try {
    const { songId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const songIndex = user.likedSongs.indexOf(songId);
    if (songIndex > -1) {
      user.likedSongs.splice(songIndex, 1);
    } else {
      user.likedSongs.push(songId);
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id)
      .select('-password')
      .populate('likedSongs')
      .populate('recentlyPlayed');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add song to user's recently played list
// @route   POST /api/auth/recently-played
// @access  Private
export const addRecentlyPlayed = async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ message: 'Song ID is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove if existing so it moves to front of recent history
    user.recentlyPlayed = user.recentlyPlayed.filter(id => id.toString() !== songId.toString());
    user.recentlyPlayed.unshift(songId);

    // Keep top 20 recent songs
    if (user.recentlyPlayed.length > 20) {
      user.recentlyPlayed = user.recentlyPlayed.slice(0, 20);
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id)
      .select('-password')
      .populate('likedSongs')
      .populate('recentlyPlayed');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


