import React from 'react';
import { 
  ChevronDown, Heart, Shuffle, SkipBack, Play, Pause, 
  SkipForward, Repeat 
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const formatTime = (secs) => {
  if (isNaN(secs) || secs === null) return '0:00';
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const MobilePlayerModal = () => {
  const { 
    isMobilePlayerOpen, 
    setIsMobilePlayerOpen, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    currentTime, 
    duration, 
    seekTo, 
    handleNextTrack, 
    handlePrevTrack, 
    isShuffle, 
    setIsShuffle, 
    isRepeat, 
    setIsRepeat, 
    likedSongIds, 
    toggleLikeSong
  } = usePlayer();

  if (!isMobilePlayerOpen || !currentTrack) return null;

  const isLiked = likedSongIds.includes(currentTrack.id);
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-indigo-950 via-[#121212] to-black flex flex-col justify-between p-6 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setIsMobilePlayerOpen(false)}
          className="p-2 text-white rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">PLAYING FROM PLAYLIST</p>
          <p className="text-xs font-semibold text-white">Spotify Clone Hits</p>
        </div>

        <button 
          onClick={() => toggleLikeSong(currentTrack.id)}
          className="p-2 text-white"
        >
          <Heart className={`w-6 h-6 ${isLiked ? 'text-green-500 fill-green-500' : ''}`} />
        </button>
      </div>

      {/* Album Artwork */}
      <div className="my-auto px-4">
        <img 
          src={currentTrack.coverUrl} 
          alt={currentTrack.title} 
          className="w-full aspect-square rounded-lg object-cover shadow-2xl" 
        />
      </div>

      {/* Song Info & Controls */}
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{currentTrack.title}</h2>
            <p className="text-base text-gray-400 font-medium">{currentTrack.artist}</p>
          </div>
          <button onClick={() => toggleLikeSong(currentTrack.id)}>
            <Heart className={`w-6 h-6 ${isLiked ? 'text-green-500 fill-green-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Progress Slider */}
        <div className="space-y-1">
          <div className="relative w-full py-2 cursor-pointer flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime || 0}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-white h-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
          <div className="flex justify-between text-xs font-mono text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Action Row */}
        <div className="flex items-center justify-between px-4">
          <button onClick={() => setIsShuffle(!isShuffle)}>
            <Shuffle className={`w-6 h-6 ${isShuffle ? 'text-green-500' : 'text-gray-400'}`} />
          </button>
          <button onClick={handlePrevTrack}>
            <SkipBack className="w-8 h-8 text-white fill-current" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 transition"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-black" />
            ) : (
              <Play className="w-8 h-8 fill-black translate-x-0.5" />
            )}
          </button>
          <button onClick={handleNextTrack}>
            <SkipForward className="w-8 h-8 text-white fill-current" />
          </button>
          <button onClick={() => setIsRepeat(!isRepeat)}>
            <Repeat className={`w-6 h-6 ${isRepeat ? 'text-green-500' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobilePlayerModal;
