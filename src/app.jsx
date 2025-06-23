import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import PlayerControls from './components/PlayerControls';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockSongs } from './data/mockSongs';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [likedSongs, setLikedSongs] = useLocalStorage('likedSongs', new Set());
  
  const audioPlayer = useAudioPlayer(mockSongs[0]);

  const toggleLike = (songId) => {
    const newLikedSongs = new Set(likedSongs);
    if (newLikedSongs.has(songId)) {
      newLikedSongs.delete(songId);
    } else {
      newLikedSongs.add(songId);
    }
    setLikedSongs(newLikedSongs);
  };

  const appState = {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    likedSongs,
    toggleLike,
    ...audioPlayer
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar appState={appState} />
        <MainContent appState={appState} />
      </div>
      <PlayerControls appState={appState} />
    </div>
  );
}

export default App;
