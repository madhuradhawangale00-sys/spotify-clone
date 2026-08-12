import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Bell, User, X } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Topbar = () => {
  const { 
    activeView, 
    navigateTo, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory 
  } = usePlayer();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const categories = ['All', 'Music', 'Podcasts'];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#121212]/80 backdrop-blur-md transition-all duration-300">
      {/* Navigation Controls & Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigateTo('home')}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center text-gray-300 hover:text-white transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigateTo('library')}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center text-gray-300 hover:text-white transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Search Bar */}
        {activeView === 'search' && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white text-sm rounded-full pl-10 pr-10 py-2.5 outline-none border border-transparent focus:border-white/30 transition"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Category Filter Chips */}
        {activeView === 'home' && (
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-[#2a2a2a] text-white hover:bg-[#333333]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Side Controls & User Avatar */}
      <div className="flex items-center gap-4 relative">
        <button className="hidden sm:flex items-center gap-1.5 bg-white text-black hover:scale-105 font-bold text-xs px-3.5 py-1.5 rounded-full transition">
          Explore Premium
        </button>

        <button className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white transition">
          <Bell className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 rounded-full bg-[#282828] border border-white/10 hover:scale-105 flex items-center justify-center overflow-hidden transition"
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
              alt="User Avatar"
              className="w-full h-full object-cover" 
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#282828] border border-white/10 rounded-md shadow-2xl py-1 text-sm z-50">
              <button 
                onClick={() => { setIsProfileOpen(false); alert('Account settings coming soon'); }}
                className="w-full text-left px-4 py-2 hover:bg-[#333333] text-gray-200 hover:text-white"
              >
                Account
              </button>
              <button 
                onClick={() => { setIsProfileOpen(false); navigateTo('library'); }}
                className="w-full text-left px-4 py-2 hover:bg-[#333333] text-gray-200 hover:text-white"
              >
                Profile
              </button>
              <button 
                onClick={() => { setIsProfileOpen(false); alert('Settings dialog'); }}
                className="w-full text-left px-4 py-2 hover:bg-[#333333] text-gray-200 hover:text-white"
              >
                Settings
              </button>
              <hr className="border-[#383838] my-1" />
              <button 
                onClick={() => { setIsProfileOpen(false); alert('Logged out'); }}
                className="w-full text-left px-4 py-2 hover:bg-[#333333] text-gray-200 hover:text-white"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
