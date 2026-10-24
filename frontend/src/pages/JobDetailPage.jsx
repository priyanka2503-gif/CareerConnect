import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar, 
  Briefcase, 
  Bookmark, 
  Share2, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';
import jobService from '../services/jobService';
import savedJobService from '../services/savedJobService';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../hooks/AuthContext';

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker, user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await jobService.getJobById(id);
        setJob(data);
        setIsSaved(data.savedByCurrentUser || false);
      } catch (err) {
        console.error('Failed to load job details:', err);
        setError('Job posting not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSavingBookmark(true);
      if (isSaved) {
        await savedJobService.unsaveJob(job.id);
        setIsSaved(false);
      } else {
        await savedJobService.saveJob(job.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to bookmark job:', err);
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatSalary = (min, max, currency = 'USD') => {
    if (!min && !max) return 'Competitive Salary';
    const currSymbol = currency === 'USD' ? '$' : currency;
    const formatNum = (num) => (num ? num.toLocaleString() : '');

    if (min && max) {
      return `${currSymbol}${formatNum(min)} - ${currSymbol}${formatNum(max)} / year`;
    }
    if (min) return `From ${currSymbol}${formatNum(min)} / year`;
    return `Up to ${currSymbol}${formatNum(max)} / year`;
  };

  const formatJobType = (type) => {
    if (!type) return 'Full Time';
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatExpLevel = (level) => {
    if (!level) return 'All Levels';
    return level.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (loading) {
    return (
      <div className="job-detail-loading-wrap">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading position details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-error-wrap">
        <AlertCircle size={48} className="text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
        <p className="text-slate-600 mb-6">{error || 'This job is no longer available.'}</p>
        <Link to="/jobs" className="btn-primary-action">
          <ChevronLeft size={16} />
          <span>Back to All Jobs</span>
        </Link>
      </div>
    );
  }

  const skillsList = job.skills 
    ? job.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const parseBulletPoints = (text) => {
    if (!text) return [];
    return text.split('\n').map(line => line.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
  };

  const requirementsList = parseBulletPoints(job.requirements);
  const responsibilitiesList = parseBulletPoints(job.responsibilities);

  return (
    <div className="job-detail-page-container">
      {/* Back button */}
      <div className="detail-navigation-bar">
        <Link to="/jobs" className="btn-back-link">
          <ChevronLeft size={18} />
          <span>Back to Jobs</span>
        </Link>
      </div>

      <div className="job-detail-grid">
        {/* Main Job Content Column */}
        <div className="job-detail-main-col">
          {/* Header Card */}
          <div className="job-detail-header-card">
            <div className="job-header-top-row">
              <div className="company-logo-large-wrap">
                {job.companyLogoUrl ? (
                  <img 
                    src={job.companyLogoUrl} 
                    alt={job.companyName} 
                    className="company-logo-large"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }} 
                  />
                ) : null}
                <div 
                  className="company-logo-fallback large-fallback" 
                  style={{ display: job.companyLogoUrl ? 'none' : 'flex' }}
                >
                  {(job.companyName || 'CC').substring(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="job-detail-title-block">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="job-detail-title">{job.title}</h1>
                  <span className={`status-badge-inline ${job.status === 'OPEN' ? 'open' : 'closed'}`}>
                    {job.status === 'OPEN' ? 'Accepting Applications' : 'Closed'}
                  </span>
                </div>

                <div className="job-detail-meta-list">
                  <span className="meta-item">
                    <Building2 size={16} className="inline-icon" />
                    <span>{job.companyName}</span>
                  </span>
                  <span className="meta-divider">•</span>
                  <span className="meta-item">
                    <MapPin size={16} className="inline-icon" />
                    <span>{job.location}</span>
                  </span>
                  <span className="meta-divider">•</span>
                  <span className="meta-item">
                    <Briefcase size={16} className="inline-icon" />
                    <span>{formatJobType(job.jobType)}</span>
                  </span>
                  <span className="meta-divider">•</span>
                  <span className="meta-item">
                    <Sparkles size={16} className="inline-icon" />
                    <span>{formatExpLevel(job.experienceLevel)}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Compensation & Action Bar */}
            <div className="job-compensation-action-bar">
              <div className="compensation-badge-block">
                <span className="comp-label">Offered Compensation</span>
                <span className="comp-amount">
                  {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                </span>
              </div>

              <div className="job-action-buttons-group">
                <button 
                  type="button" 
                  onClick={handleShare}
                  className="btn-action-outline"
                  title="Copy link"
                >
                  <Share2 size={16} />
                  <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
                </button>

                <button 
                  type="button" 
                  onClick={handleToggleBookmark}
                  disabled={savingBookmark}
                  className={`btn-action-outline ${isSaved ? 'btn-bookmarked' : ''}`}
                >
                  <Bookmark size={16} fill={isSaved ? '#4f46e5' : 'none'} />
                  <span>{isSaved ? 'Saved' : 'Save Job'}</span>
                </button>

                {job.status === 'OPEN' ? (
                  hasApplied ? (
                    <div className="applied-pill-state">
                      <CheckCircle2 size={16} />
                      <span>Application Sent</span>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate('/login');
                        } else {
                          setIsApplyModalOpen(true);
                        }
                      }}
                      className="btn-apply-primary"
                    >
                      <Send size={16} />
                      <span>Apply Now</span>
                    </button>
                  )
                ) : (
                  <button type="button" disabled className="btn-disabled-closed">
                    Applications Closed
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description Body Card */}
          <div className="job-body-card">
            <section className="job-description-section">
              <h2 className="section-block-title">Role Overview</h2>
              <p className="job-description-paragraph">{job.description}</p>
            </section>

            {responsibilitiesList.length > 0 && (
              <section className="job-description-section">
                <h2 className="section-block-title">Key Responsibilities</h2>
                <ul className="custom-bullet-list">
                  {responsibilitiesList.map((item, idx) => (
                    <li key={idx} className="bullet-list-item">
                      <span className="bullet-check">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {requirementsList.length > 0 && (
              <section className="job-description-section">
                <h2 className="section-block-title">Requirements & Qualifications</h2>
                <ul className="custom-bullet-list">
                  {requirementsList.map((item, idx) => (
                    <li key={idx} className="bullet-list-item">
                      <span className="bullet-check">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {skillsList.length > 0 && (
              <section className="job-description-section">
                <h2 className="section-block-title">Required Skills & Technologies</h2>
                <div className="skills-badge-wrap">
                  {skillsList.map((skill, index) => (
                    <span key={index} className="skill-pill-large">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Sidebar Info Column */}
        <aside className="job-detail-sidebar-col">
          {/* Company Card */}
          <div className="sidebar-company-card">
            <h3 className="sidebar-card-title">About the Company</h3>
            <div className="sidebar-company-header">
              <div className="company-logo-box-sidebar">
                {(job.companyName || 'CC').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="sidebar-company-name">{job.companyName}</h4>
                <p className="sidebar-company-industry">{job.companyIndustry || 'Technology'}</p>
              </div>
            </div>

            <div className="sidebar-meta-list">
              <div className="sidebar-meta-row">
                <span className="sidebar-meta-label">Location:</span>
                <span className="sidebar-meta-val">{job.companyLocation || job.location}</span>
              </div>
              {job.companyWebsite && (
                <div className="sidebar-meta-row">
                  <span className="sidebar-meta-label">Website:</span>
                  <a 
                    href={job.companyWebsite} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="sidebar-meta-val link-external"
                  >
                    <span>Visit site</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
              {job.deadline && (
                <div className="sidebar-meta-row">
                  <span className="sidebar-meta-label">Deadline:</span>
                  <span className="sidebar-meta-val">{job.deadline}</span>
                </div>
              )}
            </div>

            <div className="verified-badge-block">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span>Verified Employer & Active Recruiter</span>
            </div>
          </div>

          {/* Hiring Manager / Recruiter Card */}
          {job.postedByName && (
            <div className="sidebar-company-card">
              <h3 className="sidebar-card-title">Hiring Lead</h3>
              <div className="recruiter-contact-row">
                <div className="recruiter-avatar">
                  {job.postedByName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="recruiter-name">{job.postedByName}</h4>
                  <p className="recruiter-role">Talent Acquisition Specialist</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => setHasApplied(true)}
      />
    </div>
  );
};

export default JobDetailPage;
