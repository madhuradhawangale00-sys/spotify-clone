import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { MOCK_SONGS, MOCK_PLAYLISTS, MOCK_ALBUMS, MOCK_ARTISTS } from '../data/mockData';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  // Navigation State
  const [activeView, setActiveView] = useState('home'); // 'home' | 'search' | 'library' | 'playlist' | 'artist' | 'album'
  const [selectedEntityId, setSelectedEntityId] = useState(null); // ID for playlist, artist, or album detail view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); // 'All' | 'Music' | 'Podcasts'

  // Audio Playback State
  const [currentTrack, setCurrentTrack] = useState(MOCK_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(MOCK_SONGS[0].durationSeconds || 225);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [queue, setQueue] = useState(MOCK_SONGS);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isMobilePlayerOpen, setIsMobilePlayerOpen] = useState(false);

  // User Library State
  const [likedSongIds, setLikedSongIds] = useState(['song-1', 'song-3', 'song-7']);
  const [userPlaylists, setUserPlaylists] = useState(MOCK_PLAYLISTS);

  // HTML5 Audio API element ref
  const audioRef = useRef(new Audio());
  
  // Web Audio Synth Node refs (used for fallback or rich synthesized ambient layer)
  const audioCtxRef = useRef(null);
  const synthNodesRef = useRef([]);

  // Sync Volume & Mute with HTML5 Audio & Web Audio Synth
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

  // Web Audio Procedural Synth Sound Generator (Guarantees real sound even offline/CORS blocked)
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

      // Chord frequencies based on track index
      const baseFreqs = [220, 261.63, 329.63, 392.00, 440];
      const trackIndex = MOCK_SONGS.findIndex(s => s.id === currentTrack?.id);
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
  }, [currentTrack, isMuted, volume, stopSynthPlayback]);

  // Main Play Track Function (Triggered on song card / playlist row click)
  const playTrack = useCallback((track, newQueue = null) => {
    if (newQueue) {
      setQueue(newQueue);
    }
    
    // Toggle play/pause if clicking currently active track
    if (currentTrack?.id === track.id) {
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
  }, [currentTrack, stopSynthPlayback, startSynthPlayback]);

  // Next Track in Queue
  const handleNextTrack = useCallback(() => {
    if (!queue || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
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
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playTrack(queue[prevIndex]);
  }, [queue, currentTrack, playTrack]);

  // Attach HTML5 Audio Event Listeners
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

  // Timer interval for fallback progress tracking
  const simulatedIntervalRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(simulatedIntervalRef.current);
      stopSynthPlayback();
    }
  }, [isPlaying, stopSynthPlayback]);

  // Toggle Play / Pause
  const togglePlay = () => {
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

  // Seek Progress Bar (Seek to specific seconds)
  const seekTo = (seconds) => {
    const audio = audioRef.current;
    if (audio && !isNaN(seconds)) {
      audio.currentTime = seconds;
    }
    setCurrentTime(seconds);
  };

  const toggleLikeSong = (songId) => {
    setLikedSongIds(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId) 
        : [...prev, songId]
    );
  };

  const navigateTo = (view, entityId = null) => {
    setActiveView(view);
    if (entityId) {
      setSelectedEntityId(entityId);
    }
  };

  const createPlaylist = () => {
    const newId = `playlist-${Date.now()}`;
    const newPlaylist = {
      id: newId,
      title: `My Playlist #${userPlaylists.length + 1}`,
      description: 'Custom user created playlist',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
      owner: 'User',
      likes: '1',
      songIds: [],
      gradient: 'from-emerald-900 via-zinc-900 to-[#121212]'
    };
    setUserPlaylists([newPlaylist, ...userPlaylists]);
    navigateTo('playlist', newId);
  };

  // Helper getters
  const getSelectedEntity = () => {
    if (activeView === 'playlist') {
      if (selectedEntityId === 'liked-songs') {
        const likedSongs = MOCK_SONGS.filter(s => likedSongIds.includes(s.id));
        return {
          id: 'liked-songs',
          title: 'Liked Songs',
          description: 'Your favorite tracks in one place',
          coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
          owner: 'You',
          likes: `${likedSongs.length} songs`,
          songIds: likedSongIds,
          gradient: 'from-indigo-900 via-slate-900 to-[#121212]'
        };
      }
      return userPlaylists.find(p => p.id === selectedEntityId) || userPlaylists[0];
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
      userPlaylists,
      createPlaylist,
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
