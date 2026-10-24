import React from 'react';
import { 
  Clock, 
  Eye, 
  Award, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  HelpCircle 
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normStatus = (status || 'PENDING').toUpperCase();

  const getStatusConfig = () => {
    switch (normStatus) {
      case 'PENDING':
        return {
          label: 'Application Pending',
          className: 'badge-status-pending',
          icon: <Clock size={13} />,
        };
      case 'REVIEWING':
        return {
          label: 'In Review',
          className: 'badge-status-reviewing',
          icon: <Eye size={13} />,
        };
      case 'SHORTLISTED':
        return {
          label: 'Shortlisted',
          className: 'badge-status-shortlisted',
          icon: <Award size={13} />,
        };
      case 'INTERVIEWING':
        return {
          label: 'Interviewing',
          className: 'badge-status-interviewing',
          icon: <Calendar size={13} />,
        };
      case 'ACCEPTED':
        return {
          label: 'Offer Accepted',
          className: 'badge-status-accepted',
          icon: <CheckCircle2 size={13} />,
        };
      case 'REJECTED':
        return {
          label: 'Not Selected',
          className: 'badge-status-rejected',
          icon: <XCircle size={13} />,
        };
      default:
        return {
          label: status,
          className: 'badge-status-default',
          icon: <HelpCircle size={13} />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`status-pill ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
