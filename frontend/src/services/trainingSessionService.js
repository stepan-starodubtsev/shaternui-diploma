import apiClient from "../utils/apiClient.js";

const API_URL = '/api/training-sessions';

export async function getTrainingSessions(filters = {}) {
    try {
        const response = await apiClient.get(API_URL, { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching training sessions:', error);
        throw error;
    }
}

export async function getTrainingSessionById(sessionId) {
    try {
        const response = await apiClient.get(`${API_URL}/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching training session with id ${sessionId}:`, error);
        throw error;
    }
}

export async function createTrainingSession(sessionData) {
    try {
        const response = await apiClient.post(API_URL, sessionData);
        return response.data;
    } catch (error) {
        console.error('Error creating training session:', error);
        throw error;
    }
}

export async function updateTrainingSession(sessionId, sessionData) {
    try {
        const response = await apiClient.put(`${API_URL}/${sessionId}`, sessionData);
        return response.data;
    } catch (error) {
        console.error(`Error updating training session with id ${sessionId}:`, error);
        throw error;
    }
}

export async function deleteTrainingSession(sessionId) {
    try {
        const response = await apiClient.delete(`${API_URL}/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting training session with id ${sessionId}:`, error);
        throw error;
    }
}