import React from 'react';

function App() {
  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
      {/* Main Layout Area */}
      <div className="flex flex-1 p-2 gap-2 overflow-hidden">
        {/* Sidebar Placeholder */}
        <aside className="w-64 bg-[#121212] rounded-lg p-4 flex flex-col justify-between hidden md:flex">
          <div>
            <div className="flex items-center gap-2 mb-6 px-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-black text-xl">
                S
              </div>
              <span className="font-bold text-xl tracking-tight">Spotify Clone</span>
            </div>
            
            <nav className="space-y-4">
              <div className="flex items-center gap-4 text-gray-300 hover:text-white cursor-pointer px-2 py-1 font-medium transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                Home
              </div>
              <div className="flex items-center gap-4 text-gray-300 hover:text-white cursor-pointer px-2 py-1 font-medium transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Search
              </div>
              <div className="flex items-center gap-4 text-gray-300 hover:text-white cursor-pointer px-2 py-1 font-medium transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Your Library
              </div>
            </nav>
          </div>

          <div className="bg-[#1e1e1e] p-4 rounded-md">
            <h4 className="font-semibold text-sm">Create your first playlist</h4>
            <p className="text-xs text-gray-400 mt-1">It's easy, we'll help you</p>
            <button className="mt-3 bg-white text-black px-4 py-1.5 rounded-full font-bold text-xs hover:scale-105 transition">
              Create playlist
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-gradient-to-b from-[#202020] to-[#121212] rounded-lg p-6 overflow-y-auto">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome to Spotify Clone</h1>
            <div className="flex gap-3">
              <button className="text-gray-300 hover:text-white font-bold text-sm px-4 py-2">Sign Up</button>
              <button className="bg-white text-black font-bold text-sm px-6 py-2 rounded-full hover:scale-105 transition">Log In</button>
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Project Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center font-bold mb-3">
                  FE
                </div>
                <h3 className="font-semibold text-lg">React + Vite</h3>
                <p className="text-xs text-gray-400 mt-1">Fast frontend with modular components and Tailwind CSS styling.</p>
              </div>

              <div className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold mb-3">
                  BE
                </div>
                <h3 className="font-semibold text-lg">Node + Express</h3>
                <p className="text-xs text-gray-400 mt-1">RESTful API backend supporting auth, tracks, and playlists.</p>
              </div>

              <div className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer">
                <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center font-bold mb-3">
                  DB
                </div>
                <h3 className="font-semibold text-lg">MongoDB + Mongoose</h3>
                <p className="text-xs text-gray-400 mt-1">NoSQL database for flexible user, song, and playlist storage.</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer / Player Bar Placeholder */}
      <footer className="h-20 bg-black border-t border-[#282828] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#282828] rounded flex items-center justify-center text-xs text-gray-500">
            Art
          </div>
          <div>
            <p className="text-sm font-semibold">No track selected</p>
            <p className="text-xs text-gray-400">Select a song to start playing</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 w-1/3">
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-white transition">⏮</button>
            <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition font-bold">▶</button>
            <button className="hover:text-white transition">⏭</button>
          </div>
          <div className="w-full bg-[#4d4d4d] h-1 rounded-full overflow-hidden">
            <div className="bg-white h-full w-0"></div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>🔊</span>
          <div className="w-20 bg-[#4d4d4d] h-1 rounded-full">
            <div className="bg-white h-full w-2/3 rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
