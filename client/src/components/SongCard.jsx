import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const SongCard = ({ song, queue }) => {
  const { currentTrack, isPlaying, playTrack, toggleLikeSong, likedSongIds } = usePlayer();

  const isCurrent = currentTrack?.id === song.id;
  const isLiked = likedSongIds.includes(song.id);

  return (
    <div className="group bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition-all duration-300 cursor-pointer flex flex-col justify-between select-none">
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
          className={`absolute right-3 bottom-3 w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center shadow-xl transition-all duration-300 transform ${
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

        {/* Like indicator on top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLikeSong(song.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'text-green-500 fill-green-500' : 'text-white'}`} />
        </button>
      </div>

      <div>
        <h3 className={`font-semibold text-sm truncate ${isCurrent ? 'text-green-500' : 'text-white'}`}>
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
