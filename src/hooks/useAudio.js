import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for playing audio sounds with volume and mute control
 * @param {string} audioUrl - URL of the audio file to play
 * @param {number} volume - Volume level (0-1)
 * @param {boolean} muted - Whether audio is muted
 * @returns {Object} Object with playSound function, stopSound function, getDuration function, and isReady state
 */
export function useAudio(audioUrl, volume = 1, muted = false) {
  const audioRef = useRef(null);
  const durationRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Preload audio to get duration
  useEffect(() => {
    if (!audioUrl) return;

    setIsReady(false);
    const audio = new Audio(audioUrl);

    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        durationRef.current = audio.duration;
        setIsReady(true);
      }
    };

    const handleCanPlayThrough = () => {
      setIsReady(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.load(); // Trigger loading

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [audioUrl]);

  const getDuration = useCallback(() => {
    return durationRef.current || 0;
  }, []);

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }, []);

  const playSound = useCallback((targetDuration = null) => {
    if (muted || !audioUrl) {
      return Promise.resolve({ duration: 0 });
    }

    return new Promise((resolve) => {
      // Create new audio instance for each play to allow overlapping sounds
      const audio = new Audio(audioUrl);
      audio.volume = Math.max(0, Math.min(1, volume));

      // Handle errors gracefully
      audio.onerror = () => {
        console.warn('Failed to load audio:', audioUrl);
        resolve({ duration: durationRef.current || 0 });
      };

      // Get duration when metadata is loaded (fallback if not preloaded)
      audio.onloadedmetadata = () => {
        if (audio.duration && isFinite(audio.duration)) {
          durationRef.current = audio.duration;
        }
      };

      // Resolve promise when audio ends with duration
      audio.onended = () => {
        audioRef.current = null;
        resolve({ duration: durationRef.current || 0 });
      };

      // Store reference for potential cleanup/stop
      audioRef.current = audio;

      // If duration is already known, use it
      if (audio.duration && isFinite(audio.duration)) {
        durationRef.current = audio.duration;
      }

      // Play the sound
      audio.play().catch((error) => {
        console.warn('Failed to play audio:', error);
        resolve({ duration: durationRef.current || 0 });
      });

      // If a target duration is provided and it's shorter than the audio, 
      // stop the audio at that time
      if (targetDuration && targetDuration > 0) {
        const actualDuration = durationRef.current || targetDuration;
        const stopTime = Math.min(targetDuration, actualDuration);
        setTimeout(() => {
          if (audioRef.current === audio) {
            audio.pause();
            audio.currentTime = 0;
            audioRef.current = null;
            resolve({ duration: stopTime });
          }
        }, stopTime * 1000);
      }
    });
  }, [audioUrl, volume, muted]);

  return { playSound, stopSound, getDuration, isReady };
}
