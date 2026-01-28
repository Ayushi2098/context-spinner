import React, { useState, useEffect } from 'react';
import { ThemePicker } from './components/ThemePicker';
import { IdeaPicker } from './components/IdeaPicker';
import { THEME_TOPICS } from './data/themeTopics';
import { getAllThemes } from './data/themes';
import { generateIdeasForThemeAndTopic } from './utils/ideaGenerator';
import './App.css';

function App() {
  const [selectedThemeTopic, setSelectedThemeTopic] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [initialTopic, setInitialTopic] = useState('');
  const [topic, setTopic] = useState('');

  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/af004e16-40e0-47c5-9949-015eda1fddb3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'App.jsx:useEffect', message: 'App render/update', data: { selectedThemeId: selectedTheme?.id, selectedThemeName: selectedTheme?.name, selectedThemeTopicId: selectedThemeTopic?.id, hasSelectedTheme: !!selectedTheme, hasSelectedThemeTopic: !!selectedThemeTopic }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C,D' }) }).catch(() => { });
  }, [selectedTheme, selectedThemeTopic]);
  // #endregion

  const allThemes = getAllThemes();

  // Wrap setSelectedTheme to log state changes
  const handleSelectTheme = React.useCallback((theme) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/af004e16-40e0-47c5-9949-015eda1fddb3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'App.jsx:handleSelectTheme', message: 'setSelectedTheme called', data: { themeId: theme?.id, themeName: theme?.name, hasTheme: !!theme, themeKeys: theme ? Object.keys(theme) : [], previousThemeId: selectedTheme?.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C,D' }) }).catch(() => { });
    // #endregion
    try {
      setSelectedTheme(theme);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/af004e16-40e0-47c5-9949-015eda1fddb3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'App.jsx:handleSelectTheme:after', message: 'setSelectedTheme completed', data: { themeId: theme?.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C,D' }) }).catch(() => { });
      // #endregion
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/af004e16-40e0-47c5-9949-015eda1fddb3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'App.jsx:handleSelectTheme:catch', message: 'ERROR in setSelectedTheme', data: { error: error?.message, errorStack: error?.stack, themeId: theme?.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
      // #endregion
      throw error;
    }
  }, [selectedTheme]);



  const handleGenerateIdeas = async (theme, topic) => {
    setIsGenerating(true);

    try {
      // Generate ideas using the LLM API
      const generatedIdeas = await generateIdeasForThemeAndTopic(theme, topic);
      setIdeas(generatedIdeas);
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      setIdeas([]);
    } finally {
      setIsGenerating(false);
    }
  };


  // #region agent log
  React.useEffect(() => {
    const errorHandler = (error) => {
      fetch('http://127.0.0.1:7242/ingest/af004e16-40e0-47c5-9949-015eda1fddb3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'App.jsx:globalErrorHandler', message: 'Global error caught', data: { error: error?.message, errorStack: error?.stack, errorName: error?.name }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
    };
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', (event) => {
      fetch('http://127.0.0.1:7242/ingest/af004e16-40e0-47c5-9949-015eda1fddb3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'App.jsx:unhandledRejection', message: 'Unhandled promise rejection', data: { reason: event?.reason?.message || event?.reason, reasonStack: event?.reason?.stack }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    });

    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('category');
    const themeId = params.get('theme');
    const urlTopic = params.get('topic');

    let initialCategory = null;
    let initialTheme = null;

    if (categoryId) {
      initialCategory = THEME_TOPICS.find(t => t.id === categoryId);
      if (initialCategory) {
        setSelectedThemeTopic(initialCategory);
      }
    }

    if (themeId) {
      initialTheme = allThemes.find(t => t.id === themeId);
      if (initialTheme) {
        setSelectedTheme(initialTheme);
      }
    }

    if (urlTopic) {
      setTopic(urlTopic);
    }

    // Auto-generate if all parameters are present
    if (initialTheme && urlTopic) {
      handleGenerateIdeas(initialTheme, urlTopic);
    }

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  // Update URL parameters when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedThemeTopic) params.set('category', selectedThemeTopic.id);
    if (selectedTheme) params.set('theme', selectedTheme.id);
    if (topic) params.set('topic', topic);

    const newRelativePathQuery = window.location.pathname + '?' + params.toString();
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [selectedThemeTopic, selectedTheme, topic]);
  // #endregion

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-header-text">
            <h1>Generate Real-World Application Ideas</h1>
            <p className="subtitle">Use this tool to generate real-world application ideas. Select a theme, then enter a topic to guide the idea generation.</p>
          </div>

        </div>
      </header>

      <div className="app-content">
        <div className="theme-picker-section">
          <ThemePicker
            themeTopics={THEME_TOPICS}
            selectedThemeTopic={selectedThemeTopic}
            onSelectThemeTopic={setSelectedThemeTopic}
            selectedTheme={selectedTheme}
            onSelectTheme={handleSelectTheme}
          />
        </div>

        <div className="idea-picker-section">
          <IdeaPicker
            allThemes={allThemes}
            selectedThemeFromPicker={selectedTheme}
            onGenerateIdeas={handleGenerateIdeas}
            ideas={ideas}
            isGenerating={isGenerating}
            topic={topic}
            onTopicChange={setTopic}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
