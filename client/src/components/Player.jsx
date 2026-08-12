import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, 
  Volume2, VolumeX, Heart, ListMusic, Maximize2, Mic2 
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const formatTime = (secs) => {
  if (isNaN(secs) || secs === null) return '0:00';
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Player = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    currentTime, 
    duration, 
    seekTo, 
    handleNextTrack, 
    handlePrevTrack, 
    volume, 
    setVolume, 
    isMuted, 
    setIsMuted, 
    isShuffle, 
    setIsShuffle, 
    isRepeat, 
    setIsRepeat,
    likedSongIds,
    toggleLikeSong,
    isQueueOpen,
    setIsQueueOpen,
    setIsMobilePlayerOpen
  } = usePlayer();

  if (!currentTrack) return null;

  const isLiked = likedSongIds.includes(currentTrack.id);
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-[#000000] border-t border-[#282828] px-4 flex items-center justify-between select-none">
      {/* Left: Track Details */}
      <div className="flex items-center gap-3 w-1/4 min-w-[180px]">
        <div 
          onClick={() => setIsMobilePlayerOpen(true)}
          className="relative w-14 h-14 bg-[#181818] rounded overflow-hidden cursor-pointer group shrink-0 shadow-md"
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <Maximize2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white truncate cursor-pointer hover:underline">
              {currentTrack.title}
            </h4>

            {/* Live Playing Equalizer Bars */}
            {isPlaying && (
              <div className="flex items-end gap-[2px] h-3">
                <span className="w-[3px] bg-green-500 rounded-full animate-bounce h-full" style={{ animationDuration: '0.6s' }}></span>
                <span className="w-[3px] bg-green-500 rounded-full animate-bounce h-2/3" style={{ animationDuration: '0.8s' }}></span>
                <span className="w-[3px] bg-green-500 rounded-full animate-bounce h-4/5" style={{ animationDuration: '0.5s' }}></span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 truncate hover:underline cursor-pointer">
            {currentTrack.artist}
          </p>
        </div>

        <button
          onClick={() => toggleLikeSong(currentTrack.id)}
          className="ml-2 text-gray-400 hover:text-white transition"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'text-green-500 fill-green-500' : ''}`} />
        </button>
      </div>

      {/* Center: Playback Controls & Timeline */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`transition ${isShuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
            title="Enable shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrevTrack}
            className="text-gray-400 hover:text-white transition"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white hover:scale-105 text-black flex items-center justify-center transition shadow-lg"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black translate-x-0.5" />
            )}
          </button>

          <button
            onClick={handleNextTrack}
            className="text-gray-400 hover:text-white transition"
            title="Next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`transition ${isRepeat ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
            title="Enable repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-2 w-full text-xs font-mono text-gray-400">
          <span>{formatTime(currentTime)}</span>
          
          <div className="relative flex-1 group py-2 cursor-pointer flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime || 0}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full bg-[#4d4d4d] h-1 rounded-full overflow-hidden">
              <div 
                className="bg-white group-hover:bg-green-500 h-full transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Extra Controls */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
        <button className="text-gray-400 hover:text-white transition hidden sm:block">
          <Mic2 className="w-4 h-4" />
        </button>

        <button 
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`transition hidden sm:block ${isQueueOpen ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
          title="Queue"
        >
          <ListMusic className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-400 hover:text-white transition"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          <div className="relative w-24 group py-2 cursor-pointer hidden sm:flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full bg-[#4d4d4d] h-1 rounded-full overflow-hidden">
              <div 
                className="bg-white group-hover:bg-green-500 h-full transition-all duration-75"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Player;
