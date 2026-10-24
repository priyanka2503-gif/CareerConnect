import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  SlidersHorizontal, 
  X, 
  AlertCircle,
  ArrowUpDown
} from 'lucide-react';
import jobService from '../services/jobService';
import JobCard from '../components/JobCard';
import JobFilter from '../components/JobFilter';
import ApplyModal from '../components/ApplyModal';

export const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || 'ALL',
    experienceLevel: searchParams.get('experienceLevel') || 'ALL',
    status: 'OPEN',
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // newest, salary
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL searchParams change
  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      location: searchParams.get('location') || '',
      jobType: searchParams.get('jobType') || 'ALL',
      experienceLevel: searchParams.get('experienceLevel') || 'ALL',
      status: 'OPEN',
    });
  }, [searchParams]);

  // Fetch jobs whenever filters change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await jobService.getAllJobs(filters);
        setJobs(data);
      } catch (err) {
        console.error('Failed to load jobs:', err);
        setError('Failed to fetch job postings. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);

    // Update URL query parameters
    const params = new URLSearchParams();
    if (updated.keyword) params.append('keyword', updated.keyword);
    if (updated.location) params.append('location', updated.location);
    if (updated.jobType && updated.jobType !== 'ALL') params.append('jobType', updated.jobType);
    if (updated.experienceLevel && updated.experienceLevel !== 'ALL') params.append('experienceLevel', updated.experienceLevel);
    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      keyword: '',
      location: '',
      jobType: 'ALL',
      experienceLevel: 'ALL',
      status: 'OPEN',
    };
    setFilters(defaultFilters);
    setSearchParams({}, { replace: true });
  };

  // Sort jobs
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'salary') {
      const salA = a.salaryMax || a.salaryMin || 0;
      const salB = b.salaryMax || b.salaryMin || 0;
      return salB - salA;
    }
    // Default newest first (by id or createdAt)
    return (b.id || 0) - (a.id || 0);
  });

  const hasActiveFilters = Boolean(
    filters.keyword || 
    filters.location || 
    (filters.jobType && filters.jobType !== 'ALL') || 
    (filters.experienceLevel && filters.experienceLevel !== 'ALL')
  );

  return (
    <div className="jobs-page-container">
      {/* Top Banner / Heading */}
      <div className="jobs-header-banner">
        <div className="jobs-header-content">
          <h1 className="jobs-page-title">Explore Career Opportunities</h1>
          <p className="jobs-page-subtitle">
            Find the perfect engineering, product, or design position that fits your goals and lifestyle.
          </p>
        </div>
      </div>

      <div className="jobs-layout-grid">
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-bar">
          <button 
            type="button" 
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="btn-mobile-filter-toggle"
          >
            <SlidersHorizontal size={16} />
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
          <span className="mobile-jobs-count">{sortedJobs.length} jobs found</span>
        </div>

        {/* Filter Sidebar */}
        <aside className={`jobs-sidebar ${mobileFilterOpen ? 'mobile-visible' : ''}`}>
          <JobFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Jobs List Content Area */}
        <section className="jobs-content-column">
          {/* Controls Bar: Count, Active Filter Pills, Sort */}
          <div className="jobs-results-controls-bar">
            <div className="results-count-wrap">
              <span className="results-count-number">{sortedJobs.length}</span>
              <span className="results-count-label">
                {sortedJobs.length === 1 ? 'Job Found' : 'Jobs Found'}
              </span>
            </div>

            <div className="sort-controls-wrap">
              <ArrowUpDown size={15} className="sort-icon" />
              <label htmlFor="sortSelect" className="sort-label">Sort by:</label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="newest">Newest Postings</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="active-filters-row">
              <span className="active-filters-label">Active filters:</span>
              {filters.keyword && (
                <span className="filter-chip">
                  Keyword: "{filters.keyword}"
                  <button type="button" onClick={() => handleFilterChange('keyword', '')}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="filter-chip">
                  Location: "{filters.location}"
                  <button type="button" onClick={() => handleFilterChange('location', '')}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.jobType && filters.jobType !== 'ALL' && (
                <span className="filter-chip">
                  Type: {filters.jobType.replace('_', ' ')}
                  <button type="button" onClick={() => handleFilterChange('jobType', 'ALL')}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.experienceLevel && filters.experienceLevel !== 'ALL' && (
                <span className="filter-chip">
                  Level: {filters.experienceLevel.replace('_', ' ')}
                  <button type="button" onClick={() => handleFilterChange('experienceLevel', 'ALL')}>
                    <X size={12} />
                  </button>
                </span>
              )}
              <button 
                type="button" 
                onClick={handleResetFilters} 
                className="clear-all-chips-btn"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results List */}
          {error && (
            <div className="alert-error-box my-4">
              <AlertCircle size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="jobs-loading-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">Fetching matching jobs...</p>
            </div>
          ) : sortedJobs.length === 0 ? (
            <div className="jobs-empty-state">
              <Briefcase size={54} className="empty-state-icon" />
              <h3 className="empty-state-title">No matching positions found</h3>
              <p className="empty-state-text">
                Try loosening your filters, using broader keywords, or clearing your location restrictions.
              </p>
              <button 
                type="button" 
                onClick={handleResetFilters}
                className="btn-primary-action mt-4"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="jobs-list-stack">
              {sortedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApplyClick={(j) => setSelectedJobForApply(j)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
      />
    </div>
  );
};

export default JobsPage;
