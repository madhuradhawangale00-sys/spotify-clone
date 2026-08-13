import React, { useState } from 'react';
import { Play, Pause, Heart, Plus, Check } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const SongCard = ({ song, queue }) => {
  const { currentTrack, isPlaying, playTrack, toggleLikeSong, likedSongIds, playlists, addSongToPlaylist } = usePlayer();
  const [showMenu, setShowMenu] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const songId = song._id || song.id;
  const currentId = currentTrack?._id || currentTrack?.id;
  const isCurrent = currentId === songId;
  const isLiked = likedSongIds.includes(songId);

  const handleAddToPlaylist = async (playlistId, e) => {
    e.stopPropagation();
    await addSongToPlaylist(playlistId, songId);
    setShowMenu(false);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="group bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition-all duration-300 cursor-pointer flex flex-col justify-between select-none relative">
      <div className="relative mb-3 aspect-square rounded-md overflow-hidden bg-[#242424] shadow-md">
        <img 
          src={song.coverUrl} 
          alt={song.title}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105" 
        />
        
        {/* Play Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playTrack(song, queue);
          }}
          className={`absolute right-3 bottom-3 w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl transition-all duration-300 transform ${
            isCurrent && isPlaying
              ? 'opacity-100 translate-y-0 scale-105'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110'
          }`}
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          )}
        </button>

        {/* Like & Add Buttons on Top Right */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeSong(songId);
            }}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 transition"
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-emerald-500 fill-emerald-500' : 'text-white'}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 transition text-white"
            title="Add to Playlist"
          >
            {addedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Add to Playlist Popup Menu */}
        {showMenu && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-10 right-2 w-48 bg-[#282828] border border-white/10 rounded-xl shadow-2xl py-2 z-50 text-xs"
          >
            <div className="px-3 py-1 text-gray-400 font-bold border-b border-white/10 uppercase tracking-wider text-[10px]">
              Add to Playlist
            </div>
            {playlists && playlists.length > 0 ? (
              playlists.map((pl) => (
                <button
                  key={pl._id || pl.id}
                  onClick={(e) => handleAddToPlaylist(pl._id || pl.id, e)}
                  className="w-full text-left px-3 py-2 hover:bg-[#383838] text-gray-200 hover:text-white truncate flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{pl.title}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-400 italic">No playlists created</div>
            )}
          </div>
        )}
      </div>

      <div>
        <h3 className={`font-semibold text-sm truncate ${isCurrent ? 'text-emerald-500' : 'text-white'}`}>
          {song.title}
        </h3>
        <p className="text-xs text-gray-400 truncate mt-1 hover:underline">
          {song.artist}
        </p>
      </div>
    </div>
  );
};

export default SongCard;
