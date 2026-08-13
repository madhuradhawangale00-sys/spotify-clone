import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { songsApi, playlistsApi, authApi } from '../services/api';
import { MOCK_SONGS, MOCK_PLAYLISTS, MOCK_ALBUMS, MOCK_ARTISTS } from '../data/mockData';
import { useAuth } from './AuthContext';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Navigation State
  const [activeView, setActiveView] = useState('home'); // 'home' | 'search' | 'library' | 'playlist' | 'artist' | 'album' | 'login' | 'register' | 'profile'
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Backend API Data State
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [likedSongIds, setLikedSongIds] = useState([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);

  // Audio Playback State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(210);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [queue, setQueue] = useState([]);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isMobilePlayerOpen, setIsMobilePlayerOpen] = useState(false);

  // HTML5 Audio API element ref
  const audioRef = useRef(new Audio());
  
  // Web Audio Synth Node refs (fallback sound generator)
  const audioCtxRef = useRef(null);
  const synthNodesRef = useRef([]);

  // Fetch Songs from MongoDB API via Axios
  const fetchSongs = useCallback(async (query = '', category = 'All') => {
    setIsLoadingSongs(true);
    try {
      const response = await songsApi.getSongs(query, category);
      const apiSongs = response.data;
      if (Array.isArray(apiSongs) && apiSongs.length > 0) {
        // Normalize MongoDB fields (_id -> id) for UI compatibility
        const normalized = apiSongs.map(s => ({
          ...s,
          id: s._id || s.id,
          coverUrl: s.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
          audioUrl: s.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        }));
        setSongs(normalized);
        if (!currentTrack) {
          setCurrentTrack(normalized[0]);
          setQueue(normalized);
        }
      } else {
        // Fallback to MOCK_SONGS if DB is empty
        setSongs(MOCK_SONGS);
        if (!currentTrack) {
          setCurrentTrack(MOCK_SONGS[0]);
          setQueue(MOCK_SONGS);
        }
      }
    } catch (err) {
      console.warn('Backend API offline or unreachable, using fallback song data:', err);
      setSongs(MOCK_SONGS);
      if (!currentTrack) {
        setCurrentTrack(MOCK_SONGS[0]);
        setQueue(MOCK_SONGS);
      }
    } finally {
      setIsLoadingSongs(false);
    }
  }, [currentTrack]);

  // Fetch Playlists from MongoDB API via Axios
  const fetchPlaylists = useCallback(async () => {
    try {
      const response = await playlistsApi.getPlaylists();
      const apiPlaylists = response.data;
      if (Array.isArray(apiPlaylists) && apiPlaylists.length > 0) {
        const normalized = apiPlaylists.map(p => ({
          ...p,
          id: p._id || p.id,
          owner: p.owner?.name || p.owner || 'Spotify',
          songIds: p.songs?.map(s => s._id || s.id || s) || [],
        }));
        setPlaylists(normalized);
      } else {
        setPlaylists(MOCK_PLAYLISTS);
      }
    } catch (err) {
      console.warn('Backend API unreachable for playlists, using fallback:', err);
      setPlaylists(MOCK_PLAYLISTS);
    }
  }, []);

  // Fetch initial songs and playlists
  useEffect(() => {
    fetchSongs(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory, fetchSongs]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  // Sync user liked songs and recently played from Auth Context
  useEffect(() => {
    if (user) {
      if (Array.isArray(user.likedSongs)) {
        const ids = user.likedSongs.map(s => typeof s === 'object' ? (s._id || s.id) : s);
        setLikedSongIds(ids);
      }
      if (Array.isArray(user.recentlyPlayed)) {
        const recent = user.recentlyPlayed.map(s => typeof s === 'object' ? {
          ...s,
          id: s._id || s.id,
        } : songs.find(x => x.id === s)).filter(Boolean);
        setRecentlyPlayed(recent);
      }
    }
  }, [user, songs]);

  // Sync Volume & Mute with Audio API
  useEffect(() => {
    const effectiveVolume = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
    if (audioCtxRef.current && audioCtxRef.current.gainNode) {
      audioCtxRef.current.gainNode.gain.value = effectiveVolume * 0.15;
    }
  }, [volume, isMuted]);

  const stopSynthPlayback = useCallback(() => {
    synthNodesRef.current.forEach((osc) => {
      try { osc.stop(); osc.disconnect(); } catch (_) {}
    });
    synthNodesRef.current = [];
  }, []);

  // Web Audio Synth Generator fallback
  const startSynthPlayback = useCallback(() => {
    try {
      stopSynthPlayback();
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
        const gainNode = audioCtxRef.current.createGain();
        gainNode.connect(audioCtxRef.current.destination);
        audioCtxRef.current.gainNode = gainNode;
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const gainNode = audioCtxRef.current.gainNode;
      gainNode.gain.value = (isMuted ? 0 : volume) * 0.15;

      const baseFreqs = [220, 261.63, 329.63, 392.00, 440];
      const trackIndex = songs.findIndex(s => s.id === (currentTrack?._id || currentTrack?.id));
      const root = baseFreqs[trackIndex % baseFreqs.length] || 220;
      const freqs = [root, root * 1.25, root * 1.5];

      synthNodesRef.current = freqs.map((freq) => {
        const osc = audioCtxRef.current.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        osc.connect(gainNode);
        osc.start();
        return osc;
      });
    } catch (_) {}
  }, [currentTrack, isMuted, volume, songs, stopSynthPlayback]);

  // Record Recently Played Song
  const recordRecentlyPlayed = useCallback((track) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => (t.id || t._id) !== (track.id || track._id));
      return [track, ...filtered].slice(0, 20);
    });

    if (isAuthenticated && (track._id || track.id)) {
      authApi.addRecentlyPlayed(track._id || track.id).catch(() => {});
    }
  }, [isAuthenticated]);

  // Main Play Track Function
  const playTrack = useCallback((track, newQueue = null) => {
    if (!track) return;
    if (newQueue) {
      setQueue(newQueue);
    }
    
    const trackId = track._id || track.id;
    const currentId = currentTrack?._id || currentTrack?.id;

    // Toggle play/pause if clicking currently active track
    if (currentId === trackId) {
      const audio = audioRef.current;
      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(true));
      } else {
        audio.pause();
        stopSynthPlayback();
        setIsPlaying(false);
      }
      return;
    }

    setCurrentTrack(track);
    setDuration(track.durationSeconds || 210);
    setCurrentTime(0);
    recordRecentlyPlayed(track);

    const audio = audioRef.current;
    audio.src = track.audioUrl;
    audio.currentTime = 0;
    
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(true);
        startSynthPlayback();
      });
  }, [currentTrack, stopSynthPlayback, startSynthPlayback, recordRecentlyPlayed]);

  // Next Track in Queue
  const handleNextTrack = useCallback(() => {
    if (!queue || queue.length === 0) return;
    const currentId = currentTrack?._id || currentTrack?.id;
    const currentIndex = queue.findIndex(t => (t._id || t.id) === currentId);
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    playTrack(queue[nextIndex]);
  }, [queue, currentTrack, isShuffle, playTrack]);

  // Previous Track in Queue
  const handlePrevTrack = useCallback(() => {
    if (!queue || queue.length === 0) return;
    const currentId = currentTrack?._id || currentTrack?.id;
    const currentIndex = queue.findIndex(t => (t._id || t.id) === currentId);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playTrack(queue[prevIndex]);
  }, [queue, currentTrack, playTrack]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNextTrack();
      }
    };

    const handleError = () => {
      startSynthPlayback();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [handleNextTrack, startSynthPlayback, isRepeat]);

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!currentTrack) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      stopSynthPlayback();
      setIsPlaying(false);
    } else {
      if (!audio.src && currentTrack) {
        audio.src = currentTrack.audioUrl;
      }
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(true);
          startSynthPlayback();
        });
    }
  };

  // Seek to specific seconds
  const seekTo = (seconds) => {
    const audio = audioRef.current;
    if (audio && !isNaN(seconds)) {
      audio.currentTime = seconds;
    }
    setCurrentTime(seconds);
  };

  // Like / Favorite Songs via Axios
  const toggleLikeSong = async (songId) => {
    setLikedSongIds(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId) 
        : [...prev, songId]
    );

    if (isAuthenticated) {
      try {
        await authApi.toggleLikeSong(songId);
      } catch (err) {
        console.error('Error toggling liked song via API:', err);
      }
    }
  };

  const navigateTo = (view, entityId = null) => {
    setActiveView(view);
    if (entityId) {
      setSelectedEntityId(entityId);
    }
  };

  // State for Create Playlist Modal
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);

  const openCreatePlaylistModal = () => setIsCreatePlaylistModalOpen(true);
  const closeCreatePlaylistModal = () => setIsCreatePlaylistModalOpen(false);

  // Create Playlist via Axios (Strictly serializable payload check)
  const createPlaylist = async (data = {}) => {
    let title = '';
    let description = '';
    let coverUrl = '';
    let isPublic = true;

    // Detect if 'data' is a React SyntheticEvent or DOM element (e.g. passed from onClick={createPlaylist})
    const isEventOrDomElement = data && (
      typeof data._reactName === 'string' ||
      data.nativeEvent ||
      data.target ||
      data.currentTarget ||
      data instanceof Element
    );

    if (!isEventOrDomElement) {
      if (typeof data === 'string') {
        title = data;
      } else if (data && typeof data === 'object') {
        title = data.title || '';
        description = data.description || '';
        coverUrl = data.coverUrl || '';
        if (data.isPublic !== undefined) isPublic = data.isPublic;
      }
    }

    const playlistTitle = (typeof title === 'string' && title.trim())
      ? title.trim()
      : `My Playlist #${playlists.length + 1}`;

    const playlistDesc = (typeof description === 'string' && description.trim())
      ? description.trim()
      : 'Custom user created playlist';

    const playlistCover = (typeof coverUrl === 'string' && coverUrl.trim())
      ? coverUrl.trim()
      : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop';

    // Strictly serializable plain JavaScript object
    const cleanPayload = {
      title: playlistTitle,
      description: playlistDesc,
      coverUrl: playlistCover,
      isPublic,
    };

    if (isAuthenticated) {
      try {
        const response = await playlistsApi.createPlaylist(cleanPayload);
        const newPl = response.data;
        await fetchPlaylists();
        navigateTo('playlist', newPl._id || newPl.id);
        return newPl;
      } catch (err) {
        console.error('Error creating playlist via API:', err);
      }
    }

    // Local fallback if unauthenticated
    const newId = `playlist-${Date.now()}`;
    const newPlaylist = {
      id: newId,
      _id: newId,
      ...cleanPayload,
      owner: user?.name || 'User',
      songIds: [],
      gradient: 'from-emerald-900 via-zinc-900 to-[#121212]'
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    navigateTo('playlist', newId);
    return newPlaylist;
  };

  // Add Song to Playlist via Axios
  const addSongToPlaylist = async (playlistId, songId) => {
    if (isAuthenticated) {
      try {
        await playlistsApi.addSongToPlaylist(playlistId, songId);
        fetchPlaylists();
      } catch (err) {
        console.error('Error adding song to playlist via API:', err);
      }
    } else {
      setPlaylists(prev => prev.map(p => {
        if ((p._id || p.id) === playlistId) {
          const songsList = p.songIds || [];
          if (!songsList.includes(songId)) {
            return { ...p, songIds: [...songsList, songId] };
          }
        }
        return p;
      }));
    }
  };

  // Remove Song from Playlist via Axios
  const removeSongFromPlaylist = async (playlistId, songId) => {
    if (isAuthenticated) {
      try {
        await playlistsApi.removeSongFromPlaylist(playlistId, songId);
        fetchPlaylists();
      } catch (err) {
        console.error('Error removing song from playlist via API:', err);
      }
    } else {
      setPlaylists(prev => prev.map(p => {
        if ((p._id || p.id) === playlistId) {
          const songsList = p.songIds || [];
          return { ...p, songIds: songsList.filter(id => id !== songId) };
        }
        return p;
      }));
    }
  };

  // Get selected entity data for detail view
  const getSelectedEntity = () => {
    if (activeView === 'playlist') {
      if (selectedEntityId === 'liked-songs') {
        const likedSongs = songs.filter(s => likedSongIds.includes(s._id || s.id));
        return {
          id: 'liked-songs',
          _id: 'liked-songs',
          title: 'Liked Songs',
          description: 'Your favorite tracks in one place',
          coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
          owner: user?.name || 'You',
          likes: `${likedSongs.length} songs`,
          songs: likedSongs,
          songIds: likedSongIds,
          gradient: 'from-indigo-900 via-slate-900 to-[#121212]'
        };
      }
      return playlists.find(p => (p._id || p.id) === selectedEntityId) || playlists[0];
    }
    if (activeView === 'album') {
      return MOCK_ALBUMS.find(a => a.id === selectedEntityId) || MOCK_ALBUMS[0];
    }
    if (activeView === 'artist') {
      return MOCK_ARTISTS.find(a => a.id === selectedEntityId) || MOCK_ARTISTS[0];
    }
    return null;
  };

  return (
    <PlayerContext.Provider value={{
      activeView,
      setActiveView,
      selectedEntityId,
      setSelectedEntityId,
      navigateTo,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      songs,
      playlists,
      recentlyPlayed,
      isLoadingSongs,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      setVolume,
      isMuted,
      setIsMuted,
      isShuffle,
      setIsShuffle,
      isRepeat,
      setIsRepeat,
      queue,
      setQueue,
      isQueueOpen,
      setIsQueueOpen,
      isMobilePlayerOpen,
      setIsMobilePlayerOpen,
      likedSongIds,
      toggleLikeSong,
      userPlaylists: playlists,
      createPlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist,
      isCreatePlaylistModalOpen,
      openCreatePlaylistModal,
      closeCreatePlaylistModal,
      playTrack,
      togglePlay,
      seekTo,
      handleNextTrack,
      handlePrevTrack,
      getSelectedEntity
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
