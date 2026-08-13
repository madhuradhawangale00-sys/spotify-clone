import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to headers automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spotify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Auth APIs ---
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getMe: () => api.get('/auth/me'),
  toggleLikeSong: (songId) => api.post('/auth/like-song', { songId }),
  addRecentlyPlayed: (songId) => api.post('/auth/recently-played', { songId }),
};

// --- Songs APIs ---
export const songsApi = {
  getSongs: (search = '', genre = '') => {
    const params = {};
    if (search) params.search = search;
    if (genre && genre !== 'All') params.genre = genre;
    return api.get('/songs', { params });
  },
  getSongById: (id) => api.get(`/songs/${id}`),
  createSong: (songData) => api.post('/songs', songData),
  deleteSong: (id) => api.delete(`/songs/${id}`),
};

// --- Playlists APIs ---
export const playlistsApi = {
  getPlaylists: () => api.get('/playlists'),
  getPlaylistById: (id) => api.get(`/playlists/${id}`),
  createPlaylist: (playlistData) => api.post('/playlists', playlistData),
  updatePlaylist: (id, playlistData) => api.put(`/playlists/${id}`, playlistData),
  deletePlaylist: (id) => api.delete(`/playlists/${id}`),
  addSongToPlaylist: (playlistId, songId) => api.post(`/playlists/${playlistId}/songs`, { songId }),
  removeSongFromPlaylist: (playlistId, songId) => api.delete(`/playlists/${playlistId}/songs/${songId}`),
};

export default api;
