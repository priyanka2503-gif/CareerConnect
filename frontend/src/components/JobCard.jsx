import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Bookmark, 
  Briefcase, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import savedJobService from '../services/savedJobService';

export const JobCard = ({ job, onSaveToggle, onApplyClick }) => {
  const { isAuthenticated, isJobSeeker } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(job.savedByCurrentUser || false);
  const [saving, setSaving] = useState(false);

  const formatSalary = (min, max, currency = 'USD') => {
    if (!min && !max) return 'Competitive Salary';
    const currSymbol = currency === 'USD' ? '$' : currency;
    const formatNum = (num) => (num ? num.toLocaleString() : '');

    if (min && max) {
      return `${currSymbol}${formatNum(min)} - ${currSymbol}${formatNum(max)} / yr`;
    }
    if (min) return `From ${currSymbol}${formatNum(min)} / yr`;
    return `Up to ${currSymbol}${formatNum(max)} / yr`;
  };

  const formatJobType = (type) => {
    if (!type) return 'Full-time';
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatExpLevel = (level) => {
    if (!level) return 'All Levels';
    return level.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSaving(true);
      if (isSaved) {
        await savedJobService.unsaveJob(job.id);
        setIsSaved(false);
      } else {
        await savedJobService.saveJob(job.id);
        setIsSaved(true);
      }
      if (onSaveToggle) onSaveToggle(job.id, !isSaved);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setSaving(false);
    }
  };

  const skillsList = job.skills 
    ? job.skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4)
    : [];

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="company-logo-wrapper">
          {job.companyLogoUrl ? (
            <img 
              src={job.companyLogoUrl} 
              alt={job.companyName || 'Company Logo'} 
              className="company-logo-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }} 
            />
          ) : null}
          <div 
            className="company-logo-fallback" 
            style={{ display: job.companyLogoUrl ? 'none' : 'flex' }}
          >
            {(job.companyName || 'CC').substring(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="job-header-info">
          <Link to={`/jobs/${job.id}`} className="job-title-link">
            <h3 className="job-title">{job.title}</h3>
          </Link>
          <div className="job-company-row">
            <span className="job-company-name">
              <Building2 size={15} className="inline-icon" />
              {job.companyName || 'Verified Partner'}
            </span>
            <span className="job-meta-divider">•</span>
            <span className="job-location">
              <MapPin size={15} className="inline-icon" />
              {job.location}
            </span>
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleBookmark} 
          disabled={saving}
          className={`bookmark-btn ${isSaved ? 'bookmarked' : ''}`}
          title={isSaved ? 'Remove from saved' : 'Save job'}
          aria-label={isSaved ? 'Remove from saved' : 'Save job'}
        >
          <Bookmark size={18} fill={isSaved ? '#4f46e5' : 'none'} />
        </button>
      </div>

      <p className="job-card-description">
        {job.description?.length > 150 
          ? `${job.description.substring(0, 150)}...` 
          : job.description}
      </p>

      {/* Skills Badges */}
      {skillsList.length > 0 && (
        <div className="job-skills-row">
          {skillsList.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
          {job.skills?.split(',').length > 4 && (
            <span className="skill-tag skill-more">
              +{job.skills.split(',').length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="job-card-footer">
        <div className="job-footer-meta">
          <div className="job-badges-group">
            <span className="meta-pill type-pill">
              <Briefcase size={13} className="inline-icon" />
              {formatJobType(job.jobType)}
            </span>
            <span className="meta-pill exp-pill">
              <Sparkles size={13} className="inline-icon" />
              {formatExpLevel(job.experienceLevel)}
            </span>
          </div>
          <div className="job-salary-display">
            <DollarSign size={15} className="inline-icon salary-icon" />
            <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
          </div>
        </div>

        <div className="job-card-actions">
          <Link to={`/jobs/${job.id}`} className="btn-card-details">
            <span>Details</span>
            <ChevronRight size={15} />
          </Link>
          {onApplyClick && isJobSeeker && (
            <button 
              type="button" 
              onClick={() => onApplyClick(job)}
              className="btn-card-apply"
            >
              Quick Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
