import apiClient from '../utils/apiClient';

const authService = {
    // Надсилає запит на вхід в систему
    login: (credentials) => {
        return apiClient.post('/auth/login', credentials);
    },
    // Отримує дані поточного користувача за токеном
    getMe: () => {
        return apiClient.get('/auth/me');
    },
};

export default authService;