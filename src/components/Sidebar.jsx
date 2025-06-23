import React from 'react';
import { Home, Search, Library, Plus, Music } from 'lucide-react';
import { mockPlaylists } from '../data/mockPlaylists';

const Sidebar = ({ appState }) => {
  const { activeView, setActiveView } = appState;

  return (
    <div className="w-64 bg-black text-white p-6 flex flex-col h-full">
      <div className="flex items-center mb-8">
        <Music className="w-8 h-8 text-green-500 mr-3" />
        <h1 className="text-xl font-bold">Spotify 2.0</h1>
      </div>
      
      <nav className="space-y-4 mb-8">
        <button
          onClick={() => setActiveView('home')}
          className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors sidebar-nav-item ${
            activeView === 'home' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveView('search')}
          className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors sidebar-nav-item ${
            activeView === 'search' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
        <button
          onClick={() => setActiveView('library')}
          className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors sidebar-nav-item ${
            activeView === 'library' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Library className="w-5 h-5" />
          <span>Your Library</span>
        </button>
      </nav>

      <div className="border-t border-gray-800 pt-6">
        <button className="flex items-center space-x-3 w-full p-2 text-gray-400 hover:text-white transition-colors sidebar-nav-item">
          <Plus className="w-5 h-5" />
          <span>Create Playlist</span>
        </button>
      </div>

      <div className="mt-8 space-y-3 flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recently Played</h3>
        {mockPlaylists.slice(0, 3).map(playlist => (
          <div key={playlist.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
            <img src={playlist.image} alt={playlist.name} className="w-10 h-10 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{playlist.name}</p>
              <p className="text-xs text-gray-400">{playlist.songs} songs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
