import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { 
  Briefcase, 
  Search, 
  PlusCircle, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bookmark, 
  FileText, 
  ChevronDown,
  Building
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isRecruiter, isJobSeeker, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-box">
            <Briefcase className="logo-icon" size={22} />
          </div>
          <span className="logo-text">
            Career<span className="logo-accent">Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link 
            to="/jobs" 
            className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}
          >
            <Search size={16} />
            <span>Find Jobs</span>
          </Link>

          {isRecruiter && (
            <Link 
              to="/recruiter/dashboard?tab=post-job" 
              className={`nav-link ${location.search.includes('post-job') ? 'active' : ''}`}
            >
              <PlusCircle size={16} />
              <span>Post a Job</span>
            </Link>
          )}

          {isAuthenticated && (
            <Link 
              to={isRecruiter ? '/recruiter/dashboard' : '/dashboard'} 
              className={`nav-link ${isActive('/dashboard') || isActive('/recruiter/dashboard') ? 'active' : ''}`}
            >
              <FileText size={16} />
              <span>Dashboard</span>
            </Link>
          )}

          {isJobSeeker && (
            <Link 
              to="/dashboard?tab=saved" 
              className={`nav-link ${location.search.includes('saved') ? 'active' : ''}`}
            >
              <Bookmark size={16} />
              <span>Saved Jobs</span>
            </Link>
          )}
        </nav>

        {/* Desktop Auth Section */}
        <div className="desktop-auth">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <button 
                type="button" 
                className="user-btn" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="avatar-circle">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-text-info">
                  <span className="user-display-name">{user?.name?.split(' ')[0]}</span>
                  <span className={`role-pill ${isRecruiter ? 'pill-recruiter' : 'pill-seeker'}`}>
                    {isRecruiter ? 'Recruiter' : 'Job Seeker'}
                  </span>
                </div>
                <ChevronDown size={14} className={`chevron-icon ${dropdownOpen ? 'rotated' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-flyout" onMouseLeave={() => setDropdownOpen(false)}>
                  <div className="dropdown-header">
                    <p className="user-full-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>

                  {isRecruiter ? (
                    <>
                      <Link 
                        to="/recruiter/dashboard" 
                        className="dropdown-item" 
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Briefcase size={16} />
                        <span>Manage Postings</span>
                      </Link>
                      <Link 
                        to="/recruiter/dashboard?tab=applicants" 
                        className="dropdown-item" 
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={16} />
                        <span>View Candidates</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/dashboard?tab=applications" 
                        className="dropdown-item" 
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FileText size={16} />
                        <span>My Applications</span>
                      </Link>
                      <Link 
                        to="/dashboard?tab=saved" 
                        className="dropdown-item" 
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Bookmark size={16} />
                        <span>Saved Jobs</span>
                      </Link>
                      <Link 
                        to="/dashboard?tab=profile" 
                        className="dropdown-item" 
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={16} />
                        <span>Profile & Resume</span>
                      </Link>
                    </>
                  )}

                  <div className="dropdown-divider"></div>
                  <button type="button" className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-action-buttons">
              <Link to="/login" className="btn-secondary-nav">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary-nav">
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-hamburger-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-links">
            <Link 
              to="/jobs" 
              className="mobile-nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search size={18} />
              <span>Browse Jobs</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to={isRecruiter ? '/recruiter/dashboard' : '/dashboard'} 
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText size={18} />
                  <span>{isRecruiter ? 'Recruiter Dashboard' : 'Job Seeker Dashboard'}</span>
                </Link>

                {isRecruiter ? (
                  <Link 
                    to="/recruiter/dashboard?tab=post-job" 
                    className="mobile-nav-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <PlusCircle size={18} />
                    <span>Post New Job</span>
                  </Link>
                ) : (
                  <Link 
                    to="/dashboard?tab=saved" 
                    className="mobile-nav-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bookmark size={18} />
                    <span>Saved Jobs</span>
                  </Link>
                )}

                <button 
                  type="button" 
                  className="mobile-nav-item mobile-logout" 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                >
                  <LogOut size={18} />
                  <span>Sign Out ({user?.name?.split(' ')[0]})</span>
                </button>
              </>
            ) : (
              <div className="mobile-auth-stack">
                <Link 
                  to="/login" 
                  className="btn-secondary-nav mobile-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary-nav mobile-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
