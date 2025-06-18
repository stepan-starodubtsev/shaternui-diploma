import apiClient from '../utils/apiClient';

const lessonService = {
    getAll: () => apiClient.get('/lessons'),
    getById: (id) => apiClient.get(`/lessons/${id}`),
    create: (data) => apiClient.post('/lessons', data),
    update: (id, data) => apiClient.put(`/lessons/${id}`, data),
    delete: (id) => apiClient.delete(`/lessons/${id}`),
};

export default lessonService;