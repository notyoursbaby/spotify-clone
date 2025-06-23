import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Heart, Shuffle, Repeat, User } from 'lucide-react';
import { formatTime } from '../utils/helpers';

const PlayerControls = ({ appState }) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    setShuffle,
    repeat,
    setRepeat,
    likedSongs,
    toggleLike,
    audioRef,
    togglePlay,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    nextSong,
    prevSong
  } = appState;

  return (
    <div className="bg-gray-900 text-white p-4 flex items-center justify-between border-t border-gray-800">
      {/* Current Song Info */}
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <img src={currentSong.image} alt={currentSong.title} className="w-14 h-14 rounded object-cover" />
        <div className="min-w-0">
          <h3 className="font-medium truncate">{currentSong.title}</h3>
          <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
        </div>
        <button
          onClick={() => toggleLike(currentSong.id)}
          className="ml-4 flex-shrink-0"
        >
          <Heart className={`w-5 h-5 ${likedSongs.has(currentSong.id) ? 'text-green-500 fill-current' : 'text-gray-400 hover:text-white'}`} />
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center space-y-2 flex-1 max-w-2xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={`w-8 h-8 flex items-center justify-center ${shuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button onClick={prevSong} className="text-gray-400 hover:text-white">
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          <button onClick={nextSong} className="text-gray-400 hover:text-white">
            <SkipForward className="w-6 h-6" />
          </button>
          <button
            onClick={() => setRepeat(!repeat)}
            className={`w-8 h-8 flex items-center justify-center ${repeat ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
          <div
            className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer progress-bar"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-white rounded-full relative"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 progress-thumb transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume and Additional Controls */}
      <div className="flex items-center space-x-2 flex-1 justify-end">
        <button onClick={toggleMute} className="text-gray-400 hover:text-white">
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <button className="text-gray-400 hover:text-white ml-4">
          <User className="w-5 h-5" />
        </button>
      </div>

      <audio ref={audioRef} src={currentSong.audioUrl} />
    </div>
  );
};

export default PlayerControls;
