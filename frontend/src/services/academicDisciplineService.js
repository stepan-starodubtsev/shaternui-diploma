import apiClient from '../utils/apiClient';

const academicDisciplineService = {
    getAll: () => apiClient.get('/academic-disciplines'),
    getById: (id) => apiClient.get(`/academic-disciplines/${id}`),
    create: (data) => apiClient.post('/academic-disciplines', data),
    update: (id, data) => apiClient.put(`/academic-disciplines/${id}`, data),
    delete: (id) => apiClient.delete(`/academic-disciplines/${id}`),
};

export default academicDisciplineService;