import api from './api';

export const jobService = {
  getAllJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.location) params.append('location', filters.location);
    if (filters.jobType && filters.jobType !== 'ALL') params.append('jobType', filters.jobType);
    if (filters.experienceLevel && filters.experienceLevel !== 'ALL') params.append('experienceLevel', filters.experienceLevel);
    if (filters.status) params.append('status', filters.status);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/jobs${queryString}`);
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  getMyPostedJobs: async () => {
    const response = await api.get('/jobs/recruiter/my');
    return response.data;
  }
};

export default jobService;
