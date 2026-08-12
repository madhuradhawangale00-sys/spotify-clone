import React from 'react';
import { Search, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_SONGS, MOCK_ALBUMS, MOCK_ARTISTS, MOCK_GENRES } from '../data/mockData';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';

const SearchView = () => {
  const { searchQuery, setSearchQuery, playTrack } = usePlayer();

  const filteredSongs = MOCK_SONGS.filter(
    s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
         s.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArtists = MOCK_ARTISTS.filter(
    a => a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlbums = MOCK_ALBUMS.filter(
    a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         a.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topResult = filteredSongs[0] || null;

  return (
    <div className="space-y-8 pb-12">
      {/* Mobile Search Input */}
      <div className="md:hidden relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full bg-[#242424] text-white text-sm rounded-full pl-10 pr-4 py-2.5 outline-none"
        />
      </div>

      {searchQuery.trim() === '' ? (
        /* Browse All Categories Grid */
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {MOCK_GENRES.map((genre) => (
              <div
                key={genre.id}
                onClick={() => setSearchQuery(genre.name)}
                className={`relative h-40 ${genre.color} rounded-lg p-4 overflow-hidden cursor-pointer shadow-lg hover:scale-105 transition transform duration-200 select-none`}
              >
                <span className="font-bold text-xl text-white tracking-tight">
                  {genre.name}
                </span>
                <img
                  src={genre.imageUrl}
                  alt={genre.name}
                  className="absolute right-[-10px] bottom-[-10px] w-24 h-24 object-cover rotate-[25deg] shadow-xl rounded"
                />
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Search Results View */
        <div className="space-y-8">
          {/* Top Result + Songs List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Result Card */}
            {topResult && (
              <div className="lg:col-span-1">
                <h3 className="text-xl font-bold text-white mb-4">Top result</h3>
                <div 
                  onClick={() => playTrack(topResult, filteredSongs)}
                  className="group bg-[#181818] hover:bg-[#282828] p-6 rounded-lg transition duration-300 cursor-pointer relative flex flex-col justify-between h-56"
                >
                  <img
                    src={topResult.coverUrl}
                    alt={topResult.title}
                    className="w-20 h-20 rounded-md object-cover shadow-lg mb-4"
                  />
                  <div>
                    <h4 className="text-2xl font-extrabold text-white group-hover:text-green-400 transition">
                      {topResult.title}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Song • <span className="text-white font-medium">{topResult.artist}</span>
                    </p>
                  </div>
                  <button className="absolute right-6 bottom-6 w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition transform group-hover:scale-105">
                    <Play className="w-6 h-6 fill-black translate-x-0.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Songs Results List */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">Songs</h3>
              <div className="space-y-1">
                {filteredSongs.slice(0, 4).map((song) => (
                  <div
                    key={song.id}
                    onClick={() => playTrack(song, filteredSongs)}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-[#282828] cursor-pointer group transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-green-400 transition">{song.title}</p>
                        <p className="text-xs text-gray-400">{song.artist}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-400 pr-4">{song.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Artists Results */}
          {filteredArtists.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-white mb-4">Artists</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredArtists.map(artist => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {/* Albums Results */}
          {filteredAlbums.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-white mb-4">Albums</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredAlbums.map(album => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchView;
