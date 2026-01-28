import React, { useState, useEffect, useRef } from 'react';
import './ContextWheel.css';

const Confetti = ({ emoji }) => {
  const particles = Array.from({ length: 12 });
  return (
    <div className="confetti-container">
      {particles.map((_, i) => (
        <span key={i} className="confetti-particle" style={{
          '--angle': `${(i * 360) / 12}deg`,
          '--delay': `${Math.random() * 0.2}s`
        }}>
          {emoji}
        </span>
      ))}
    </div>
  );
};

// Fixed spin duration in seconds - this controls the animation
const SPIN_DURATION = 3;

export function ContextWheel({ contexts, selectedContext, onSelectContext, isSpinning }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(SPIN_DURATION);
  const spinTimerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (spinTimerRef.current) {
        clearTimeout(spinTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isSpinning) {
      if (contexts.length > 0) {
        // Capture contexts length and array to prevent stale closures
        const currentContexts = [...contexts];
        const contextsLength = currentContexts.length;

        // Use fixed duration for consistent sync
        setTransitionDuration(SPIN_DURATION);

        setSpinning(true);

        // Pick a random segment to land on
        const randomSegmentIndex = Math.floor(Math.random() * contextsLength);
        const segmentAngle = 360 / contextsLength;

        // Calculate the exact angle needed to center the selected segment at the pointer (0 degrees)
        // Segment center is at: segmentIndex * segmentAngle + segmentAngle / 2
        // After clockwise rotation, we want: (segmentCenter + rotation) % 360 = 0
        // So: rotation = 360 - segmentCenter (mod 360)
        const segmentCenter = randomSegmentIndex * segmentAngle + segmentAngle / 2;
        const targetRotation = (360 - segmentCenter) % 360;

        // Cumulative rotation: add to current rotation
        // First, normalize current rotation and find next multiple of 360
        const currentRotation = rotation;
        const baseRotation = Math.ceil(currentRotation / 360) * 360;

        // Add random full spins (5-10) for visual effect
        const extraSpins = 5 + Math.floor(Math.random() * 5);
        const finalAngle = baseRotation + (extraSpins * 360) + targetRotation;
        setRotation(finalAngle);

        // Clear any existing timer
        if (spinTimerRef.current) {
          clearTimeout(spinTimerRef.current);
        }

        // Use a timer that matches the CSS transition duration
        spinTimerRef.current = setTimeout(() => {
          setSpinning(false);

          // Use captured contexts to ensure we have the right context
          if (currentContexts.length > 0 && currentContexts[randomSegmentIndex]) {
            try {
              onSelectContext(currentContexts[randomSegmentIndex]);
            } catch (error) {
              console.error('Error in onSelectContext:', error);
              throw error;
            }
          }
        }, SPIN_DURATION * 1000);
      }
    }
  }, [isSpinning, contexts, onSelectContext]);

  const handleSpin = () => {
    if (!spinning && contexts.length > 0) {
      // Capture contexts length and array to prevent stale closures
      const currentContexts = [...contexts];
      const contextsLength = currentContexts.length;

      // Use fixed duration for consistent sync
      setTransitionDuration(SPIN_DURATION);
      setSpinning(true);

      // Pick a random segment to land on
      const randomSegmentIndex = Math.floor(Math.random() * contextsLength);
      const segmentAngle = 360 / contextsLength;

      const segmentCenter = randomSegmentIndex * segmentAngle + segmentAngle / 2;
      const targetRotation = (360 - segmentCenter) % 360;

      // Cumulative rotation: add to current rotation
      const currentRotation = rotation;
      const baseRotation = Math.ceil(currentRotation / 360) * 360;

      // Add random full spins (5-10) for visual effect
      const extraSpins = 5 + Math.floor(Math.random() * 5);
      const finalAngle = baseRotation + (extraSpins * 360) + targetRotation;
      setRotation(finalAngle);

      // Clear any existing timer
      if (spinTimerRef.current) {
        clearTimeout(spinTimerRef.current);
      }

      // Synchronize with CSS transition
      spinTimerRef.current = setTimeout(() => {
        setSpinning(false);

        if (currentContexts.length > 0 && currentContexts[randomSegmentIndex]) {
          try {
            onSelectContext(currentContexts[randomSegmentIndex]);
          } catch (error) {
            console.error('Error in onSelectContext:', error);
            throw error;
          }
        }
      }, SPIN_DURATION * 1000);
    }
  };

  // Guard against empty contexts array
  if (contexts.length === 0) {
    return (
      <div className="context-wheel-container">
        <div className="wheel-wrapper">
          <div className="wheel" style={{ background: '#ddd' }}>
            <p>No themes available</p>
          </div>
        </div>
      </div>
    );
  }

  const segmentAngle = 360 / contexts.length;
  const selectedIndex = selectedContext
    ? contexts.findIndex(c => c.id === selectedContext.id)
    : -1;

  // Calculate which segment is at the top after rotation
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const topSegmentIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % contexts.length;

  return (
    <div className="context-wheel-container">
      <div className="details-placeholder" style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {selectedContext && !spinning && (
          <div className="context-details-wrapper animate-reveal" key={selectedContext.id}>
            <div className="context-details">
              <div className="context-details-content">
                <Confetti emoji={selectedContext.emoji} />
                <h3>{selectedContext.name}</h3>
                {selectedContext.sports && selectedContext.sports.length > 0 && (
                  <div className="sports-tags">
                    {selectedContext.sports.map(sport => (
                      <span key={sport} className="sport-tag">{sport}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={`wheel-wrapper ${spinning ? 'spinning' : ''}`}>
        <div
          className={`wheel ${spinning ? 'spinning' : ''}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${SPIN_DURATION}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`
              : `transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
            background: spinning
              ? 'conic-gradient(#f0f0f0, #e0e0e0, #ffffff, #dcdcdc, #f0f0f0)'
              : contexts.length > 0
                ? (() => {
                  const gradientSegments = contexts.map((_, i) => {
                    const hue = (i * 360 / contexts.length) % 360;
                    const startAngle = i * segmentAngle;
                    const endAngle = (i + 1) * segmentAngle;
                    return `hsl(${hue}, 70%, 60%) ${startAngle}deg ${endAngle}deg`;
                  });
                  return `conic-gradient(${gradientSegments.join(', ')})`;
                })()
                : '#ddd'
          }}
        >
          {contexts.map((context, index) => {
            const angle = index * segmentAngle + segmentAngle / 2;
            const hue = (index * 360 / contexts.length) % 360;
            // Calculate text radius based on segment angle to ensure text stays within boundaries
            // Use a radius that's about 50% of the way from center to edge
            // Wheel radius is ~225px (450px / 2), center button is 40px radius
            // For narrow segments, use smaller radius to prevent overflow
            const wheelRadius = 225;
            const centerRadius = 40;
            const availableRadius = wheelRadius - centerRadius;
            // Use 50% of available radius to give more room for longer names
            const textRadius = centerRadius + (availableRadius * 0.5);
            const transformValue = `rotate(${angle}deg) translateY(-${textRadius}px)`;
            const textTransformValue = `rotate(${segmentAngle / 2}deg)`;
            return (
              <React.Fragment key={context.id}>
                <div
                  className={`wheel-segment ${selectedIndex === index ? 'selected' : ''}`}
                  style={{
                    transform: transformValue,
                    color: `hsl(${hue}, 70%, 30%)`,
                    opacity: spinning ? 0 : 1
                  }}
                >
                  <span
                    className="segment-label"
                    style={{
                      transform: textTransformValue
                    }}
                  >
                    {context.emoji}
                  </span>
                </div>
                {/* Tick marks for motion blur effect */}
                <div
                  className="wheel-tick"
                  style={{
                    transform: `rotate(${index * segmentAngle}deg)`,
                    opacity: spinning ? 0.3 : 0.1
                  }}
                />
              </React.Fragment>
            );
          })}
        </div>
        <div className="wheel-center">
          <button
            className="spin-button"
            onClick={handleSpin}
            disabled={spinning || contexts.length === 0}
          >
            Spin
          </button>
        </div>

      </div>
    </div>
  );
}
