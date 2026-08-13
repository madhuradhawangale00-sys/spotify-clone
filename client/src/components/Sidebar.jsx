import React from 'react';
import { Home, Search, Library, Plus, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_ARTISTS, MOCK_ALBUMS } from '../data/mockData';

const Sidebar = () => {
  const { 
    activeView, 
    navigateTo, 
    userPlaylists, 
    openCreatePlaylistModal, 
    selectedEntityId,
    likedSongIds 
  } = usePlayer();

  return (
    <aside className="w-64 bg-[#121212] rounded-lg flex flex-col h-full overflow-hidden text-gray-300 select-none">
      {/* Top Navigation Block */}
      <div className="bg-[#121212] p-4 space-y-4 rounded-lg">
        <div 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 px-2 cursor-pointer group mb-2"
        >
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-black text-black text-lg group-hover:scale-105 transition shadow-lg shadow-emerald-500/20">
            S
          </div>
          <span className="font-bold text-white text-lg tracking-tight group-hover:text-emerald-400 transition">
            Spotify Clone
          </span>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => navigateTo('home')}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md font-semibold text-sm transition duration-200 ${
              activeView === 'home' 
                ? 'text-white bg-[#282828]' 
                : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
            }`}
          >
            <Home className="w-5 h-5" />
            Home
          </button>

          <button
            onClick={() => navigateTo('search')}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md font-semibold text-sm transition duration-200 ${
              activeView === 'search' 
                ? 'text-white bg-[#282828]' 
                : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
            }`}
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </nav>
      </div>

      {/* Your Library Section */}
      <div className="flex-1 bg-[#121212] mt-2 p-3 rounded-lg flex flex-col min-h-0">
        <div className="flex items-center justify-between px-2 mb-3">
          <button
            onClick={() => navigateTo('library')}
            className={`flex items-center gap-2 font-bold text-sm hover:text-white transition ${
              activeView === 'library' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <Library className="w-5 h-5" />
            Your Library
          </button>

          <button
            onClick={openCreatePlaylistModal}
            title="Create playlist"
            className="p-1.5 rounded-full hover:bg-[#282828] text-gray-400 hover:text-white transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Library Items */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {/* Liked Songs Tile */}
          <div
            onClick={() => navigateTo('playlist', 'liked-songs')}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
              activeView === 'playlist' && selectedEntityId === 'liked-songs'
                ? 'bg-[#282828] text-white'
                : 'hover:bg-[#1a1a1a]'
            }`}
          >
            <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-600 to-emerald-400 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-white truncate">Liked Songs</p>
              <p className="text-xs text-gray-400 truncate">Playlist • {likedSongIds.length} songs</p>
            </div>
          </div>

          {/* User Playlists */}
          {userPlaylists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => navigateTo('playlist', pl.id)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
                activeView === 'playlist' && selectedEntityId === pl.id
                  ? 'bg-[#282828] text-white'
                  : 'hover:bg-[#1a1a1a]'
              }`}
            >
              <img 
                src={pl.coverUrl} 
                alt={pl.title} 
                className="w-12 h-12 rounded object-cover shrink-0" 
              />
              <div className="overflow-hidden">
                <p className="font-semibold text-sm text-white truncate">{pl.title}</p>
                <p className="text-xs text-gray-400 truncate">Playlist • {pl.owner}</p>
              </div>
            </div>
          ))}

          {/* Followed Artists */}
          {MOCK_ARTISTS.slice(0, 3).map((art) => (
            <div
              key={art.id}
              onClick={() => navigateTo('artist', art.id)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
                activeView === 'artist' && selectedEntityId === art.id
                  ? 'bg-[#282828] text-white'
                  : 'hover:bg-[#1a1a1a]'
              }`}
            >
              <img 
                src={art.avatarUrl} 
                alt={art.name} 
                className="w-12 h-12 rounded-full object-cover shrink-0" 
              />
              <div className="overflow-hidden">
                <p className="font-semibold text-sm text-white truncate">{art.name}</p>
                <p className="text-xs text-gray-400 truncate">Artist</p>
              </div>
            </div>
          ))}

          {/* Saved Albums */}
          {MOCK_ALBUMS.slice(0, 2).map((alb) => (
            <div
              key={alb.id}
              onClick={() => navigateTo('album', alb.id)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
                activeView === 'album' && selectedEntityId === alb.id
                  ? 'bg-[#282828] text-white'
                  : 'hover:bg-[#1a1a1a]'
              }`}
            >
              <img 
                src={alb.coverUrl} 
                alt={alb.title} 
                className="w-12 h-12 rounded object-cover shrink-0" 
              />
              <div className="overflow-hidden">
                <p className="font-semibold text-sm text-white truncate">{alb.title}</p>
                <p className="text-xs text-gray-400 truncate">Album • {alb.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
