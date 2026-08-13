import React, { useState } from 'react';
import { Lock, Mail, User, Music2, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

const RegisterView = () => {
  const { register, authError, setAuthError } = useAuth();
  const { navigateTo } = usePlayer();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setAuthError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    const result = await register(name, email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigateTo('home');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-[#181818] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Decorative Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20">
            <Music2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign up for Spotify</h2>
          <p className="text-xs text-gray-400 mt-1">Start listening to millions of songs today</p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              What should we call you?
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Profile name"
                required
                className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none border border-white/5 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              What's your email?
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none border border-white/5 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Create a password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none border border-white/5 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none border border-white/5 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 px-4 rounded-full transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Creating account...</span>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigateTo('login')}
              className="text-emerald-400 font-semibold hover:underline ml-1"
            >
              Log in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
