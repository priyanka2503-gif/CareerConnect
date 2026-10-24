import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, Mail, Lock, User, Phone, Sparkles, Building2, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useAuth();

  const initialRole = searchParams.get('role') === 'recruiter' ? 'ROLE_RECRUITER' : 'ROLE_JOB_SEEKER';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        headline: headline.trim(),
        phone: phone.trim(),
        skills: role === 'ROLE_JOB_SEEKER' ? skills.trim() : null,
        resumeUrl: role === 'ROLE_JOB_SEEKER' ? resumeUrl.trim() : null,
        bio: bio.trim(),
      };

      const data = await register(payload);
      if (data.role === 'ROLE_RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please check inputs.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper auth-card-wide">
        <div className="auth-card-header">
          <div className="auth-logo-icon-box">
            <UserPlus size={26} className="text-indigo-600" />
          </div>
          <h1 className="auth-main-title">Join CareerConnect</h1>
          <p className="auth-subtitle">
            Choose your role and get started in less than 2 minutes.
          </p>
        </div>

        {/* Role Selection Toggle */}
        <div className="role-switch-container">
          <button
            type="button"
            className={`role-switch-btn ${role === 'ROLE_JOB_SEEKER' ? 'active' : ''}`}
            onClick={() => setRole('ROLE_JOB_SEEKER')}
          >
            <User size={16} />
            <span>I'm a Job Seeker</span>
          </button>
          <button
            type="button"
            className={`role-switch-btn ${role === 'ROLE_RECRUITER' ? 'active' : ''}`}
            onClick={() => setRole('ROLE_RECRUITER')}
          >
            <Building2 size={16} />
            <span>I'm a Recruiter / Employer</span>
          </button>
        </div>

        {error && (
          <div className="alert-error-box mb-4">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-stack">
          <div className="form-grid-2">
            <div className="form-field-group">
              <label className="form-label">Full Name *</label>
              <div className="input-with-icon">
                <User size={16} className="field-icon" />
                <input
                  type="text"
                  required
                  placeholder={role === 'ROLE_RECRUITER' ? 'Sarah Jenkins' : 'Alex Rivera'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-label">Email Address *</label>
              <div className="input-with-icon">
                <Mail size={16} className="field-icon" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field-group">
              <label className="form-label">Password * (6+ chars)</label>
              <div className="input-with-icon">
                <Lock size={16} className="field-icon" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-label">Phone Number</label>
              <div className="input-with-icon">
                <Phone size={16} className="field-icon" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-field-group">
            <label className="form-label">
              {role === 'ROLE_RECRUITER' ? 'Recruiter Title & Company' : 'Professional Headline'}
            </label>
            <input
              type="text"
              placeholder={
                role === 'ROLE_RECRUITER'
                  ? 'e.g. Lead Talent Partner at TechFlow'
                  : 'e.g. Senior React & Java Developer | 5+ Yrs Exp'
              }
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="form-input"
            />
          </div>

          {role === 'ROLE_JOB_SEEKER' && (
            <>
              <div className="form-field-group">
                <label className="form-label">Top Skills (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="React, Spring Boot, Java, PostgreSQL, TypeScript"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">Resume / Portfolio Link</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or portfolio URL"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="form-input"
                />
              </div>
            </>
          )}

          <div className="form-field-group">
            <label className="form-label">Bio / Overview</label>
            <textarea
              rows={3}
              placeholder={
                role === 'ROLE_RECRUITER'
                  ? 'Briefly describe your company culture and types of roles you recruit for...'
                  : 'Brief summary of your background, experience, and what roles you are seeking...'
              }
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="form-textarea"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-auth-submit"
          >
            {loading ? (
              <span>Creating your account...</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Register as {role === 'ROLE_RECRUITER' ? 'Recruiter' : 'Job Seeker'}</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Already registered?</span>
          <Link to="/login" className="auth-link-bold">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
