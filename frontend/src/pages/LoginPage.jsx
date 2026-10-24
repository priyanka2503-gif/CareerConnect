import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Mail, Lock, LogIn, AlertCircle, Sparkles, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.role === 'ROLE_RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate(redirectPath === '/' ? '/dashboard' : redirectPath);
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Invalid email or password. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
    setLoading(true);

    try {
      const data = await login(demoEmail, demoPassword);
      if (data.role === 'ROLE_RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate(redirectPath === '/' ? '/dashboard' : redirectPath);
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Could not connect to backend server. Make sure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        <div className="auth-card-header">
          <div className="auth-logo-icon-box">
            <Briefcase size={26} className="text-indigo-600" />
          </div>
          <h1 className="auth-main-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to access your jobs, applications, and recruiter portal.
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="demo-credentials-banner">
          <div className="demo-banner-title">
            <Sparkles size={14} className="text-indigo-600" />
            <span>Quick Demo Testing (1-Click Login):</span>
          </div>
          <div className="demo-buttons-grid">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('jobseeker@example.com', 'password123')}
              className="btn-demo-pill"
              disabled={loading}
            >
              <UserCheck size={14} />
              <span>Job Seeker (Alex)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('recruiter@example.com', 'password123')}
              className="btn-demo-pill recruiter-demo"
              disabled={loading}
            >
              <Shield size={14} />
              <span>Recruiter (Sarah)</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-error-box mb-4">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-stack">
          <div className="form-field-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-field-group">
            <div className="flex justify-between items-center mb-1">
              <label className="form-label mb-0">Password</label>
              <a href="#forgot" className="text-xs text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-auth-submit"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Don't have an account yet?</span>
          <Link to="/register" className="auth-link-bold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
