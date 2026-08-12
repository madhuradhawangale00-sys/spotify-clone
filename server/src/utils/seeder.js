import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Song from '../models/Song.js';
import Playlist from '../models/Playlist.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const sampleSongs = [
  {
    title: 'Midnight Horizon',
    artist: 'Luna Eclipse',
    album: 'Neon Dreams',
    duration: '3:45',
    durationSeconds: 225,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Synthwave',
    plays: 1245890,
  },
  {
    title: 'Electric Pulse',
    artist: 'Neon Vibe',
    album: 'Cybernetic Wave',
    duration: '4:12',
    durationSeconds: 252,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Electronic',
    plays: 890320,
  },
  {
    title: 'Starlight Symphony',
    artist: 'Aria Sterling',
    album: 'Celestial Echoes',
    duration: '3:18',
    durationSeconds: 198,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Ambient',
    plays: 3410120,
  },
  {
    title: 'Urban Groove',
    artist: 'Metro Beats',
    album: 'City Lights',
    duration: '2:55',
    durationSeconds: 175,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Hip-Hop',
    plays: 2105400,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Song.deleteMany();
    await Playlist.deleteMany();

    console.log('Clearing existing data...');

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    console.log('Created Admin user: admin@example.com / password123');

    const createdSongs = await Song.insertMany(
      sampleSongs.map((s) => ({ ...s, uploadedBy: adminUser._id }))
    );

    console.log(`Seeded ${createdSongs.length} sample songs.`);

    await Playlist.create({
      title: "Today's Top Hits",
      description: 'The hottest tracks right now across all genres.',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
      owner: adminUser._id,
      songs: createdSongs.map((s) => s._id),
      gradient: 'from-purple-900 via-indigo-900 to-[#121212]',
    });

    console.log('Seeded sample playlist.');
    process.exit();
  } catch (error) {
    console.error(`Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
