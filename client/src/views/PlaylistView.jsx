import React, { useState } from 'react';
import { Play, Pause, Heart, Clock, Search, MoreHorizontal, Shuffle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_SONGS } from '../data/mockData';

const PlaylistView = () => {
  const { 
    getSelectedEntity, 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlay, 
    likedSongIds, 
    toggleLikeSong 
  } = usePlayer();

  const [query, setQuery] = useState('');

  const entity = getSelectedEntity();
  if (!entity) return null;

  // Resolve songs inside this playlist
  const playlistSongs = entity.id === 'liked-songs'
    ? MOCK_SONGS.filter(s => likedSongIds.includes(s.id))
    : MOCK_SONGS.filter(s => (entity.songIds || []).includes(s.id));

  const displaySongs = playlistSongs.filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase())
  );

  const isPlaylistPlaying = isPlaying && displaySongs.some(s => s.id === currentTrack?.id);

  return (
    <div className="-mt-4 -mx-6 pb-12">
      {/* Dynamic Gradient Hero Header */}
      <div className={`bg-gradient-to-b ${entity.gradient || 'from-indigo-900 via-zinc-900 to-[#121212]'} p-8 pt-12 flex flex-col md:flex-row items-end gap-6 shadow-2xl`}>
        <img 
          src={entity.coverUrl} 
          alt={entity.title} 
          className="w-48 h-48 sm:w-56 sm:h-56 rounded-md object-cover shadow-2xl shrink-0" 
        />
        
        <div className="flex-1 space-y-2 text-white">
          <p className="text-xs font-bold uppercase tracking-wider">Playlist</p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
            {entity.title}
          </h1>
          <p className="text-sm text-gray-300 font-medium max-w-xl">
            {entity.description}
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 pt-2">
            <span className="text-white font-bold">{entity.owner || 'Spotify Clone'}</span>
            <span>•</span>
            <span>{playlistSongs.length} songs</span>
            <span>•</span>
            <span>{entity.likes || 'Popular'}</span>
          </div>
        </div>
      </div>

      {/* Action Bar & Filter */}
      <div className="bg-[#121212]/80 backdrop-blur-md px-8 py-6 flex items-center justify-between gap-4 border-b border-[#282828]">
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              if (isPlaylistPlaying) {
                togglePlay();
              } else if (displaySongs.length > 0) {
                playTrack(displaySongs[0], displaySongs);
              }
            }}
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center shadow-xl hover:scale-105 transition transform"
          >
            {isPlaylistPlaying ? (
              <Pause className="w-7 h-7 fill-black" />
            ) : (
              <Play className="w-7 h-7 fill-black translate-x-0.5" />
            )}
          </button>

          <button className="text-gray-400 hover:text-white transition">
            <Heart className="w-8 h-8" />
          </button>

          <button className="text-gray-400 hover:text-white transition">
            <MoreHorizontal className="w-7 h-7" />
          </button>
        </div>

        {/* Search within playlist */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in playlist"
            className="bg-[#242424] text-white text-xs rounded-full pl-9 pr-4 py-2 outline-none w-44 sm:w-56 focus:w-64 transition-all"
          />
        </div>
      </div>

      {/* Tracklist Table */}
      <div className="px-8 pt-4">
        {displaySongs.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-lg font-semibold">No songs found in this playlist</p>
            <p className="text-xs mt-1">Try searching for something else or add songs.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400 select-none">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="pb-3 w-10 text-center">#</th>
                <th className="pb-3">Title</th>
                <th className="pb-3 hidden md:table-cell">Album</th>
                <th className="pb-3 hidden lg:table-cell">Date added</th>
                <th className="pb-3 w-16 text-right pr-4">
                  <Clock className="w-4 h-4 inline" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-transparent">
              {displaySongs.map((song, index) => {
                const isCurrent = currentTrack?.id === song.id;
                const isLiked = likedSongIds.includes(song.id);

                return (
                  <tr
                    key={song.id}
                    onClick={() => playTrack(song, displaySongs)}
                    className={`group hover:bg-[#282828] cursor-pointer transition ${
                      isCurrent ? 'bg-[#282828]/50' : ''
                    }`}
                  >
                    {/* # / Play Icon */}
                    <td className="py-3 text-center font-mono text-xs">
                      {isCurrent && isPlaying ? (
                        <div className="flex items-end justify-center gap-[2px] h-3">
                          <span className="w-[3px] bg-green-500 rounded-full animate-bounce h-full"></span>
                          <span className="w-[3px] bg-green-500 rounded-full animate-bounce h-2/3"></span>
                          <span className="w-[3px] bg-green-500 rounded-full animate-bounce h-4/5"></span>
                        </div>
                      ) : (
                        <>
                          <span className="group-hover:hidden">{index + 1}</span>
                          <Play className="w-4 h-4 text-white fill-white hidden group-hover:inline-block mx-auto" />
                        </>
                      )}
                    </td>

                    {/* Title & Artist */}
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={song.coverUrl} 
                          alt={song.title} 
                          className="w-10 h-10 rounded object-cover shrink-0" 
                        />
                        <div>
                          <p className={`font-semibold text-sm truncate ${isCurrent ? 'text-green-500' : 'text-white'}`}>
                            {song.title}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                        </div>
                      </div>
                    </td>

                    {/* Album */}
                    <td className="py-3 hidden md:table-cell text-gray-400 hover:text-white truncate">
                      {song.album}
                    </td>

                    {/* Date Added */}
                    <td className="py-3 hidden lg:table-cell text-gray-400 text-xs">
                      {song.dateAdded || 'Recently'}
                    </td>

                    {/* Duration & Like */}
                    <td className="py-3 text-right pr-4 font-mono text-xs">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeSong(song.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition"
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'text-green-500 fill-green-500 opacity-100' : 'text-gray-400'}`} />
                        </button>
                        <span>{song.duration}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PlaylistView;
