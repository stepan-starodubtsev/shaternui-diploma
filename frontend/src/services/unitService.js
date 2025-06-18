import apiClient from "../utils/apiClient.js";

const API_URL = '/api/units';

export async function getUnits() {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching units:', error);
        throw error;
    }
}

export async function getUnitById(unitId) {
    try {
        const response = await apiClient.get(`${API_URL}/${unitId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching unit with id ${unitId}:`, error);
        throw error;
    }
}

export async function createUnit(unitData) {
    try {
        const response = await apiClient.post(API_URL, unitData);
        return response.data;
    } catch (error) {
        console.error('Error creating unit:', error);
        throw error;
    }
}

export async function updateUnit(unitId, unitData) {
    try {
        const response = await apiClient.put(`${API_URL}/${unitId}`, unitData);
        return response.data;
    } catch (error) {
        console.error(`Error updating unit with id ${unitId}:`, error);
        throw error;
    }
}

export async function deleteUnit(unitId) {
    try {
        const response = await apiClient.delete(`${API_URL}/${unitId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting unit with id ${unitId}:`, error);
        throw error;
    }
}