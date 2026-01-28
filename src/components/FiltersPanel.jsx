import React from 'react';
import { DIFFICULTY_LEVELS, ASSESSMENT_TYPES } from '../types';
import { CustomDropdown } from './CustomDropdown';
import './FiltersPanel.css';

export function FiltersPanel({ filters, onFilterChange, contexts, selectedContext }) {
  const availableSports = selectedContext?.sports || [];

  return (
    <div className="filters-panel">
      <h3>Filters (Optional)</h3>

      <div className="filter-group">
        <label htmlFor="year-level">Year Level</label>
        <CustomDropdown
          options={[
            { id: '', name: 'Any' },
            { id: 'Y3', name: 'Year 3' },
            { id: 'Y4', name: 'Year 4' },
            { id: 'Y5', name: 'Year 5' },
            { id: 'Y6', name: 'Year 6' },
            { id: 'Y7', name: 'Year 7' },
            { id: 'Y8', name: 'Year 8' },
            { id: 'Y9', name: 'Year 9' },
            { id: 'Y10', name: 'Year 10' },
          ]}
          value={filters.yearLevel || ''}
          placeholder="Any"
          onChange={(opt) => onFilterChange('yearLevel', opt.id || undefined)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="difficulty">Difficulty</label>
        <CustomDropdown
          options={[
            { id: '', name: 'Any' },
            ...Object.entries(DIFFICULTY_LEVELS).map(([key, label]) => ({ id: key, name: label }))
          ]}
          value={filters.difficulty || ''}
          placeholder="Any"
          onChange={(opt) => onFilterChange('difficulty', opt.id || undefined)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="time-limit">Time Limit (minutes)</label>
        <input
          id="time-limit"
          type="number"
          min="5"
          max="120"
          step="5"
          value={filters.timeLimit || ''}
          onChange={(e) => onFilterChange('timeLimit', e.target.value ? parseInt(e.target.value) : undefined)}
          placeholder="e.g. 30"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="assessment-type">Assessment Type</label>
        <CustomDropdown
          options={[
            { id: '', name: 'Any' },
            ...Object.entries(ASSESSMENT_TYPES).map(([key, label]) => ({ id: key, name: label }))
          ]}
          value={filters.assessmentType || ''}
          placeholder="Any"
          onChange={(opt) => onFilterChange('assessmentType', opt.id || undefined)}
        />
      </div>

      {availableSports.length > 0 && (
        <div className="filter-group">
          <label htmlFor="sport-filter">Sport Filter</label>
          <CustomDropdown
            options={[
              { id: '', name: 'All Sports' },
              ...availableSports.map(sport => ({
                id: sport,
                name: sport.charAt(0).toUpperCase() + sport.slice(1)
              }))
            ]}
            value={filters.sportFilter || ''}
            placeholder="All Sports"
            onChange={(opt) => onFilterChange('sportFilter', opt.id || undefined)}
          />
        </div>
      )}
    </div>
  );
}
