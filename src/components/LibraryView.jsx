import React from 'react';
import { Play } from 'lucide-react';
import { mockPlaylists } from '../data/mockPlaylists';

const LibraryView = ({ appState }) => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Your Library</h2>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors">
            Recently Added
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors">
            A-Z
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {mockPlaylists.map(playlist => (
            <div key={playlist.id} className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-700/30 cursor-pointer transition-all group">
              <div className="relative mb-4">
                <img src={playlist.image} alt={playlist.name} className="w-full aspect-square rounded-lg object-cover" />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-green-500 bg-green-500 bg-opacity-90 rounded-full p-3 hover-scale shadow-lg" />
                </div>
              </div>
              <h3 className="font-semibold mb-2 truncate">{playlist.name}</h3>
              <p className="text-gray-400 text-sm">Playlist • {playlist.songs} songs</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Made by you</h3>
        <div className="space-y-3">
          {mockPlaylists.slice(0, 3).map(playlist => (
            <div key={playlist.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer group">
              <img src={playlist.image} alt={playlist.name} className="w-16 h-16 rounded object-cover" />
              <div className="flex-1">
                <h4 className="font-medium">{playlist.name}</h4>
                <p className="text-gray-400 text-sm">{playlist.songs} songs</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-10 h-10 text-green-500 bg-green-500 bg-opacity-20 rounded-full p-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryView;
