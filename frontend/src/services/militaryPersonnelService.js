import apiClient from "../utils/apiClient.js";

const API_URL = '/api/military-personnel';

export async function getMilitaryPersonnel(filters = {}) {
    try {
        const response = await apiClient.get(API_URL, { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching military personnel:', error);
        throw error;
    }
}

export async function getMilitaryPersonnelById(personnelId) {
    try {
        const response = await apiClient.get(`${API_URL}/${personnelId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching military personnel with id ${personnelId}:`, error);
        throw error;
    }
}

export async function createMilitaryPersonnel(personnelData) {
    try {
        const response = await apiClient.post(API_URL, personnelData);
        return response.data;
    } catch (error) {
        console.error('Error creating military personnel:', error);
        throw error;
    }
}

export async function updateMilitaryPersonnel(personnelId, personnelData) {
    try {
        const response = await apiClient.put(`${API_URL}/${personnelId}`, personnelData);
        return response.data;
    } catch (error) {
        console.error(`Error updating military personnel with id ${personnelId}:`, error);
        throw error;
    }
}

export async function deleteMilitaryPersonnel(personnelId) {
    try {
        const response = await apiClient.delete(`${API_URL}/${personnelId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting military personnel with id ${personnelId}:`, error);
        throw error;
    }
}