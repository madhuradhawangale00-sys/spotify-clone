import React from 'react';
import { Play, Pause, Heart, Clock, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_SONGS } from '../data/mockData';

const AlbumView = () => {
  const { 
    getSelectedEntity, 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlay, 
    likedSongIds, 
    toggleLikeSong 
  } = usePlayer();

  const album = getSelectedEntity();
  if (!album) return null;

  const albumSongs = MOCK_SONGS.filter(s => s.albumId === album.id || s.album === album.title);

  const isAlbumPlaying = isPlaying && albumSongs.some(s => s.id === currentTrack?.id);

  return (
    <div className="-mt-4 -mx-6 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-teal-900 via-zinc-900 to-[#121212] p-8 pt-12 flex flex-col md:flex-row items-end gap-6 shadow-2xl">
        <img 
          src={album.coverUrl} 
          alt={album.title} 
          className="w-48 h-48 sm:w-56 sm:h-56 rounded-md object-cover shadow-2xl shrink-0" 
        />
        
        <div className="flex-1 space-y-2 text-white">
          <p className="text-xs font-bold uppercase tracking-wider">Album</p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
            {album.title}
          </h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 pt-2">
            <span className="text-white font-bold">{album.artist}</span>
            <span>•</span>
            <span>{album.year}</span>
            <span>•</span>
            <span>{albumSongs.length} songs</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="px-8 py-6 flex items-center gap-6 border-b border-[#282828]">
        <button
          onClick={() => {
            if (isAlbumPlaying) {
              togglePlay();
            } else if (albumSongs.length > 0) {
              playTrack(albumSongs[0], albumSongs);
            }
          }}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center shadow-xl hover:scale-105 transition"
        >
          {isAlbumPlaying ? (
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

      {/* Tracklist Table */}
      <div className="px-8 pt-4">
        <table className="w-full text-left text-sm text-gray-400 select-none">
          <thead>
            <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <th className="pb-3 w-10 text-center">#</th>
              <th className="pb-3">Title</th>
              <th className="pb-3 w-16 text-right pr-4">
                <Clock className="w-4 h-4 inline" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {albumSongs.map((song, index) => {
              const isCurrent = currentTrack?.id === song.id;
              const isLiked = likedSongIds.includes(song.id);

              return (
                <tr
                  key={song.id}
                  onClick={() => playTrack(song, albumSongs)}
                  className={`group hover:bg-[#282828] cursor-pointer transition ${
                    isCurrent ? 'bg-[#282828]/50' : ''
                  }`}
                >
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

                  <td className="py-3">
                    <div>
                      <p className={`font-semibold text-sm ${isCurrent ? 'text-green-500' : 'text-white'}`}>
                        {song.title}
                      </p>
                      <p className="text-xs text-gray-400">{song.artist}</p>
                    </div>
                  </td>

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
      </div>
    </div>
  );
};

export default AlbumView;
