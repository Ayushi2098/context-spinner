import React, { useState, useEffect, useMemo } from 'react';
import { IdeaCard } from './IdeaCard';
import { GeneratingLoader } from './GeneratingLoader';
import { CustomDropdown } from './CustomDropdown';
import { TOPIC_THEME_MAPPING } from '../data/mathMappings';
import tuteroBot from '../assets/tutero-bot.png';
import './IdeaPicker.css';

export function IdeaPicker({
  allThemes,
  selectedThemeFromPicker,
  onGenerateIdeas,
  ideas,
  isGenerating,
  topic,
  onTopicChange
}) {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isOthersSelected, setIsOthersSelected] = useState(false);
  const [customTopic, setCustomTopic] = useState('');

  // Sync theme from Theme Picker
  useEffect(() => {
    if (selectedThemeFromPicker) {
      setSelectedTheme(selectedThemeFromPicker);
      // Trigger glow effect
      setIsGlowing(true);
      const timer = setTimeout(() => setIsGlowing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedThemeFromPicker]);

  // Derive subtopics for the selected theme
  const availableSubtopics = useMemo(() => {
    if (!selectedTheme) return [];

    const themeName = selectedTheme.name;
    const mappedTopics = Object.entries(TOPIC_THEME_MAPPING)
      .filter(([topicName, themes]) => themes.includes(themeName))
      .map(([topicName]) => ({ id: topicName, name: topicName }));

    // Add "Others" as the final option
    return [...mappedTopics, { id: 'others', name: 'Others' }];
  }, [selectedTheme]);

  // Handle auto-selection and theme change reset
  useEffect(() => {
    if (availableSubtopics.length > 0) {
      const firstTopic = availableSubtopics[0];
      if (firstTopic.id === 'others') {
        setIsOthersSelected(true);
        onTopicChange('');
      } else {
        setIsOthersSelected(false);
        onTopicChange(firstTopic.name);
      }
    } else {
      setIsOthersSelected(false);
      onTopicChange('');
    }
  }, [availableSubtopics]);

  const handleSubtopicChange = (option) => {
    if (!option) return;

    if (option.id === 'others') {
      setIsOthersSelected(true);
      onTopicChange(customTopic);
    } else {
      setIsOthersSelected(false);
      onTopicChange(option.name);
    }
  };

  const handleCustomTopicChange = (val) => {
    setCustomTopic(val);
    if (isOthersSelected) {
      onTopicChange(val);
    }
  };

  const handleGenerate = () => {
    if (!selectedTheme) {
      alert('Please select a theme first.');
      return;
    }
    if (!topic.trim()) {
      alert('Please enter or select a topic.');
      return;
    }
    onGenerateIdeas(selectedTheme, topic.trim());
  };

  // Use ideas directly from props - no local state copy needed
  const displayIdeas = ideas || [];

  return (
    <div className="idea-picker">
      <header className="idea-picker-header">
        <h2>Identify a Topic</h2>
      </header>

      <div className="idea-picker-controls">
        <div className="controls-row">
          <div className="control-group">
            <label htmlFor="theme-dropdown">Theme</label>
            <CustomDropdown
              options={allThemes}
              value={selectedTheme?.id || ''}
              placeholder="Select a theme..."
              onChange={(theme) => setSelectedTheme(theme || null)}
              className={`theme-dropdown-container ${isGlowing ? 'glowing' : ''}`}
            />
          </div>

          <div className="control-group">
            <label htmlFor="topic-dropdown">Maths Topic</label>
            <CustomDropdown
              options={availableSubtopics}
              value={isOthersSelected ? (topic || 'others') : topic}
              placeholder="Select a topic..."
              onChange={handleSubtopicChange}
              isEditable={isOthersSelected}
              onTextChange={handleCustomTopicChange}
              className="topic-dropdown-container"
              disabled={!selectedTheme}
            />
          </div>
        </div>

        <button
          className="generate-ideas-button"
          onClick={handleGenerate}
          disabled={!selectedTheme || !topic.trim() || isGenerating}
        >
          <span className="button-content">
            <img src={tuteroBot} alt="Tutero Bot" className="bot-emoji" />
            {isGenerating ? 'Generating Ideas...' : 'Generate Application Ideas'}
          </span>
        </button>
      </div>

      <div className="ideas-results">
        {isGenerating && <GeneratingLoader topic={topic} />}

        {displayIdeas.length > 0 ? (
          <div className="ideas-grid">
            {displayIdeas.map(idea => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                context={selectedTheme}
              />
            ))}
          </div>
        ) : !isGenerating && null}
      </div>
    </div >
  );
}
