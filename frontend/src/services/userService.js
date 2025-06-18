import apiClient from "../utils/apiClient.js";

const API_URL = '/api/users';

export async function getUsers(filters = {}) {
    try {
        const response = await apiClient.get(API_URL, { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function getUserById(userId) {
    try {
        const response = await apiClient.get(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with id ${userId}:`, error);
        throw error;
    }
}

export async function createUser(userData) {
    try {
        const response = await apiClient.post(API_URL, userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function updateUser(userId, userData) {
    try {
        const response = await apiClient.put(`${API_URL}/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user with id ${userId}:`, error);
        throw error;
    }
}

export async function deleteUser(userId) {
    try {
        const response = await apiClient.delete(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with id ${userId}:`, error);
        throw error;
    }
}