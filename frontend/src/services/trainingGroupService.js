import apiClient from '../utils/apiClient';

const trainingGroupService = {
    getAll: () => apiClient.get('/training-groups'),
    getById: (id) => apiClient.get(`/training-groups/${id}`),
    create: (data) => apiClient.post('/training-groups', data),
    update: (id, data) => apiClient.put(`/training-groups/${id}`, data),
    delete: (id) => apiClient.delete(`/training-groups/${id}`),
};

export default trainingGroupService;