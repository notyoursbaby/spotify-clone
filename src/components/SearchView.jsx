import React from 'react';
import { Search, Play, Heart } from 'lucide-react';
import { mockSongs, genres } from '../data/mockSongs';
import { filterSongs } from '../utils/helpers';

const SearchView = ({ appState }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedGenre, 
    setSelectedGenre, 
    likedSongs, 
    toggleLike, 
    setCurrentSong 
  } = appState;

  const filteredSongs = filterSongs(mockSongs, searchQuery, selectedGenre);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedGenre === genre
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No songs found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer group song-row"
              onClick={() => setCurrentSong(song)}
            >
              <div className="text-gray-400 text-sm w-6">{index + 1}</div>
              <div className="relative">
                <img src={song.image} alt={song.title} className="w-12 h-12 rounded object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
              </div>
              <div className="text-gray-400 text-sm hidden md:block truncate">{song.album}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(song.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className={`w-5 h-5 ${likedSongs.has(song.id) ? 'text-green-500 fill-current' : 'text-gray-400 hover:text-white'}`} />
              </button>
              <div className="text-gray-400 text-sm w-12">{song.duration}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchView;
