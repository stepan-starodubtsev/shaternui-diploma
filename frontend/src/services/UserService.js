import apiClient from '../utils/apiClient';

const userService = {
    getAll: () => apiClient.get('/users'),
    getById: (id) => apiClient.get(`/users/${id}`),
    create: (data) => apiClient.post('/users', data),
    update: (id, data) => apiClient.put(`/users/${id}`, data),
    delete: (id) => apiClient.delete(`/users/${id}`),
    updateMyPassword: (passwordData) => apiClient.put('/users/update-my-password', passwordData),
};

export default userService;