import { useState, useRef, useEffect } from 'react';
import { mockSongs } from '../data/mockSongs';

export const useAudioPlayer = (initialSong) => {
  const [currentSong, setCurrentSong] = useState(initialSong);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const onEnded = () => {
        if (repeat) {
          audio.currentTime = 0;
          audio.play();
        } else {
          nextSong();
        }
      };
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', onEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', onEnded);
      };
    }
  }, [currentSong, repeat]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (audio) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audio.currentTime = percent * duration;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const nextSong = () => {
    const currentIndex = mockSongs.findIndex(song => song.id === currentSong.id);
    let nextIndex;
    
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * mockSongs.length);
    } else {
      nextIndex = (currentIndex + 1) % mockSongs.length;
    }
    
    setCurrentSong(mockSongs[nextIndex]);
  };

  const prevSong = () => {
    const currentIndex = mockSongs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + mockSongs.length) % mockSongs.length;
    setCurrentSong(mockSongs[prevIndex]);
  };

  return {
    currentSong,
    setCurrentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    setShuffle,
    repeat,
    setRepeat,
    audioRef,
    togglePlay,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    nextSong,
    prevSong
  };
};
