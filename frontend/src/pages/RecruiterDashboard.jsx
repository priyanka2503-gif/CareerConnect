import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Briefcase, 
  PlusCircle, 
  Users, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Building2, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Clock, 
  Award, 
  X,
  FileText,
  Save,
  Filter
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import jobService from '../services/jobService';
import applicationService from '../services/applicationService';
import JobFormModal from '../components/JobFormModal';
import StatusBadge from '../components/StatusBadge';

export const RecruiterDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const currentTab = searchParams.get('tab') || 'jobs';

  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Job Modal state (Create / Edit)
  const [isJobModalOpen, setIsJobModalOpen] = useState(searchParams.get('tab') === 'post-job');
  const [editingJob, setEditingJob] = useState(null);

  // Candidate notes editing state
  const [selectedAppNotes, setSelectedAppNotes] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);
  const [noteSuccessId, setNoteSuccessId] = useState(null);

  // Filter candidates by job
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');

  // Cover letter modal view
  const [viewingCoverLetterApp, setViewingCoverLetterApp] = useState(null);

  useEffect(() => {
    loadRecruiterData();
  }, []);

  useEffect(() => {
    if (searchParams.get('tab') === 'post-job') {
      setIsJobModalOpen(true);
    }
  }, [searchParams]);

  const loadRecruiterData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsData, appsData] = await Promise.all([
        jobService.getMyPostedJobs(),
        applicationService.getRecruiterApplications(),
      ]);
      setMyJobs(jobsData);
      setApplications(appsData);

      // Pre-fill notes state
      const notesMap = {};
      appsData.forEach((app) => {
        notesMap[app.id] = app.notes || '';
      });
      setSelectedAppNotes(notesMap);
    } catch (err) {
      console.error('Failed to load recruiter data:', err);
      setError('Failed to fetch postings and applicants. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setIsJobModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setIsJobModalOpen(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) {
      return;
    }

    try {
      await jobService.deleteJob(jobId);
      setMyJobs((prev) => prev.filter((j) => j.id !== jobId));
      setApplications((prev) => prev.filter((a) => a.jobId !== jobId));
    } catch (err) {
      console.error('Failed to delete job:', err);
      alert('Failed to delete job: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const currentNotes = selectedAppNotes[appId] || '';
      const updated = await applicationService.updateApplicationStatus(appId, newStatus, currentNotes);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: updated.status } : a))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update application status.');
    }
  };

  const handleSaveNotes = async (appId) => {
    try {
      setSavingNoteId(appId);
      const app = applications.find((a) => a.id === appId);
      const notes = selectedAppNotes[appId] || '';
      await applicationService.updateApplicationStatus(appId, app?.status || 'PENDING', notes);
      setNoteSuccessId(appId);
      setTimeout(() => setNoteSuccessId(null), 2500);
    } catch (err) {
      console.error('Failed to save notes:', err);
      alert('Failed to save notes.');
    } finally {
      setSavingNoteId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (selectedJobFilter === 'ALL') return true;
    return String(app.jobId) === String(selectedJobFilter);
  });

  const shortlistedCount = applications.filter(
    (a) => a.status === 'SHORTLISTED' || a.status === 'ACCEPTED' || a.status === 'INTERVIEWING'
  ).length;

  return (
    <div className="dashboard-container">
      {/* Top Banner */}
      <div className="dashboard-header-banner">
        <div className="dashboard-user-hero">
          <div className="dashboard-avatar-large recruiter-avatar-badge">
            {user?.name?.charAt(0).toUpperCase() || 'R'}
          </div>
          <div className="dashboard-user-text">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="dashboard-user-name">{user?.name}</h1>
              <span className="role-pill pill-recruiter">Talent Partner</span>
            </div>
            <p className="dashboard-user-headline">
              {user?.headline || 'Recruiter & Talent Portal'}
            </p>
            <p className="dashboard-user-email">{user?.email}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="dashboard-metrics-grid">
          <div className="metric-box">
            <span className="metric-val">{myJobs.length}</span>
            <span className="metric-lbl">Active Postings</span>
          </div>
          <div className="metric-box">
            <span className="metric-val text-indigo-600">{applications.length}</span>
            <span className="metric-lbl">Total Applicants</span>
          </div>
          <div className="metric-box">
            <span className="metric-val text-purple-600">{shortlistedCount}</span>
            <span className="metric-lbl">Shortlisted / Active</span>
          </div>
          <div className="metric-box">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="btn-create-job-quick"
            >
              <PlusCircle size={16} />
              <span>Post New Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs-bar">
        <button
          type="button"
          className={`dash-tab-btn ${currentTab === 'jobs' || currentTab === 'post-job' ? 'active' : ''}`}
          onClick={() => handleTabChange('jobs')}
        >
          <Briefcase size={16} />
          <span>My Job Postings ({myJobs.length})</span>
        </button>

        <button
          type="button"
          className={`dash-tab-btn ${currentTab === 'applicants' ? 'active' : ''}`}
          onClick={() => handleTabChange('applicants')}
        >
          <Users size={16} />
          <span>Candidate Pipeline ({applications.length})</span>
        </button>
      </div>

      {error && (
        <div className="alert-error-box my-4">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Postings */}
      {(currentTab === 'jobs' || currentTab === 'post-job') && (
        <div className="dashboard-tab-content">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <h2 className="text-xl font-bold text-slate-800">Your Managed Postings</h2>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="btn-primary-action"
            >
              <PlusCircle size={16} />
              <span>Create New Posting</span>
            </button>
          </div>

          {loading ? (
            <div className="loading-grid-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading your job postings...</p>
            </div>
          ) : myJobs.length === 0 ? (
            <div className="empty-dashboard-card">
              <Briefcase size={48} className="text-slate-400 mb-2" />
              <h3 className="empty-title">You haven't posted any jobs yet</h3>
              <p className="empty-sub">
                Publish a new opening to start receiving applications from experienced candidates.
              </p>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="btn-primary-action mt-4"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="recruiter-jobs-table-card">
              <div className="recruiter-jobs-list">
                {myJobs.map((job) => {
                  const jobAppsCount = applications.filter((a) => a.jobId === job.id).length;
                  return (
                    <div key={job.id} className="recruiter-job-item">
                      <div className="recruiter-job-info">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link to={`/jobs/${job.id}`} className="app-job-title-link">
                            <h3 className="recruiter-job-title">{job.title}</h3>
                          </Link>
                          <span
                            className={`status-badge-inline ${job.status === 'OPEN' ? 'open' : 'closed'}`}
                          >
                            {job.status === 'OPEN' ? 'Active / Open' : 'Closed'}
                          </span>
                        </div>

                        <div className="job-meta-row mt-1">
                          <span className="job-meta-item">
                            <Building2 size={14} className="inline-icon" />
                            {job.companyName}
                          </span>
                          <span className="meta-divider">•</span>
                          <span className="job-meta-item">
                            <Calendar size={14} className="inline-icon" />
                            Posted: {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                          <span className="meta-divider">•</span>
                          <span className="job-meta-item text-indigo-600 font-semibold">
                            <Users size={14} className="inline-icon" />
                            {jobAppsCount} {jobAppsCount === 1 ? 'Applicant' : 'Applicants'}
                          </span>
                        </div>
                      </div>

                      <div className="recruiter-job-actions">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedJobFilter(String(job.id));
                            handleTabChange('applicants');
                          }}
                          className="btn-action-outline-sm"
                          title="View applicants for this job"
                        >
                          <Users size={14} />
                          <span>Applicants ({jobAppsCount})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(job)}
                          className="btn-action-outline-sm"
                          title="Edit job posting"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job.id)}
                          className="btn-action-danger-sm"
                          title="Delete job posting"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Candidate Pipeline */}
      {currentTab === 'applicants' && (
        <div className="dashboard-tab-content">
          <div className="candidate-filter-header-row">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Candidate Pipeline</h2>
              <p className="text-slate-600 text-sm">
                Review resumes, advance hiring stages, and leave notes for your team.
              </p>
            </div>

            {/* Filter by Job dropdown */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-500" />
              <select
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className="filter-by-job-select"
              >
                <option value="ALL">All Postings ({applications.length} candidates)</option>
                {myJobs.map((j) => (
                  <option key={j.id} value={String(j.id)}>
                    {j.title} ({applications.filter((a) => a.jobId === j.id).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading candidates...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="empty-dashboard-card">
              <Users size={48} className="text-slate-400 mb-2" />
              <h3 className="empty-title">No candidate applications found</h3>
              <p className="empty-sub">
                {selectedJobFilter !== 'ALL'
                  ? 'No applications submitted yet for this selected role.'
                  : 'Candidates will appear here as soon as they submit applications to your job postings.'}
              </p>
            </div>
          ) : (
            <div className="candidates-list-stack">
              {filteredApplications.map((app) => (
                <div key={app.id} className="candidate-card">
                  <div className="candidate-card-header">
                    <div className="candidate-identity">
                      <div className="candidate-avatar">
                        {app.applicantName?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div>
                        <h3 className="candidate-name">{app.applicantName}</h3>
                        <p className="candidate-headline">
                          {app.applicantHeadline || 'Software Candidate'}
                        </p>
                        <p className="candidate-contacts">
                          <span>{app.applicantEmail}</span>
                          {app.applicantPhone && <span> • {app.applicantPhone}</span>}
                        </p>
                      </div>
                    </div>

                    <div className="candidate-job-badge-block">
                      <span className="text-xs text-slate-500 font-medium">Applied for:</span>
                      <Link to={`/jobs/${app.jobId}`} className="candidate-applied-job">
                        {app.jobTitle}
                      </Link>
                      <span className="text-xs text-slate-400 mt-1">
                        on {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Links bar */}
                  <div className="candidate-quick-links-bar">
                    {app.resumeUrl ? (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-candidate-link"
                      >
                        <ExternalLink size={14} />
                        <span>View Resume / Portfolio</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No resume URL provided</span>
                    )}

                    {app.coverLetter && (
                      <button
                        type="button"
                        onClick={() => setViewingCoverLetterApp(app)}
                        className="btn-candidate-link"
                      >
                        <FileText size={14} />
                        <span>Read Cover Letter</span>
                      </button>
                    )}
                  </div>

                  {/* Stage Updater & Notes row */}
                  <div className="candidate-stage-controls">
                    <div className="stage-selector-wrap">
                      <label className="stage-selector-label">Hiring Stage:</label>
                      <select
                        value={app.status || 'PENDING'}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="status-dropdown-select"
                      >
                        <option value="PENDING">Pending Review</option>
                        <option value="REVIEWING">In Review</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEWING">Interviewing</option>
                        <option value="ACCEPTED">Offer Accepted</option>
                        <option value="REJECTED">Not Selected</option>
                      </select>
                    </div>

                    <div className="candidate-notes-editor">
                      <label className="stage-selector-label">Internal Recruiter Notes:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add interview notes, feedback, or next steps..."
                          value={selectedAppNotes[app.id] ?? (app.notes || '')}
                          onChange={(e) =>
                            setSelectedAppNotes({ ...selectedAppNotes, [app.id]: e.target.value })
                          }
                          className="candidate-note-input"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(app.id)}
                          disabled={savingNoteId === app.id}
                          className="btn-save-note"
                          title="Save note"
                        >
                          <Save size={14} />
                          <span>
                            {savingNoteId === app.id
                              ? 'Saving...'
                              : noteSuccessId === app.id
                              ? 'Saved!'
                              : 'Save'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cover Letter Modal View */}
      {viewingCoverLetterApp && (
        <div className="modal-backdrop" onClick={() => setViewingCoverLetterApp(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Cover Letter</h3>
                <p className="modal-subtitle">
                  From {viewingCoverLetterApp.applicantName} for {viewingCoverLetterApp.jobTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingCoverLetterApp(null)}
                className="modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <p className="whitespace-pre-line text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                {viewingCoverLetterApp.coverLetter}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Post / Edit Job Modal */}
      <JobFormModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        jobToEdit={editingJob}
        onJobSaved={() => {
          loadRecruiterData();
        }}
      />
    </div>
  );
};

export default RecruiterDashboard;
