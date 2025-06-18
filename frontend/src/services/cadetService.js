import apiClient from '../utils/apiClient';

const cadetService = {
    getAll: () => apiClient.get('/cadets'),
    getById: (id) => apiClient.get(`/cadets/${id}`),
    create: (data) => apiClient.post('/cadets', data),
    update: (id, data) => apiClient.put(`/cadets/${id}`, data),
    delete: (id) => apiClient.delete(`/cadets/${id}`),
};

export default cadetService;