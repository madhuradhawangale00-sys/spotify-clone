// Reusable mock data for Spotify Clone UI

export const SAMPLE_AUDIO_URLS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
];

export const MOCK_SONGS = [
  {
    id: 'song-1',
    title: 'Midnight Horizon',
    artist: 'Luna Eclipse',
    artistId: 'artist-1',
    album: 'Neon Dreams',
    albumId: 'album-1',
    duration: '3:45',
    durationSeconds: 225,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
    audioUrl: SAMPLE_AUDIO_URLS[0],
    plays: '1,245,890',
    dateAdded: '2 days ago',
    genre: 'Synthwave'
  },
  {
    id: 'song-2',
    title: 'Electric Pulse',
    artist: 'Neon Vibe',
    artistId: 'artist-2',
    album: 'Cybernetic Wave',
    albumId: 'album-2',
    duration: '4:12',
    durationSeconds: 252,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    audioUrl: SAMPLE_AUDIO_URLS[1],
    plays: '890,320',
    dateAdded: '5 days ago',
    genre: 'Electronic'
  },
  {
    id: 'song-3',
    title: 'Starlight Symphony',
    artist: 'Aria Sterling',
    artistId: 'artist-3',
    album: 'Celestial Echoes',
    albumId: 'album-3',
    duration: '3:18',
    durationSeconds: 198,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    audioUrl: SAMPLE_AUDIO_URLS[2],
    plays: '3,410,120',
    dateAdded: '1 week ago',
    genre: 'Ambient'
  },
  {
    id: 'song-4',
    title: 'Urban Groove',
    artist: 'Metro Beats',
    artistId: 'artist-4',
    album: 'City Lights',
    albumId: 'album-4',
    duration: '2:55',
    durationSeconds: 175,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    audioUrl: SAMPLE_AUDIO_URLS[3],
    plays: '2,105,400',
    dateAdded: '2 weeks ago',
    genre: 'Hip-Hop'
  },
  {
    id: 'song-5',
    title: 'Velvet Sunset',
    artist: 'Luna Eclipse',
    artistId: 'artist-1',
    album: 'Neon Dreams',
    albumId: 'album-1',
    duration: '3:30',
    durationSeconds: 210,
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop',
    audioUrl: SAMPLE_AUDIO_URLS[4],
    plays: '745,190',
    dateAdded: '3 weeks ago',
    genre: 'Chillout'
  },
  {
    id: 'song-6',
    title: 'Ocean Breeze',
    artist: 'Coasta',
    artistId: 'artist-5',
    album: 'Tidal Waves',
    albumId: 'album-5',
    duration: '3:05',
    durationSeconds: 185,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop',
    audioUrl: SAMPLE_AUDIO_URLS[5],
    plays: '512,890',
    dateAdded: '1 month ago',
    genre: 'Indie Pop'
  },
  {
    id: 'song-7',
    title: 'Golden Hour Reverie',
    artist: 'Aria Sterling',
    artistId: 'artist-3',
    album: 'Celestial Echoes',
    albumId: 'album-3',
    duration: '4:02',
    durationSeconds: 242,
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop',
    audioUrl: SAMPLE_AUDIO_URLS[6],
    plays: '1,890,000',
    dateAdded: '1 month ago',
    genre: 'Acoustic'
  },
  {
    id: 'song-8',
    title: 'Retro Galaxy',
    artist: 'Neon Vibe',
    artistId: 'artist-2',
    album: 'Cybernetic Wave',
    albumId: 'album-2',
    duration: '3:50',
    durationSeconds: 230,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    audioUrl: SAMPLE_AUDIO_URLS[7],
    plays: '984,210',
    dateAdded: '2 months ago',
    genre: 'Synthwave'
  }
];

export const MOCK_ALBUMS = [
  {
    id: 'album-1',
    title: 'Neon Dreams',
    artist: 'Luna Eclipse',
    artistId: 'artist-1',
    year: '2025',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
    songCount: 12,
    genre: 'Synthwave'
  },
  {
    id: 'album-2',
    title: 'Cybernetic Wave',
    artist: 'Neon Vibe',
    artistId: 'artist-2',
    year: '2024',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    songCount: 10,
    genre: 'Electronic'
  },
  {
    id: 'album-3',
    title: 'Celestial Echoes',
    artist: 'Aria Sterling',
    artistId: 'artist-3',
    year: '2025',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    songCount: 8,
    genre: 'Ambient'
  },
  {
    id: 'album-4',
    title: 'City Lights',
    artist: 'Metro Beats',
    artistId: 'artist-4',
    year: '2023',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    songCount: 14,
    genre: 'Hip-Hop'
  },
  {
    id: 'album-5',
    title: 'Tidal Waves',
    artist: 'Coasta',
    artistId: 'artist-5',
    year: '2024',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop',
    songCount: 9,
    genre: 'Indie Pop'
  }
];

