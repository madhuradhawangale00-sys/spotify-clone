import React from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Player from './components/Player';
import MobileNav from './components/MobileNav';
import QueueDrawer from './components/QueueDrawer';
import MobilePlayerModal from './components/MobilePlayerModal';

import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import LibraryView from './views/LibraryView';
import PlaylistView from './views/PlaylistView';
import ArtistView from './views/ArtistView';
import AlbumView from './views/AlbumView';

const MainContent = () => {
  const { activeView } = usePlayer();

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchView />;
      case 'library':
        return <LibraryView />;
      case 'playlist':
        return <PlaylistView />;
      case 'artist':
        return <ArtistView />;
      case 'album':
        return <AlbumView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <main className="flex-1 bg-gradient-to-b from-[#202020] via-[#121212] to-[#121212] rounded-lg overflow-y-auto flex flex-col relative custom-scrollbar">
      <Topbar />
      <div className="flex-1 px-6 pt-2">
        {renderView()}
      </div>
    </main>
  );
};

function App() {
  return (
    <PlayerProvider>
      <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden select-none">
        {/* Main Interface Layout */}
        <div className="flex flex-1 p-2 gap-2 overflow-hidden pb-20 md:pb-20">
          {/* Sidebar Navigation (Desktop) */}
          <div className="hidden md:block w-64 h-full shrink-0">
            <Sidebar />
          </div>

          {/* Center Main Dynamic View */}
          <MainContent />
        </div>

        {/* Floating Queue Drawer */}
        <QueueDrawer />

        {/* Bottom Audio Player Bar */}
        <Player />

        {/* Mobile Navigation Bar */}
        <MobileNav />

        {/* Fullscreen Mobile Player Modal */}
        <MobilePlayerModal />
      </div>
    </PlayerProvider>
  );
}

export default App;
