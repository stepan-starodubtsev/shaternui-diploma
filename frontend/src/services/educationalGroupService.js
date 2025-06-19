import apiClient from '../utils/apiClient';

const educationalGroupService = {
    getAll: () => apiClient.get('/educational-groups'),
    getById: (id) => apiClient.get(`/educational-groups/${id}`),
    create: (data) => apiClient.post('/educational-groups', data),
    update: (id, data) => apiClient.put(`/educational-groups/${id}`, data),
    delete: (id) => apiClient.delete(`/educational-groups/${id}`),
};

export default educationalGroupService;