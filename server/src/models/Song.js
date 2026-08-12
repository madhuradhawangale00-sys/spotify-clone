import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a song title'],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, 'Please add an artist name'],
      trim: true,
    },
    album: {
      type: String,
      default: 'Single',
      trim: true,
    },
    duration: {
      type: String,
      default: '3:30',
    },
    durationSeconds: {
      type: Number,
      default: 210,
    },
    coverUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
    },
    audioUrl: {
      type: String,
      required: [true, 'Please add an audio file URL'],
    },
    genre: {
      type: String,
      default: 'Pop',
    },
    plays: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model('Song', songSchema);
export default Song;
