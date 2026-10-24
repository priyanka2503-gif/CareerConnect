import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Mail, MapPin, Phone, Globe, Share2, MessageSquare } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer-root">
      <div className="footer-content-wrap">
        <div className="footer-grid">
          {/* Col 1: Platform Overview */}
          <div className="footer-col brand-col">
            <Link to="/" className="brand-logo footer-logo">
              <div className="logo-icon-box">
                <Briefcase className="logo-icon" size={20} />
              </div>
              <span className="logo-text">
                Career<span className="logo-accent">Connect</span>
              </span>
            </Link>
            <p className="footer-desc">
              CareerConnect is the smart job marketplace bridging ambitious professionals with world-class tech companies, enterprise leaders, and fast-growing startups.
            </p>
            <div className="footer-social-links">
              <a href="https://careerconnect.example" target="_blank" rel="noreferrer" aria-label="Website" className="social-pill">
                <Globe size={18} />
              </a>
              <a href="https://careerconnect.example/share" target="_blank" rel="noreferrer" aria-label="Share" className="social-pill">
                <Share2 size={18} />
              </a>
              <a href="https://careerconnect.example/community" target="_blank" rel="noreferrer" aria-label="Community" className="social-pill">
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: For Job Seekers */}
          <div className="footer-col">
            <h4 className="footer-col-title">For Job Seekers</h4>
            <ul className="footer-links-list">
              <li><Link to="/jobs">Browse All Jobs</Link></li>
              <li><Link to="/jobs?jobType=REMOTE">Remote Jobs</Link></li>
              <li><Link to="/jobs?experienceLevel=ENTRY_LEVEL">Entry Level Opportunities</Link></li>
              <li><Link to="/jobs?experienceLevel=SENIOR_LEVEL">Senior & Lead Roles</Link></li>
              <li><Link to="/register">Create Seeker Profile</Link></li>
            </ul>
          </div>

          {/* Col 3: For Employers & Recruiters */}
          <div className="footer-col">
            <h4 className="footer-col-title">For Employers</h4>
            <ul className="footer-links-list">
              <li><Link to="/register?role=recruiter">Register as Recruiter</Link></li>
              <li><Link to="/recruiter/dashboard?tab=post-job">Post a Job Opening</Link></li>
              <li><Link to="/recruiter/dashboard?tab=applicants">Manage Candidates</Link></li>
              <li><Link to="/jobs">Talent Solutions</Link></li>
              <li><Link to="/login">Recruiter Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div className="footer-col">
            <h4 className="footer-col-title">Get in Touch</h4>
            <ul className="footer-contact-info">
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>San Francisco, California & Remote</span>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <span>support@careerconnect.example</span>
              </li>
              <li>
                <Phone size={16} className="contact-icon" />
                <span>+1 (800) 555-CAREER</span>
              </li>
            </ul>
            <div className="newsletter-widget">
              <span className="newsletter-label">Subscribe to job alerts</span>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your work email" 
                  className="newsletter-input" 
                />
                <button type="button" className="newsletter-btn">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} CareerConnect Inc. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
