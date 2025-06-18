import apiClient from "../utils/apiClient.js";

const API_URL = '/api/locations';

export async function getLocations() {
    try {
        console.log("AccessToken: ", localStorage.getItem("accessToken"));
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

export async function getLocationById(locationId) {
    try {
        const response = await apiClient.get(`${API_URL}/${locationId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching location with id ${locationId}:`, error);
        throw error;
    }
}

export async function createLocation(locationData) {
    try {
        const response = await apiClient.post(API_URL, locationData);
        return response.data;
    } catch (error) {
        console.error('Error creating location:', error);
        throw error;
    }
}

export async function updateLocation(locationId, locationData) {
    try {
        const response = await apiClient.put(`${API_URL}/${locationId}`, locationData);
        return response.data;
    } catch (error) {
        console.error(`Error updating location with id ${locationId}:`, error);
        throw error;
    }
}

export async function deleteLocation(locationId) {
    try {
        const response = await apiClient.delete(`${API_URL}/${locationId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting location with id ${locationId}:`, error);
        throw error;
    }
}