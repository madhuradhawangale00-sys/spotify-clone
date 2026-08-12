import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
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

  const audioRef = useRef(new Audio());
  const synthOscillatorRef = useRef(null);
  const synthAudioCtxRef = useRef(null);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

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
        audio.play().catch(stopSynthFallback);
      } else {
        handleNextTrack();
      }
    };

    const handleError = () => {
      // If external audio source fails or blocked by CORS, trigger synthetic Web Audio tune fallback
      startSynthFallback();
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
  }, [queue, currentTrack, isRepeat, isShuffle]);

  // Handle Synthetic Web Audio fallback if MP3 fails to load
  const startSynthFallback = () => {
    try {
      if (!synthAudioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) synthAudioCtxRef.current = new AudioCtx();
      }
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  };

  const stopSynthFallback = () => {
    if (synthOscillatorRef.current) {
      try { synthOscillatorRef.current.stop(); } catch (e) {}
      synthOscillatorRef.current = null;
    }
  };

  // Play track function
  const playTrack = (track, newQueue = null) => {
    if (newQueue) {
      setQueue(newQueue);
    }
    
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    setCurrentTrack(track);
    setDuration(track.durationSeconds || 200);
    setCurrentTime(0);

    const audio = audioRef.current;
    audio.src = track.audioUrl;
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.log('Audio playback fallback mode activated for:', track.title, err);
        setIsPlaying(true);
        // Start simulated timer if real audio source is restricted
        startSimulatedProgress();
      });
  };

  // Simulated progress timer if audio source is unavailable
  const simulatedIntervalRef = useRef(null);
  const startSimulatedProgress = () => {
    clearInterval(simulatedIntervalRef.current);
    simulatedIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          clearInterval(simulatedIntervalRef.current);
          handleNextTrack();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(simulatedIntervalRef.current);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src && currentTrack) {
        audio.src = currentTrack.audioUrl;
      }
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(true);
          startSimulatedProgress();
        });
    }
  };

  const seekTo = (seconds) => {
    const audio = audioRef.current;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const handleNextTrack = () => {
    if (!queue || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    playTrack(queue[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (!queue || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playTrack(queue[prevIndex]);
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
