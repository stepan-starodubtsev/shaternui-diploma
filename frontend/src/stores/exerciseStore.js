import { makeAutoObservable, runInAction, flow } from 'mobx';
import {
    getExercises,
    getExerciseById,
    createExercise,
    updateExercise,
    deleteExercise
} from '../services/exerciseService.js';

class ExerciseStore {
    exercises = [];
    selectedExercise = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this, {
            loadExercises: flow,
            loadExerciseById: flow,
            addExercise: flow,
            updateExercise: flow,
            removeExercise: flow
        });
    }

    *loadExercises() {
        this.loading = true;
        this.error = null;
        try {
            const data = yield getExercises();
            runInAction(() => {
                this.exercises = data || [];
            });
        } catch (error) {
            console.error("Failed to load exercises", error);
            runInAction(() => {
                this.error = error.message || "Не вдалося завантажити вправи";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *loadExerciseById(exerciseId) {
        this.loading = true;
        this.error = null;
        this.selectedExercise = null;
        try {
            const data = yield getExerciseById(exerciseId);
            runInAction(() => {
                this.selectedExercise = data;
            });
            return data;
        } catch (error) {
            console.error(`Failed to load exercise ${exerciseId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося завантажити вправу ${exerciseId}`;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *addExercise(exerciseData) {
        this.loading = true;
        this.error = null;
        try {
            const newExercise = yield createExercise(exerciseData);
            runInAction(() => {
                this.exercises.push(newExercise);
            });
            return newExercise;
        } catch (error) {
            console.error("Failed to add exercise", error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || "Не вдалося створити вправу";
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *updateExercise(exerciseId, exerciseData) {
        this.loading = true;
        this.error = null;
        try {
            const updated = yield updateExercise(exerciseId, exerciseData);
            runInAction(() => {
                const index = this.exercises.findIndex(ex => ex.exercise_id === exerciseId);
                if (index !== -1) {
                    this.exercises[index] = updated;
                }
                if (this.selectedExercise && this.selectedExercise.exercise_id === exerciseId) {
                    this.selectedExercise = updated;
                }
            });
            return updated;
        } catch (error) {
            console.error(`Failed to update exercise ${exerciseId}`, error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || `Не вдалося оновити вправу ${exerciseId}`;
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *removeExercise(exerciseId) {
        this.loading = true;
        this.error = null;
        const originalExercises = [...this.exercises];
        try {
            runInAction(() => {
                this.exercises = this.exercises.filter(ex => ex.exercise_id !== exerciseId);
            });
            yield deleteExercise(exerciseId);
        } catch (error) {
            console.error(`Failed to delete exercise ${exerciseId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося видалити вправу ${exerciseId}`;
                this.exercises = originalExercises;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    clearSelectedExercise() {
        this.selectedExercise = null;
    }
}

const exerciseStore = new ExerciseStore();
export default exerciseStore;