import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Briefcase, Building2, MapPin, DollarSign, Calendar } from 'lucide-react';
import jobService from '../services/jobService';

export const JobFormModal = ({ isOpen, onClose, jobToEdit, onJobSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    companyWebsite: '',
    companyLogoUrl: '',
    location: '',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID_LEVEL',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    skills: '',
    deadline: '',
    status: 'OPEN',
    description: '',
    requirements: '',
    responsibilities: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || '',
        companyName: jobToEdit.companyName || '',
        companyWebsite: jobToEdit.companyWebsite || '',
        companyLogoUrl: jobToEdit.companyLogoUrl || '',
        location: jobToEdit.location || '',
        jobType: jobToEdit.jobType || 'FULL_TIME',
        experienceLevel: jobToEdit.experienceLevel || 'MID_LEVEL',
        salaryMin: jobToEdit.salaryMin !== null ? jobToEdit.salaryMin : '',
        salaryMax: jobToEdit.salaryMax !== null ? jobToEdit.salaryMax : '',
        currency: jobToEdit.currency || 'USD',
        skills: jobToEdit.skills || '',
        deadline: jobToEdit.deadline || '',
        status: jobToEdit.status || 'OPEN',
        description: jobToEdit.description || '',
        requirements: jobToEdit.requirements || '',
        responsibilities: jobToEdit.responsibilities || '',
      });
    } else {
      setFormData({
        title: '',
        companyName: '',
        companyWebsite: '',
        companyLogoUrl: '',
        location: '',
        jobType: 'FULL_TIME',
        experienceLevel: 'MID_LEVEL',
        salaryMin: '',
        salaryMax: '',
        currency: 'USD',
        skills: '',
        deadline: '',
        status: 'OPEN',
        description: '',
        requirements: '',
        responsibilities: '',
      });
    }
    setError(null);
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        deadline: formData.deadline ? formData.deadline : null,
      };

      let result;
      if (jobToEdit && jobToEdit.id) {
        result = await jobService.updateJob(jobToEdit.id, payload);
      } else {
        result = await jobService.createJob(payload);
      }

      if (onJobSaved) onJobSaved(result);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save job posting. Please check all fields.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {jobToEdit ? 'Edit Job Posting' : 'Create New Job Posting'}
            </h3>
            <p className="modal-subtitle">
              Fill out the details below to publish your opening to thousands of qualified candidates.
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

        <form onSubmit={handleSubmit} className="modal-form scrollable-modal-body">
          {error && (
            <div className="alert-error-box">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="form-grid-2">
            <div className="form-field-group">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                required
                name="title"
                placeholder="e.g. Senior Full-Stack Engineer"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                required
                name="companyName"
                placeholder="e.g. Acme Innovations"
                value={formData.companyName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-field-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                required
                name="location"
                placeholder="e.g. San Francisco, CA or Remote"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Employment Type *</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="REMOTE">Remote</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div className="form-field-group">
              <label className="form-label">Experience Level *</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ENTRY_LEVEL">Entry Level (0-2 yrs)</option>
                <option value="MID_LEVEL">Mid Level (2-5 yrs)</option>
                <option value="SENIOR_LEVEL">Senior Level (5-8 yrs)</option>
                <option value="LEAD">Lead / Staff (8+ yrs)</option>
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-field-group">
              <label className="form-label">Min Salary ($/yr)</label>
              <input
                type="number"
                name="salaryMin"
                placeholder="e.g. 110000"
                value={formData.salaryMin}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Max Salary ($/yr)</label>
              <input
                type="number"
                name="salaryMax"
                placeholder="e.g. 150000"
                value={formData.salaryMax}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Application Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="OPEN">Open (Accepting Applicants)</option>
                <option value="CLOSED">Closed (Archived)</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field-group">
              <label className="form-label">Required Skills (Comma separated)</label>
              <input
                type="text"
                name="skills"
                placeholder="e.g. React, Spring Boot, Java, PostgreSQL, Docker"
                value={formData.skills}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field-group">
              <label className="form-label">Company Website</label>
              <input
                type="url"
                name="companyWebsite"
                placeholder="https://company.example.com"
                value={formData.companyWebsite}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Company Logo Image URL</label>
              <input
                type="url"
                name="companyLogoUrl"
                placeholder="https://example.com/logo.png"
                value={formData.companyLogoUrl}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-field-group">
            <label className="form-label">Job Description *</label>
            <textarea
              required
              rows={4}
              name="description"
              placeholder="Provide a comprehensive summary of the mission, team, and day-to-day impact..."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-field-group">
              <label className="form-label">Requirements (Bulleted or Lines)</label>
              <textarea
                rows={4}
                name="requirements"
                placeholder="- 4+ years software development experience&#10;- Strong knowledge of React & TypeScript"
                value={formData.requirements}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Key Responsibilities</label>
              <textarea
                rows={4}
                name="responsibilities"
                placeholder="- Build reliable frontend UI components&#10;- Collaborate with backend engineering teams"
                value={formData.responsibilities}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>
          </div>

          <div className="modal-actions-row">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={saving}
              className="btn-modal-cancel"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="btn-modal-submit"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : jobToEdit ? 'Update Posting' : 'Publish Job'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
