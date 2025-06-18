import apiClient from '../utils/apiClient';

const userService = {
    getAll: () => apiClient.get('/users'),
    getById: (id) => apiClient.get(`/users/${id}`),
    create: (data) => apiClient.post('/users', data),
    update: (id, data) => apiClient.put(`/users/${id}`, data),
    delete: (id) => apiClient.delete(`/users/${id}`),
};

export default userService;