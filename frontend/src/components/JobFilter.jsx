import React from 'react';
import { Search, MapPin, Filter, RotateCcw, Briefcase, Award } from 'lucide-react';

export const JobFilter = ({ filters, onFilterChange, onResetFilters }) => {
  const jobTypes = [
    { value: 'ALL', label: 'All Types' },
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'REMOTE', label: 'Remote' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' },
  ];

  const experienceLevels = [
    { value: 'ALL', label: 'All Experience' },
    { value: 'ENTRY_LEVEL', label: 'Entry Level (0-2 yrs)' },
    { value: 'MID_LEVEL', label: 'Mid Level (2-5 yrs)' },
    { value: 'SENIOR_LEVEL', label: 'Senior (5-8 yrs)' },
    { value: 'LEAD', label: 'Lead / Executive (8+ yrs)' },
  ];

  return (
    <div className="filter-sidebar-card">
      <div className="filter-header-row">
        <div className="filter-title-group">
          <Filter size={18} className="filter-header-icon" />
          <h3 className="filter-title">Filter Jobs</h3>
        </div>
        <button 
          type="button" 
          onClick={onResetFilters} 
          className="btn-reset-filters"
          title="Reset all filters"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Keyword Search */}
      <div className="filter-section">
        <label className="filter-label">Search Keywords</label>
        <div className="input-with-icon">
          <Search size={16} className="field-icon" />
          <input
            type="text"
            placeholder="Title, skills, or company..."
            value={filters.keyword || ''}
            onChange={(e) => onFilterChange('keyword', e.target.value)}
            className="filter-text-input"
          />
        </div>
      </div>

      {/* Location Search */}
      <div className="filter-section">
        <label className="filter-label">Location</label>
        <div className="input-with-icon">
          <MapPin size={16} className="field-icon" />
          <input
            type="text"
            placeholder="City, State, or 'Remote'"
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="filter-text-input"
          />
        </div>
      </div>

      {/* Job Type Selector */}
      <div className="filter-section">
        <label className="filter-label">
          <Briefcase size={14} className="inline-icon" />
          <span>Employment Type</span>
        </label>
        <div className="filter-pill-group">
          {jobTypes.map((type) => {
            const isSelected = (filters.jobType || 'ALL') === type.value;
            return (
              <button
                key={type.value}
                type="button"
                className={`filter-pill-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onFilterChange('jobType', type.value)}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level Selector */}
      <div className="filter-section">
        <label className="filter-label">
          <Award size={14} className="inline-icon" />
          <span>Experience Level</span>
        </label>
        <div className="filter-pill-group">
          {experienceLevels.map((exp) => {
            const isSelected = (filters.experienceLevel || 'ALL') === exp.value;
            return (
              <button
                key={exp.value}
                type="button"
                className={`filter-pill-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onFilterChange('experienceLevel', exp.value)}
              >
                {exp.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobFilter;
