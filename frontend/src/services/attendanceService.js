import apiClient from '../utils/apiClient';

const attendanceService = {
    getAll: () => apiClient.get('/attendances'),
    getById: (id) => apiClient.get(`/attendances/${id}`),
    getByLessonId: (lessonId) => apiClient.get(`/attendances/lesson/${lessonId}`),
    create: (data) => apiClient.post('/attendances', data),
    update: (id, data) => apiClient.put(`/attendances/${id}`, data),
    delete: (id) => apiClient.delete(`/attendances/${id}`),
    bulkUpdate: (data) => apiClient.put('/attendances/bulk-update', data),
};

export default attendanceService;