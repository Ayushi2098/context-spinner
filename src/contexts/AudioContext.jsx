import React, { createContext, useContext, useState, useEffect } from 'react';

const AudioContext = createContext(null);

const STORAGE_KEY_VOLUME = 'audio-volume';
const STORAGE_KEY_MUTED = 'audio-muted';
const DEFAULT_VOLUME = 0.7; // 70% default volume

export function AudioProvider({ children }) {
  // Load preferences from localStorage on mount
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VOLUME);
    return saved !== null ? parseFloat(saved) : DEFAULT_VOLUME;
  });

  const [muted, setMuted] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MUTED);
    return saved !== null ? saved === 'true' : false;
  });

  // Save volume to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VOLUME, volume.toString());
  }, [volume]);

  // Save muted state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MUTED, muted.toString());
  }, [muted]);

  const updateVolume = (newVolume) => {
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  const value = {
    volume,
    muted,
    setVolume: updateVolume,
    toggleMute
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}
