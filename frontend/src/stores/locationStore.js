import { makeAutoObservable, runInAction, flow } from 'mobx';
import {
    getLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
} from '../services/locationService.js';

class LocationStore {
    locations = [];
    selectedLocation = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this, {
            loadLocations: flow,
            loadLocationById: flow,
            addLocation: flow,
            updateLocation: flow,
            removeLocation: flow
        });
    }

    *loadLocations() {
        this.loading = true;
        this.error = null;
        try {
            const data = yield getLocations();
            runInAction(() => {
                this.locations = data || [];
            });
        } catch (error) {
            console.error("Failed to load locations", error);
            runInAction(() => {
                this.error = error.message || "Не вдалося завантажити локації";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *loadLocationById(locationId) {
        this.loading = true;
        this.error = null;
        this.selectedLocation = null;
        try {
            const data = yield getLocationById(locationId);
            runInAction(() => {
                this.selectedLocation = data;
            });
            return data;
        } catch (error) {
            console.error(`Failed to load location ${locationId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося завантажити локацію ${locationId}`;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *addLocation(locationData) {
        this.loading = true;
        this.error = null;
        try {
            const newLocation = yield createLocation(locationData);
            runInAction(() => {
                this.locations.push(newLocation);
            });
            return newLocation;
        } catch (error) {
            console.error("Failed to add location", error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || "Не вдалося створити локацію";
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *updateLocation(locationId, locationData) {
        this.loading = true;
        this.error = null;
        try {
            const updated = yield updateLocation(locationId, locationData);
            runInAction(() => {
                const index = this.locations.findIndex(loc => loc.location_id === locationId);
                if (index !== -1) {
                    this.locations[index] = updated;
                }
                if (this.selectedLocation && this.selectedLocation.location_id === locationId) {
                    this.selectedLocation = updated;
                }
            });
            return updated;
        } catch (error) {
            console.error(`Failed to update location ${locationId}`, error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || `Не вдалося оновити локацію ${locationId}`;
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *removeLocation(locationId) {
        this.loading = true;
        this.error = null;
        const originalLocations = [...this.locations];
        try {
            runInAction(() => {
                this.locations = this.locations.filter(loc => loc.location_id !== locationId);
            });
            yield deleteLocation(locationId);
        } catch (error) {
            console.error(`Failed to delete location ${locationId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося видалити локацію ${locationId}`;
                this.locations = originalLocations;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    clearSelectedLocation() {
        this.selectedLocation = null;
    }
}

const locationStore = new LocationStore();
export default locationStore;