import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  FileText, 
  Bookmark, 
  User, 
  Building2, 
  MapPin, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Trash2, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Briefcase,
  Award,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import applicationService from '../services/applicationService';
import savedJobService from '../services/savedJobService';
import StatusBadge from '../components/StatusBadge';
import ApplyModal from '../components/ApplyModal';

export const JobSeekerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateUserProfile } = useAuth();

  const currentTab = searchParams.get('tab') || 'applications';

  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    phone: user?.phone || '',
    skills: user?.skills || '',
    resumeUrl: user?.resumeUrl || '',
    bio: user?.bio || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Apply modal for saved jobs
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [apps, saved] = await Promise.all([
        applicationService.getMyApplications(),
        savedJobService.getSavedJobs(),
      ]);
      setApplications(apps);
      setSavedJobs(saved);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not retrieve applications. Please ensure the backend is connected.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await savedJobService.unsaveJob(jobId);
      setSavedJobs((prev) => prev.filter((item) => item.job?.id !== jobId));
    } catch (err) {
      console.error('Failed to unsave job:', err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      updateUserProfile(profileData);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setProfileSaving(false);
    }
  };

  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'ACCEPTED').length;
  const reviewingCount = applications.filter((a) => a.status === 'REVIEWING').length;

  return (
    <div className="dashboard-container">
      {/* Dashboard Top Header */}
      <div className="dashboard-header-banner">
        <div className="dashboard-user-hero">
          <div className="dashboard-avatar-large">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="dashboard-user-text">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="dashboard-user-name">{user?.name}</h1>
              <span className="role-pill pill-seeker">Job Seeker</span>
            </div>
            <p className="dashboard-user-headline">
              {user?.headline || 'Explore open positions and manage applications'}
            </p>
            <p className="dashboard-user-email">{user?.email}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="dashboard-metrics-grid">
          <div className="metric-box">
            <span className="metric-val">{applications.length}</span>
            <span className="metric-lbl">Total Applied</span>
          </div>
          <div className="metric-box">
            <span className="metric-val text-blue-600">{reviewingCount}</span>
            <span className="metric-lbl">In Review</span>
          </div>
          <div className="metric-box">
            <span className="metric-val text-purple-600">{shortlistedCount}</span>
            <span className="metric-lbl">Shortlisted / Offers</span>
          </div>
          <div className="metric-box">
            <span className="metric-val text-indigo-600">{savedJobs.length}</span>
            <span className="metric-lbl">Saved Jobs</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="dashboard-tabs-bar">
        <button
          type="button"
          className={`dash-tab-btn ${currentTab === 'applications' ? 'active' : ''}`}
          onClick={() => handleTabChange('applications')}
        >
          <FileText size={16} />
          <span>My Applications ({applications.length})</span>
        </button>

        <button
          type="button"
          className={`dash-tab-btn ${currentTab === 'saved' ? 'active' : ''}`}
          onClick={() => handleTabChange('saved')}
        >
          <Bookmark size={16} />
          <span>Saved Jobs ({savedJobs.length})</span>
        </button>

        <button
          type="button"
          className={`dash-tab-btn ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          <User size={16} />
          <span>Profile & Resume</span>
        </button>
      </div>

      {error && (
        <div className="alert-error-box my-4">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: My Applications */}
      {currentTab === 'applications' && (
        <div className="dashboard-tab-content">
          {loading ? (
            <div className="loading-grid-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading application pipeline...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-dashboard-card">
              <FileText size={48} className="text-slate-400 mb-2" />
              <h3 className="empty-title">You haven't applied to any jobs yet</h3>
              <p className="empty-sub">
                Browse our curated job listings and submit applications with just a few clicks.
              </p>
              <Link to="/jobs" className="btn-primary-action mt-4">
                Browse Open Roles
              </Link>
            </div>
          ) : (
            <div className="applications-table-card">
              <div className="applications-list-items">
                {applications.map((app) => (
                  <div key={app.id} className="application-row-card">
                    <div className="app-main-info">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link to={`/jobs/${app.jobId}`} className="app-job-title-link">
                          <h4 className="app-job-title">{app.jobTitle}</h4>
                        </Link>
                        <StatusBadge status={app.status} />
                      </div>

                      <div className="app-meta-row">
                        <span className="app-company">
                          <Building2 size={14} className="inline-icon" />
                          {app.companyName}
                        </span>
                        <span className="meta-divider">•</span>
                        <span className="app-location">
                          <MapPin size={14} className="inline-icon" />
                          {app.location}
                        </span>
                        <span className="meta-divider">•</span>
                        <span className="app-date">
                          <Calendar size={14} className="inline-icon" />
                          Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Recruiter Feedback / Notes */}
                      {app.notes && (
                        <div className="recruiter-notes-box">
                          <span className="notes-label">Feedback / Recruiter Note:</span>
                          <p className="notes-body">{app.notes}</p>
                        </div>
                      )}

                      {/* Submitted Cover letter snippet */}
                      {app.coverLetter && (
                        <div className="cover-letter-preview">
                          <span className="font-medium text-slate-700">Cover Letter: </span>
                          <span className="text-slate-600">{app.coverLetter}</span>
                        </div>
                      )}
                    </div>

                    <div className="app-actions-column">
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-view-resume"
                        >
                          <span>Resume Link</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                      <Link to={`/jobs/${app.jobId}`} className="btn-details-sm">
                        View Posting
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Jobs */}
      {currentTab === 'saved' && (
        <div className="dashboard-tab-content">
          {savedJobs.length === 0 ? (
            <div className="empty-dashboard-card">
              <Bookmark size={48} className="text-slate-400 mb-2" />
              <h3 className="empty-title">No saved jobs</h3>
              <p className="empty-sub">
                Click the bookmark icon on any job card to save it for later review.
              </p>
              <Link to="/jobs" className="btn-primary-action mt-4">
                Explore Jobs
              </Link>
            </div>
          ) : (
            <div className="saved-jobs-grid">
              {savedJobs.map((item) => {
                const job = item.job;
                if (!job) return null;
                return (
                  <div key={item.id} className="saved-job-card">
                    <div className="saved-card-header">
                      <div>
                        <Link to={`/jobs/${job.id}`} className="job-title-link">
                          <h4 className="saved-job-title">{job.title}</h4>
                        </Link>
                        <p className="saved-company-name">
                          {job.companyName} • {job.location}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnsaveJob(job.id)}
                        className="btn-remove-saved"
                        title="Remove from saved"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="saved-card-desc">
                      {job.description?.substring(0, 100)}...
                    </p>

                    <div className="saved-card-footer">
                      <span className="saved-salary">
                        {job.salaryMin && job.salaryMax
                          ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
                          : 'Competitive'}
                      </span>
                      <div className="flex gap-2">
                        <Link to={`/jobs/${job.id}`} className="btn-card-details">
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelectedJobForApply(job)}
                          className="btn-card-apply"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile */}
      {currentTab === 'profile' && (
        <div className="dashboard-tab-content">
          <div className="profile-edit-card">
            <h3 className="profile-section-title">Edit Your Candidate Profile</h3>
            <p className="profile-section-sub">
              Keep your contact information and top skills up to date so recruiters can discover you.
            </p>

            {profileSuccess && (
              <div className="alert-success-box my-3">
                <CheckCircle size={18} />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-grid-2">
                <div className="form-field-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label">Email Address (Read-Only)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="form-input bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label className="form-label">Professional Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Full-Stack Engineer | React & Spring Boot Specialist"
                    value={profileData.headline}
                    onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-label">Skills (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Java, Spring Boot, React, JavaScript, PostgreSQL, Docker"
                  value={profileData.skills}
                  onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">Resume / Portfolio Link</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or portfolio URL"
                  value={profileData.resumeUrl}
                  onChange={(e) => setProfileData({ ...profileData, resumeUrl: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">Professional Summary / Bio</label>
                <textarea
                  rows={4}
                  placeholder="Write a brief overview of your achievements and interests..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="btn-primary-action"
              >
                {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
        onSuccess={() => {
          loadDashboardData();
        }}
      />
    </div>
  );
};

export default JobSeekerDashboard;
