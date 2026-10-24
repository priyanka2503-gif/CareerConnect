import api from './api';

export const savedJobService = {
  getSavedJobs: async () => {
    const response = await api.get('/saved-jobs');
    return response.data;
  },

  saveJob: async (jobId) => {
    const response = await api.post(`/saved-jobs/${jobId}`);
    return response.data;
  },

  unsaveJob: async (jobId) => {
    const response = await api.delete(`/saved-jobs/${jobId}`);
    return response.data;
  },

  checkIsSaved: async (jobId) => {
    const response = await api.get(`/saved-jobs/check/${jobId}`);
    return response.data?.isSaved || false;
  }
};

export default savedJobService;
