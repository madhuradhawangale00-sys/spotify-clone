import React, { useState } from 'react';
import { Plus, Heart, Grid, List } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_ARTISTS, MOCK_ALBUMS } from '../data/mockData';

const LibraryView = () => {
  const { navigateTo, userPlaylists, createPlaylist, likedSongIds } = usePlayer();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'playlists' | 'artists' | 'albums'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Library</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={createPlaylist}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold text-xs px-4 py-2 rounded-full transition shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Create Playlist
          </button>

          <div className="flex items-center bg-[#282828] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#383838] text-white' : 'text-gray-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#383838] text-white' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#282828] pb-3">
        {['all', 'playlists', 'artists', 'albums'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition ${
              activeTab === tab
                ? 'bg-white text-black'
                : 'bg-[#242424] text-white hover:bg-[#2e2e2e]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid or List Layout */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Liked Songs Tile */}
          {(activeTab === 'all' || activeTab === 'playlists') && (
            <div
              onClick={() => navigateTo('playlist', 'liked-songs')}
              className="bg-gradient-to-br from-indigo-700 via-purple-800 to-emerald-600 p-5 rounded-lg flex flex-col justify-between h-48 cursor-pointer shadow-xl hover:scale-105 transition transform duration-200"
            >
              <div className="flex justify-between items-start">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-2xl text-white">Liked Songs</h3>
                <p className="text-xs text-white/80 mt-1 font-medium">{likedSongIds.length} liked songs</p>
              </div>
            </div>
          )}

          {/* User Playlists */}
          {(activeTab === 'all' || activeTab === 'playlists') &&
            userPlaylists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => navigateTo('playlist', pl.id)}
                className="bg-[#181818] hover:bg-[#282828] p-4 rounded-lg cursor-pointer transition flex flex-col justify-between group"
              >
                <img src={pl.coverUrl} alt={pl.title} className="w-full aspect-square rounded-md object-cover mb-3" />
                <div>
                  <h4 className="font-semibold text-sm text-white truncate">{pl.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">Playlist • {pl.owner}</p>
                </div>
              </div>
            ))}

          {/* Artists */}
          {(activeTab === 'all' || activeTab === 'artists') &&
            MOCK_ARTISTS.map((art) => (
              <div
                key={art.id}
                onClick={() => navigateTo('artist', art.id)}
                className="bg-[#181818] hover:bg-[#282828] p-4 rounded-lg cursor-pointer transition flex flex-col justify-between group"
              >
                <img src={art.avatarUrl} alt={art.name} className="w-full aspect-square rounded-full object-cover mb-3" />
                <div>
                  <h4 className="font-semibold text-sm text-white truncate">{art.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">Artist</p>
                </div>
              </div>
            ))}

          {/* Albums */}
          {(activeTab === 'all' || activeTab === 'albums') &&
            MOCK_ALBUMS.map((alb) => (
              <div
                key={alb.id}
                onClick={() => navigateTo('album', alb.id)}
                className="bg-[#181818] hover:bg-[#282828] p-4 rounded-lg cursor-pointer transition flex flex-col justify-between group"
              >
                <img src={alb.coverUrl} alt={alb.title} className="w-full aspect-square rounded-md object-cover mb-3" />
                <div>
                  <h4 className="font-semibold text-sm text-white truncate">{alb.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">Album • {alb.artist}</p>
                </div>
              </div>
            ))}
        </div>
      ) : (
        /* List Mode */
        <div className="space-y-1">
          {/* Liked Songs List Row */}
          {(activeTab === 'all' || activeTab === 'playlists') && (
            <div
              onClick={() => navigateTo('playlist', 'liked-songs')}
              className="flex items-center gap-4 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-emerald-400 rounded flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Liked Songs</p>
                <p className="text-xs text-gray-400">Playlist • {likedSongIds.length} songs</p>
              </div>
            </div>
          )}

          {/* User Playlists */}
          {(activeTab === 'all' || activeTab === 'playlists') &&
            userPlaylists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => navigateTo('playlist', pl.id)}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition"
              >
                <img src={pl.coverUrl} alt={pl.title} className="w-12 h-12 rounded object-cover" />
                <div>
                  <p className="font-semibold text-sm text-white">{pl.title}</p>
                  <p className="text-xs text-gray-400">Playlist • {pl.owner}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default LibraryView;
