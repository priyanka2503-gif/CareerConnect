import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Sparkles,
  Building2,
  CheckCircle,
  Clock
} from 'lucide-react';
import jobService from '../services/jobService';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../hooks/AuthContext';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isRecruiter } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await jobService.getAllJobs({ status: 'OPEN' });
        setFeaturedJobs(jobs.slice(0, 6));
      } catch (err) {
        console.error('Error fetching featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickTag = (tag) => {
    navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-inner-wrap">
          <div className="hero-pill-badge">
            <Sparkles size={14} className="text-indigo-600 inline-icon" />
            <span>Over 1,200+ Smart Tech & Engineering Opportunities</span>
          </div>

          <h1 className="hero-main-title">
            Land Your Next Dream Role with <span className="highlight-text">Smart Matching</span>
          </h1>

          <p className="hero-subtext">
            Connect directly with verified tech startups, Fortune 500 innovators, and remote-first leaders. Fast-track your application and track interview progress in real-time.
          </p>

          {/* Search Card */}
          <form onSubmit={handleSearchSubmit} className="hero-search-box">
            <div className="hero-input-field">
              <Search className="field-icon" size={20} />
              <input
                type="text"
                placeholder="Job title, keywords, or skills (e.g. React, Java)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="hero-input"
              />
            </div>

            <div className="hero-search-divider"></div>

            <div className="hero-input-field">
              <MapPin className="field-icon" size={20} />
              <input
                type="text"
                placeholder="City, State, or 'Remote'"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="hero-input"
              />
            </div>

            <button type="submit" className="hero-search-submit-btn">
              <Search size={18} />
              <span>Search Jobs</span>
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="quick-tags-row">
            <span className="quick-tags-label">Popular Searches:</span>
            {['React', 'Spring Boot', 'Remote', 'Java', 'Full-Stack', 'DevOps', 'TypeScript'].map((tag) => (
              <button 
                key={tag} 
                type="button" 
                onClick={() => handleQuickTag(tag)}
                className="quick-tag-btn"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics / Trust Banner */}
      <section className="stats-banner-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap icon-blue">
              <Briefcase size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">2,500+</span>
              <span className="stat-title">Active Job Openings</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap icon-indigo">
              <Building2 size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">450+</span>
              <span className="stat-title">Verified Companies</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap icon-emerald">
              <Users size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">18,000+</span>
              <span className="stat-title">Hired Professionals</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap icon-purple">
              <ShieldCheck size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">100%</span>
              <span className="stat-title">Verified Recruiter Direct</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-jobs-section">
        <div className="section-header-wrap">
          <div>
            <h2 className="section-title">Featured Career Opportunities</h2>
            <p className="section-subtitle">
              Hand-picked positions from top hiring teams across the nation.
            </p>
          </div>
          <Link to="/jobs" className="btn-view-all-jobs">
            <span>Explore All Jobs</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-grid-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading latest postings...</p>
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="empty-featured-state">
            <Briefcase size={48} className="text-slate-400 mb-2" />
            <p className="text-slate-600 font-medium">No job postings currently active.</p>
          </div>
        ) : (
          <div className="jobs-cards-grid">
            {featuredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onApplyClick={(j) => setSelectedJobForApply(j)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Value Prop: How It Works */}
      <section className="how-it-works-section">
        <div className="section-center-header">
          <span className="section-kicker">STREAMLINED PROCESS</span>
          <h2 className="section-title">How CareerConnect Accelerates Your Search</h2>
          <p className="section-subtitle">
            Say goodbye to ghost job postings and unresponsive application portals.
          </p>
        </div>

        <div className="steps-cards-grid">
          <div className="step-card">
            <div className="step-number-badge">1</div>
            <div className="step-icon-wrap">
              <Users size={24} className="text-indigo-600" />
            </div>
            <h3 className="step-card-title">Craft Your Profile</h3>
            <p className="step-card-text">
              Highlight your tech stack, link your portfolio or resume, and define your target compensation and preferred location.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number-badge">2</div>
            <div className="step-icon-wrap">
              <Search size={24} className="text-indigo-600" />
            </div>
            <h3 className="step-card-title">Smart Filters & Match</h3>
            <p className="step-card-text">
              Drill down by tech stack, remote compatibility, salary range, and experience level with instant dynamic filtering.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number-badge">3</div>
            <div className="step-icon-wrap">
              <CheckCircle size={24} className="text-indigo-600" />
            </div>
            <h3 className="step-card-title">1-Click Apply & Track</h3>
            <p className="step-card-text">
              Send personalized applications in seconds and monitor status stages in your candidate dashboard in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Recruiter CTA Banner */}
      <section className="recruiter-banner-section">
        <div className="recruiter-banner-inner">
          <div className="recruiter-banner-text">
            <span className="banner-kicker">FOR TALENT TEAMS & FOUNDERS</span>
            <h2 className="banner-title">Hiring Software Engineers or Designers?</h2>
            <p className="banner-subtext">
              Connect with thousands of motivated, pre-vetted professionals ready for their next role. Post openings in minutes and manage applicants with our pipeline tools.
            </p>
          </div>
          <div className="recruiter-banner-actions">
            {isRecruiter ? (
              <Link to="/recruiter/dashboard?tab=post-job" className="btn-banner-primary">
                Post an Opening
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/register?role=recruiter" className="btn-banner-primary">
                Sign Up as Recruiter
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Quick Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
      />
    </div>
  );
};

export default HomePage;
