import apiClient from '../utils/apiClient';

const instructorService = {
    getAll: () => apiClient.get('/instructors'),
    getById: (id) => apiClient.get(`/instructors/${id}`),
    create: (data) => apiClient.post('/instructors', data),
    update: (id, data) => apiClient.put(`/instructors/${id}`, data),
    delete: (id) => apiClient.delete(`/instructors/${id}`),
};

export default instructorService;