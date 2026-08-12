import React from 'react';
import { Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const ArtistCard = ({ artist }) => {
  const { navigateTo } = usePlayer();

  return (
    <div 
      onClick={() => navigateTo('artist', artist.id)}
      className="group bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition-all duration-300 cursor-pointer flex flex-col justify-between select-none"
    >
      <div className="relative mb-3 aspect-square rounded-full overflow-hidden bg-[#242424] shadow-lg">
        <img 
          src={artist.avatarUrl} 
          alt={artist.name}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105" 
        />
        
        <button
          className="absolute right-3 bottom-3 w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
        >
          <Play className="w-6 h-6 fill-black translate-x-0.5" />
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-white truncate">
          {artist.name}
        </h3>
        <p className="text-xs text-gray-400 truncate mt-1">
          Artist
        </p>
      </div>
    </div>
  );
};

export default ArtistCard;
