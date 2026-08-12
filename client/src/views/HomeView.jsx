import React from 'react';
import { Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_SONGS, MOCK_ALBUMS, MOCK_ARTISTS, MOCK_PLAYLISTS } from '../data/mockData';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const HomeView = () => {
  const { navigateTo, playTrack } = usePlayer();

  const quickPicks = [
    { title: 'Liked Songs', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop', action: () => navigateTo('playlist', 'liked-songs') },
    ...MOCK_PLAYLISTS.slice(0, 5).map(p => ({
      title: p.title,
      cover: p.coverUrl,
      action: () => navigateTo('playlist', p.id)
    }))
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting & Quick Picks Grid */}
      <section>
        <h1 className="text-3xl font-extrabold text-white mb-6 tracking-tight">
          {getGreeting()}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickPicks.map((pick, i) => (
            <div
              key={i}
              onClick={pick.action}
              className="group relative flex items-center bg-[#282828]/60 hover:bg-[#343434] rounded-md overflow-hidden transition-all duration-300 cursor-pointer shadow-md"
            >
              <img 
                src={pick.cover} 
                alt={pick.title} 
                className="w-20 h-20 object-cover shrink-0" 
              />
              <span className="font-bold text-sm text-white px-4 truncate">
                {pick.title}
              </span>

              <button className="absolute right-4 w-11 h-11 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-105">
                <Play className="w-5 h-5 fill-black translate-x-0.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Songs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
            Trending Songs
          </h2>
          <button 
            onClick={() => navigateTo('search')}
            className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider"
          >
            Show all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MOCK_SONGS.slice(0, 5).map((song) => (
            <SongCard key={song.id} song={song} queue={MOCK_SONGS} />
          ))}
        </div>
      </section>

      {/* Top Artists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
            Popular Artists
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MOCK_ARTISTS.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* Recommended Albums */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
            Popular Albums
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MOCK_ALBUMS.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
