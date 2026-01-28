import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ContextWheel } from './ContextWheel';
import { getThemesForTopic } from '../data/themes';
import { CustomDropdown } from './CustomDropdown';
import './ThemePicker.css';

export function ThemePicker({ themeTopics, selectedThemeTopic, onSelectThemeTopic, selectedTheme, onSelectTheme }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const prevThemeRef = useRef(null);
  const themesRef = useRef([]);

  const handleSpin = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 3000);
  };

  // Get themes for the selected topic - memoize to prevent unnecessary recalculations
  const themes = useMemo(() => {
    if (!selectedThemeTopic) {
      return [];
    }
    return getThemesForTopic(selectedThemeTopic.id);
  }, [selectedThemeTopic]);

  return (
    <div className="theme-picker">
      <header className="theme-picker-header">
        <h2>Select a Theme</h2>
      </header>

      <div className="theme-topic-selector">
        <label htmlFor="theme-topic-dropdown">Theme Category</label>
        <CustomDropdown
          options={themeTopics}
          value={selectedThemeTopic?.id || ''}
          placeholder="Select a theme topic..."
          onChange={(topic) => {
            onSelectThemeTopic(topic || null);
            onSelectTheme(null);
          }}
          className="theme-topic-dropdown-container"
        />
      </div>

      {selectedThemeTopic && themes.length > 0 && (
        <div className="theme-spinner-container">
          <ContextWheel
            contexts={themes}
            selectedContext={selectedTheme}
            onSelectContext={(theme) => {
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/af004e16-40e0-47c5-9949-015eda1fddb3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'ThemePicker.jsx:72', message: 'onSelectContext callback called', data: { themeId: theme?.id, themeName: theme?.name, hasTheme: !!theme, hasSelectedThemeTopic: !!selectedThemeTopic, themeKeys: theme ? Object.keys(theme) : [] }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B,C' }) }).catch(() => { });
              // #endregion
              // Ensure we don't lose the theme topic or themes when selecting
              if (theme && selectedThemeTopic) {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/af004e16-40e0-47c5-9949-015eda1fddb3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'ThemePicker.jsx:75', message: 'Calling onSelectTheme', data: { themeId: theme.id, themeName: theme.name }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
                // #endregion
                try {
                  onSelectTheme(theme);
                  // #region agent log
                  fetch('http://127.0.0.1:7242/ingest/af004e16-40e0-47c5-9949-015eda1fddb3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'ThemePicker.jsx:79', message: 'onSelectTheme completed', data: { themeId: theme.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
                  // #endregion
                } catch (error) {
                  // #region agent log
                  fetch('http://127.0.0.1:7242/ingest/af004e16-40e0-47c5-9949-015eda1fddb3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'ThemePicker.jsx:82', message: 'ERROR in onSelectTheme', data: { error: error?.message, errorStack: error?.stack, themeId: theme?.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
                  // #endregion
                  throw error;
                }
              }
            }}
            isSpinning={isSpinning}
          />
        </div>
      )}

      {selectedThemeTopic && themes.length === 0 && (
        <div className="theme-picker-empty">
          <p>No themes available for the selected topic.</p>
        </div>
      )}

      {!selectedThemeTopic && null}
    </div>
  );
}
