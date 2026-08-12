import React, { useState } from 'react';
import { Play, Pause, CheckCircle2, UserCheck, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_SONGS, MOCK_ALBUMS } from '../data/mockData';
import AlbumCard from '../components/AlbumCard';

const ArtistView = () => {
  const { getSelectedEntity, currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [isFollowing, setIsFollowing] = useState(false);

  const artist = getSelectedEntity();
  if (!artist) return null;

  const artistSongs = MOCK_SONGS.filter(s => s.artistId === artist.id || s.artist === artist.name);
  const artistAlbums = MOCK_ALBUMS.filter(a => a.artistId === artist.id || a.artist === artist.name);

  const isArtistPlaying = isPlaying && artistSongs.some(s => s.id === currentTrack?.id);

  return (
    <div className="-mt-4 -mx-6 pb-12">
      {/* Hero Header with Background Image Banner */}
      <div 
        className="relative h-80 bg-cover bg-center flex items-end p-8 shadow-2xl"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(18,18,18,1)), url(${artist.headerUrl || artist.avatarUrl})` }}
      >
        <div className="space-y-2 text-white z-10">
          {artist.verified && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
              <CheckCircle2 className="w-4 h-4 fill-blue-400 text-black" />
              Verified Artist
            </div>
          )}
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight">{artist.name}</h1>
          <p className="text-sm font-semibold text-gray-300">
            {artist.monthlyListeners} monthly listeners
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="px-8 py-6 flex items-center gap-6 border-b border-[#282828]">
        <button
          onClick={() => {
            if (isArtistPlaying) {
              togglePlay();
            } else if (artistSongs.length > 0) {
              playTrack(artistSongs[0], artistSongs);
            }
          }}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center shadow-xl hover:scale-105 transition"
        >
          {isArtistPlaying ? (
            <Pause className="w-7 h-7 fill-black" />
          ) : (
            <Play className="w-7 h-7 fill-black translate-x-0.5" />
          )}
        </button>

        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-5 py-1.5 rounded-full text-xs font-bold border transition ${
            isFollowing 
              ? 'bg-white text-black border-white' 
              : 'bg-transparent text-white border-gray-500 hover:border-white'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <button className="text-gray-400 hover:text-white transition">
          <MoreHorizontal className="w-7 h-7" />
        </button>
      </div>

      {/* Popular Tracks */}
      <div className="px-8 pt-6 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Popular</h2>
          <div className="space-y-1">
            {artistSongs.map((song, index) => {
              const isCurrent = currentTrack?.id === song.id;

              return (
                <div
                  key={song.id}
                  onClick={() => playTrack(song, artistSongs)}
                  className={`flex items-center justify-between p-2 rounded-md hover:bg-[#282828] cursor-pointer group transition ${
                    isCurrent ? 'bg-[#282828]' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-center font-mono text-xs text-gray-400 group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play className="w-4 h-4 text-white fill-white hidden group-hover:inline-block" />
                    <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded object-cover" />
                    <div>
                      <p className={`font-semibold text-sm ${isCurrent ? 'text-green-500' : 'text-white'}`}>
                        {song.title}
                      </p>
                      <p className="text-xs text-gray-400">{song.plays} plays</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-gray-400 pr-4">{song.duration}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Discography Albums */}
        {artistAlbums.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Discography</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {artistAlbums.map(album => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        )}

        {/* Artist Bio */}
        {artist.bio && (
          <section className="bg-[#181818] p-6 rounded-lg max-w-2xl">
            <h3 className="font-bold text-lg text-white mb-2">About</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{artist.bio}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArtistView;
