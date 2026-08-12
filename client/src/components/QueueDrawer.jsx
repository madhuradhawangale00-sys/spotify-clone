import React from 'react';
import { X, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const QueueDrawer = () => {
  const { isQueueOpen, setIsQueueOpen, queue, currentTrack, playTrack } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed top-0 right-0 bottom-20 w-80 bg-[#121212] border-l border-[#282828] z-30 shadow-2xl p-4 flex flex-col overflow-hidden text-gray-200">
      <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
        <h3 className="font-bold text-base text-white">Play Queue</h3>
        <button
          onClick={() => setIsQueueOpen(false)}
          className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-[#282828]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1">
        {/* Now Playing */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Now Playing</h4>
          {currentTrack && (
            <div className="flex items-center gap-3 bg-[#282828] p-2 rounded-md">
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-12 h-12 rounded object-cover" />
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold text-green-400 truncate">{currentTrack.title}</p>
                <p className="text-xs text-gray-400 truncate">{currentTrack.artist}</p>
              </div>
            </div>
          )}
        </div>

        {/* Up Next */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Next Up</h4>
          <div className="space-y-1">
            {queue
              .filter((song) => song.id !== currentTrack?.id)
              .map((song) => (
                <div
                  key={song.id}
                  onClick={() => playTrack(song, queue)}
                  className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-md cursor-pointer group transition"
                >
                  <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded object-cover" />
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-medium text-white group-hover:text-green-400 truncate transition">
                      {song.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                  </div>
                  <Play className="w-4 h-4 opacity-0 group-hover:opacity-100 text-white" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueDrawer;
