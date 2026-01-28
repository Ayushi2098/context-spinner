import React from 'react';
import './SubtopicSelector.css';

export function SubtopicSelector({ subtopics, selectedSubtopics, onToggleSubtopic }) {
  const groupedByStrand = subtopics.reduce((acc, subtopic) => {
    if (!acc[subtopic.strand]) {
      acc[subtopic.strand] = [];
    }
    acc[subtopic.strand].push(subtopic);
    return acc;
  }, {});

  return (
    <div className="subtopic-selector">
      <h3>Select Subtopics</h3>
      <p className="subtopic-hint">
        Select at least 3 subtopics. The generator will randomly pick 3 to combine.
      </p>
      
      {Object.entries(groupedByStrand).map(([strand, strandSubtopics]) => (
        <div key={strand} className="strand-group">
          <h4 className="strand-name">{strand}</h4>
          <div className="subtopic-chips">
            {strandSubtopics.map(subtopic => {
              const isSelected = selectedSubtopics.some(s => s.id === subtopic.id);
              return (
                <button
                  key={subtopic.id}
                  className={`subtopic-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => onToggleSubtopic(subtopic)}
                >
                  {subtopic.name}
                  {isSelected && <span className="checkmark">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      
      <div className="selection-summary">
        <strong>{selectedSubtopics.length}</strong> subtopic{selectedSubtopics.length !== 1 ? 's' : ''} selected
        {selectedSubtopics.length < 3 && (
          <span className="warning"> (need at least 3)</span>
        )}
      </div>
    </div>
  );
}
