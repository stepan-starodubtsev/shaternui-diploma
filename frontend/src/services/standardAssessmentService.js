import apiClient from "../utils/apiClient.js";

const API_URL = '/api/standard-assessments';

export async function getStandardAssessments(filters = {}) {
    try {
        const response = await apiClient.get(API_URL, { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching standard assessments:', error);
        throw error;
    }
}

export async function getStandardAssessmentById(assessmentId) {
    try {
        const response = await apiClient.get(`${API_URL}/${assessmentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching standard assessment with id ${assessmentId}:`, error);
        throw error;
    }
}

export async function createStandardAssessment(assessmentData) {
    try {
        const response = await apiClient.post(API_URL, assessmentData);
        return response.data;
    } catch (error) {
        console.error('Error creating standard assessment:', error);
        throw error;
    }
}

export async function updateStandardAssessment(assessmentId, assessmentData) {
    try {
        const response = await apiClient.put(`${API_URL}/${assessmentId}`, assessmentData);
        return response.data;
    } catch (error) {
        console.error(`Error updating standard assessment with id ${assessmentId}:`, error);
        throw error;
    }
}

export async function deleteStandardAssessment(assessmentId) {
    try {
        const response = await apiClient.delete(`${API_URL}/${assessmentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting standard assessment with id ${assessmentId}:`, error);
        throw error;
    }
}