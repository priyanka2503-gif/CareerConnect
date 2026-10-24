import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="not-found-page-wrap">
      <div className="not-found-card">
        <HelpCircle size={64} className="text-indigo-500 mb-4" />
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-600 mb-6 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn-primary-action">
          <ChevronLeft size={16} />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
