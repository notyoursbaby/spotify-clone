import React from 'react';
import { Play } from 'lucide-react';
import { mockPlaylists } from '../data/mockPlaylists';

const HomeView = ({ appState }) => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">Good evening</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {mockPlaylists.slice(0, 6).map(playlist => (
            <div key={playlist.id} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 cursor-pointer transition-all group">
              <div className="flex items-center space-x-4">
                <img src={playlist.image} alt={playlist.name} className="w-16 h-16 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{playlist.name}</h3>
                  <p className="text-gray-400 text-sm">{playlist.songs} songs</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity play-button-overlay">
                  <Play className="w-12 h-12 text-green-500 bg-green-500 bg-opacity-20 rounded-full p-3 hover-scale" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Made for you</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {mockPlaylists.map(playlist => (
            <div key={playlist.id} className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-700/30 cursor-pointer transition-all group">
              <div className="relative mb-4">
                <img src={playlist.image} alt={playlist.name} className="w-full aspect-square rounded-lg object-cover" />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity play-button-overlay">
                  <Play className="w-12 h-12 text-green-500 bg-green-500 bg-opacity-90 rounded-full p-3 hover-scale shadow-lg" />
                </div>
              </div>
              <h3 className="font-semibold mb-2 truncate">{playlist.name}</h3>
              <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Recently played</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {mockPlaylists.slice(0, 5).map(playlist => (
            <div key={playlist.id} className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-700/30 cursor-pointer transition-all group">
              <div className="relative mb-4">
                <img src={playlist.image} alt={playlist.name} className="w-full aspect-square rounded-lg object-cover" />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity play-button-overlay">
                  <Play className="w-12 h-12 text-green-500 bg-green-500 bg-opacity-90 rounded-full p-3 hover-scale shadow-lg" />
                </div>
              </div>
              <h3 className="font-semibold mb-2 truncate">{playlist.name}</h3>
              <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeView;
