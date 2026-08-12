import React from 'react';
import { Home, Search, Library, Music, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const MobileNav = () => {
  const { activeView, navigateTo, currentTrack, isPlaying, togglePlay, setIsMobilePlayerOpen } = usePlayer();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#000000]/95 backdrop-blur-lg border-t border-[#282828] select-none">
      {/* Mobile Mini Player Floating Header */}
      {currentTrack && (
        <div 
          onClick={() => setIsMobilePlayerOpen(true)}
          className="mx-2 mb-1 p-2 bg-[#282828] rounded-md flex items-center justify-between shadow-lg cursor-pointer"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title} 
              className="w-10 h-10 rounded object-cover shrink-0" 
            />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{currentTrack.title}</p>
              <p className="text-[10px] text-gray-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      )}

      {/* Main Bottom Tabs */}
      <div className="flex items-center justify-around py-2 text-xs font-medium border-t border-white/5">
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'home' ? 'text-white font-bold' : 'text-gray-400'
          }`}
        >
          <Home className="w-5 h-5" />
          Home
        </button>

        <button
          onClick={() => navigateTo('search')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'search' ? 'text-white font-bold' : 'text-gray-400'
          }`}
        >
          <Search className="w-5 h-5" />
          Search
        </button>

        <button
          onClick={() => navigateTo('library')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'library' ? 'text-white font-bold' : 'text-gray-400'
          }`}
        >
          <Library className="w-5 h-5" />
          Your Library
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
