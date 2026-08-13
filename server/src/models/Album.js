import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an album title'],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, 'Please add an artist name'],
      trim: true,
    },
    artistRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
    },
    coverUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
    },
    releaseYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    genre: {
      type: String,
      default: 'Pop',
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Album = mongoose.model('Album', albumSchema);
export default Album;
