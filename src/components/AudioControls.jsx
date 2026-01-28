import React from 'react';
import { useAudioContext } from '../contexts/AudioContext';
import './AudioControls.css';

export function AudioControls() {
  const { volume, muted, setVolume, toggleMute } = useAudioContext();

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value) / 100; // Convert 0-100 to 0-1
    setVolume(newVolume);
  };

  return (
    <div className="audio-controls">
      <button
        className="audio-mute-button"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        title={muted ? 'Unmute audio' : 'Mute audio'}
      >
        {muted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
      <div className="audio-volume-container">
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={handleVolumeChange}
          className="audio-volume-slider"
          aria-label="Volume control"
          title={`Volume: ${Math.round(volume * 100)}%`}
        />
        <span className="audio-volume-label">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}
