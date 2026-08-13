import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an artist name'],
      trim: true,
      unique: true,
    },
    bio: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    },
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    followers: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;