export const MOCK_ARTISTS = [
  {
    id: 'artist-1',
    name: 'Luna Eclipse',
    monthlyListeners: '4,521,098',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    headerUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop',
    verified: true,
    bio: 'Electronic & Synthwave producer crafting futuristic atmospheres and nostalgic midnight vibes.'
  },
  {
    id: 'artist-2',
    name: 'Neon Vibe',
    monthlyListeners: '2,890,430',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    headerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    verified: true,
    bio: 'Cyberpunk beats and high-octane basslines for night drivers and digital explorers.'
  },
  {
    id: 'artist-3',
    name: 'Aria Sterling',
    monthlyListeners: '6,102,990',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
    headerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    verified: true,
    bio: 'Grammy-nominated ambient vocalist and soundscape architect blending classical harp with modern synths.'
  },
  {
    id: 'artist-4',
    name: 'Metro Beats',
    monthlyListeners: '1,940,210',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    headerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    verified: false,
    bio: 'Underground lo-fi and urban hip-hop beats directly from downtown studio underground sessions.'
  },
  {
    id: 'artist-5',
    name: 'Coasta',
    monthlyListeners: '3,140,880',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop',
    headerUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop',
    verified: true,
    bio: 'Sun-drenched indie pop and coastal acoustic rhythms.'
  }
];

export const MOCK_PLAYLISTS = [
  {
    id: 'playlist-1',
    title: 'Today\'s Top Hits',
    description: 'The hottest tracks right now across all genres.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    owner: 'Spotify Clone',
    likes: '1,420,890',
    songIds: ['song-1', 'song-2', 'song-3', 'song-4', 'song-5'],
    gradient: 'from-purple-900 via-indigo-900 to-[#121212]'
  },
  {
    id: 'playlist-2',
    title: 'Synthwave & Cyberpunk',
    description: 'Retro futuristic synths, neon lights, and dark pulse rhythms.',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
    owner: 'Spotify Clone',
    likes: '842,100',
    songIds: ['song-1', 'song-8', 'song-2', 'song-5'],
    gradient: 'from-fuchsia-900 via-pink-950 to-[#121212]'
  },
  {
    id: 'playlist-3',
    title: 'Chillout Soundscapes',
    description: 'Relaxing ambient beats for study, work, and late night relaxation.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    owner: 'Spotify Clone',
    likes: '620,450',
    songIds: ['song-3', 'song-5', 'song-7', 'song-6'],
    gradient: 'from-blue-900 via-sky-950 to-[#121212]'
  },
  {
    id: 'playlist-4',
    title: 'Urban Hip-Hop Essentials',
    description: 'Smooth flows, heavy 808s, and raw city storytelling.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    owner: 'Spotify Clone',
    likes: '954,300',
    songIds: ['song-4', 'song-2', 'song-1'],
    gradient: 'from-emerald-900 via-teal-950 to-[#121212]'
  },
  {
    id: 'playlist-5',
    title: 'Summer Acoustic Chill',
    description: 'Feel-good acoustic melodies and sunny vibes.',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop',
    owner: 'Spotify Clone',
    likes: '410,200',
    songIds: ['song-6', 'song-7', 'song-3'],
    gradient: 'from-amber-900 via-orange-950 to-[#121212]'
  }
];

export const MOCK_GENRES = [
  { id: 'g-1', name: 'Pop', color: 'bg-pink-600', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop' },
  { id: 'g-2', name: 'Hip-Hop', color: 'bg-orange-600', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop' },
  { id: 'g-3', name: 'Electronic', color: 'bg-purple-600', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop' },
  { id: 'g-4', name: 'Synthwave', color: 'bg-cyan-600', imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop' },
  { id: 'g-5', name: 'Indie', color: 'bg-emerald-600', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=300&auto=format&fit=crop' },
  { id: 'g-6', name: 'Chill', color: 'bg-indigo-600', imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=300&auto=format&fit=crop' },
  { id: 'g-7', name: 'Rock', color: 'bg-red-600', imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=300&auto=format&fit=crop' },
  { id: 'g-8', name: 'Ambient', color: 'bg-teal-600', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop' },
  { id: 'g-9', name: 'Workout', color: 'bg-lime-600', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop' },
  { id: 'g-10', name: 'Focus', color: 'bg-blue-600', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=300&auto=format&fit=crop' },
];
