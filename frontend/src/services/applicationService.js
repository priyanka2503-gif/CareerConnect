import api from './api';

export const applicationService = {
  applyForJob: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/my');
    return response.data;
  },

  getJobApplications: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  getRecruiterApplications: async () => {
    const response = await api.get('/applications/recruiter');
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status, notes) => {
    const response = await api.put(`/applications/${applicationId}/status`, { status, notes });
    return response.data;
  }
};

export default applicationService;
