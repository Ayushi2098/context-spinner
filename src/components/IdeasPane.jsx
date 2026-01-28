import React from 'react';
import { IdeaCard } from './IdeaCard';
import './IdeasPane.css';

export function IdeasPane({ ideaSet, contexts }) {
  if (!ideaSet || !ideaSet.ideas || ideaSet.ideas.length === 0) {
    return (
      <div className="ideas-pane empty">
        <div className="empty-state">
          <h2>No Ideas Yet</h2>
          <p>Select a context, choose at least 3 subtopics, and click "Show Ideas" to generate math applications.</p>
        </div>
      </div>
    );
  }

  const context = contexts.find(c => c.id === ideaSet.contextId);

  return (
    <div className="ideas-pane">
      <div className="ideas-header">
        <div className="header-info">
          <h2>Generated Ideas</h2>
          <div className="context-subtopics-info">
            <span className="context-label">
              <strong>Context:</strong> {ideaSet.contextName}
            </span>
            <span className="subtopics-label">
              <strong>Subtopics used:</strong>{' '}
              {ideaSet.subtopicsTriple.map(s => s.name).join(', ')}
            </span>
          </div>
        </div>
        <div className="ideas-count">
          {ideaSet.ideas.length} idea{ideaSet.ideas.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="ideas-grid">
        {ideaSet.ideas.map(idea => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            context={context}
          />
        ))}
      </div>
    </div>
  );
}
