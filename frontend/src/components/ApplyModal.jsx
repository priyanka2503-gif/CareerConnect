import React, { useState } from 'react';
import { X, Send, Link as LinkIcon, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import applicationService from '../services/applicationService';

export const ApplyModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await applicationService.applyForJob({
        jobId: job.id,
        resumeUrl: resumeUrl.trim(),
        coverLetter: coverLetter.trim(),
      });
      setIsSuccess(true);
      if (onSuccess) onSuccess(job.id);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Apply for Role</h3>
            <p className="modal-subtitle">
              <span className="font-semibold text-slate-800">{job.title}</span> at {job.companyName}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="modal-success-state">
            <CheckCircle2 size={54} className="text-emerald-500 mb-3" />
            <h4 className="text-lg font-bold text-slate-900">Application Submitted!</h4>
            <p className="text-slate-600 text-sm mt-1">
              Your application has been received by {job.companyName}. You can track status in your dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            {error && (
              <div className="alert-error-box">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="form-field-group">
              <label className="form-label">
                <LinkIcon size={14} className="inline-icon" />
                <span>Resume / Portfolio URL</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/your-resume.pdf or portfolio link"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="form-input"
              />
              <span className="form-help-text">
                Provide a publicly accessible link to your resume (Google Drive, LinkedIn, Dropbox, or Portfolio).
              </span>
            </div>

            <div className="form-field-group">
              <label className="form-label">
                <FileText size={14} className="inline-icon" />
                <span>Cover Letter (Optional)</span>
              </label>
              <textarea
                rows={4}
                placeholder="Introduce yourself and explain why you're a great fit for this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="form-textarea"
              />
            </div>

            <div className="modal-actions-row">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={submitting}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className="btn-modal-submit"
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;
