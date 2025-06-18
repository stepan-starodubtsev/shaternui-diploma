import { makeAutoObservable, runInAction, flow } from 'mobx';
import {
    getTrainingSessions,
    getTrainingSessionById,
    createTrainingSession,
    updateTrainingSession,
    deleteTrainingSession
} from '../services/trainingSessionService.js';
import locationStore from "./locationStore.js";
import userStore from "./userStore.js";
import unitStore from "./unitStore.js";
import exerciseStore from "./exerciseStore.js";


class TrainingSessionStore {
    sessions = [];
    selectedSession = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this, {
            loadSessions: flow,
            loadSessionById: flow,
            addSession: flow,
            updateSession: flow,
            removeSession: flow
        });
    }

    *loadSessions(filters = {}) {
        this.loading = true;
        this.error = null;
        try {
            if (locationStore.locations.length === 0 && !locationStore.loading) {
                yield locationStore.loadLocations();
            }
            if (userStore.users.length === 0 && !userStore.loading) {
                yield userStore.loadUsers();
            }
            if (unitStore.units.length === 0 && !unitStore.loading) {
                yield unitStore.loadUnits();
            }

            const data = yield getTrainingSessions(filters);
            runInAction(() => {
                this.sessions = data || [];
            });
        } catch (error) {
            console.error("Failed to load training sessions", error);
            runInAction(() => {
                this.error = error.message || "Не вдалося завантажити тренувальні заняття";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *loadSessionById(sessionId) {
        this.loading = true;
        this.error = null;
        this.selectedSession = null;
        try {
            if (exerciseStore.exercises.length === 0 && !exerciseStore.loading) {
                yield exerciseStore.loadExercises();
            }
            if (locationStore.locations.length === 0 && !locationStore.loading) {
                yield locationStore.loadLocations();
            }
            if (userStore.users.length === 0 && !userStore.loading) {
                yield userStore.loadUsers();
            }
            if (unitStore.units.length === 0 && !unitStore.loading) {
                yield unitStore.loadUnits();
            }

            const data = yield getTrainingSessionById(sessionId);
            runInAction(() => {
                this.selectedSession = data;
            });
            return data;
        } catch (error) {
            console.error(`Failed to load training session ${sessionId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося завантажити заняття ${sessionId}`;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *addSession(sessionData) {
        this.loading = true;
        this.error = null;
        try {
            const newSession = yield createTrainingSession(sessionData);
            runInAction(() => {
                this.sessions.push(newSession);
            });
            return newSession;
        } catch (error) {
            console.error("Failed to add training session", error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || "Не вдалося створити заняття";
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *updateSession(sessionId, sessionData) {
        this.loading = true;
        this.error = null;
        try {
            const updated = yield updateTrainingSession(sessionId, sessionData);
            runInAction(() => {
                const index = this.sessions.findIndex(s => s.session_id === sessionId);
                if (index !== -1) {
                    this.sessions[index] = updated;
                }
                if (this.selectedSession && this.selectedSession.session_id === sessionId) {
                    this.selectedSession = updated;
                }
            });
            return updated;
        } catch (error) {
            console.error(`Failed to update training session ${sessionId}`, error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || `Не вдалося оновити заняття ${sessionId}`;
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *removeSession(sessionId) {
        this.loading = true;
        this.error = null;
        const originalSessions = [...this.sessions];
        try {
            runInAction(() => {
                this.sessions = this.sessions.filter(s => s.session_id !== sessionId);
            });
            yield deleteTrainingSession(sessionId);
        } catch (error) {
            console.error(`Failed to delete training session ${sessionId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося видалити заняття ${sessionId}`;
                this.sessions = originalSessions;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    clearSelectedSession() {
        this.selectedSession = null;
    }
}

const trainingSessionStore = new TrainingSessionStore();
export default trainingSessionStore;