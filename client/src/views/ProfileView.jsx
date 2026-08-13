import React from 'react';
import { User, Mail, ShieldCheck, Heart, Music, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

const ProfileView = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { navigateTo, likedSongIds, userPlaylists } = usePlayer();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md bg-[#181818] border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Profile</h2>
          <p className="text-sm text-gray-400 mt-2 mb-6">
            Log in to view your profile details, manage account settings, and access saved songs.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigateTo('login')}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-6 rounded-full transition shadow-lg shadow-emerald-500/20"
            >
              Log In
            </button>
            <button
              onClick={() => navigateTo('register')}
              className="w-full bg-[#242424] hover:bg-[#2e2e2e] text-white font-semibold py-3 px-6 rounded-full border border-white/10 transition"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Banner */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-b from-emerald-900/60 to-[#121212] p-8 rounded-2xl border border-white/10">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
          alt={user?.name}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-2xl border-4 border-black/40"
        />
        <div className="flex-1 text-center md:text-left space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {user?.role === 'admin' ? 'Administrator Profile' : 'Verified User'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{user?.name}</h1>
          <p className="text-sm text-gray-300 flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            {user?.email}
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            navigateTo('home');
          }}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold px-5 py-2.5 rounded-full transition text-sm"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#181818] border border-white/10 p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Liked Songs</p>
            <h3 className="text-2xl font-bold text-white">{likedSongIds.length}</h3>
          </div>
        </div>

        <div className="bg-[#181818] border border-white/10 p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Custom Playlists</p>
            <h3 className="text-2xl font-bold text-white">{userPlaylists.length}</h3>
          </div>
        </div>

        <div className="bg-[#181818] border border-white/10 p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Account Status</p>
            <h3 className="text-lg font-bold text-emerald-400">Active (JWT Verified)</h3>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Your Music Shortcuts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => navigateTo('playlist', 'liked-songs')}
            className="bg-[#181818] hover:bg-[#242424] border border-white/5 p-4 rounded-xl cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Liked Songs</p>
                <p className="text-xs text-gray-400">{likedSongIds.length} tracks saved</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition transform group-hover:translate-x-1" />
          </div>

          <div
            onClick={() => navigateTo('library')}
            className="bg-[#181818] hover:bg-[#242424] border border-white/5 p-4 rounded-xl cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Your Library</p>
                <p className="text-xs text-gray-400">Browse all saved playlists & albums</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
