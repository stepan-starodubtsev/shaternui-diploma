import { makeAutoObservable, runInAction, flow } from 'mobx';
import {
    getStandardAssessments,
    getStandardAssessmentById,
    createStandardAssessment,
    updateStandardAssessment,
    deleteStandardAssessment
} from '../services/standardAssessmentService.js';


class StandardAssessmentStore {
    assessments = [];
    selectedAssessment = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this, {
            loadAssessments: flow,
            loadAssessmentById: flow,
            addAssessment: flow,
            updateAssessment: flow,
            removeAssessment: flow
        });
    }

    *loadAssessments(filters = {}) {
        this.loading = true;
        this.error = null;
        try {

            const data = yield getStandardAssessments(filters);
            runInAction(() => {
                this.assessments = data || [];
            });
        } catch (error) {
            console.error("Failed to load standard assessments", error);
            runInAction(() => {
                this.error = error.message || "Не вдалося завантажити оцінки";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *loadAssessmentById(assessmentId) {
        this.loading = true;
        this.error = null;
        this.selectedAssessment = null;
        try {
            const data = yield getStandardAssessmentById(assessmentId);
            runInAction(() => {
                this.selectedAssessment = data;
            });
            return data;
        } catch (error) {
            console.error(`Failed to load standard assessment ${assessmentId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося завантажити оцінку ${assessmentId}`;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *addAssessment(assessmentData) {
        this.loading = true;
        this.error = null;
        try {
            const newAssessment = yield createStandardAssessment(assessmentData);
            runInAction(() => {
                this.assessments.push(newAssessment);
            });
            return newAssessment;
        } catch (error) {
            console.error("Failed to add standard assessment", error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || "Не вдалося додати оцінку";
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *updateAssessment(assessmentId, assessmentData) {
        this.loading = true;
        this.error = null;
        try {
            const updated = yield updateStandardAssessment(assessmentId, assessmentData);
            runInAction(() => {
                const index = this.assessments.findIndex(sa => sa.assessment_id === assessmentId);
                if (index !== -1) {
                    this.assessments[index] = updated;
                }
                if (this.selectedAssessment && this.selectedAssessment.assessment_id === assessmentId) {
                    this.selectedAssessment = updated;
                }
            });
            return updated;
        } catch (error) {
            console.error(`Failed to update standard assessment ${assessmentId}`, error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || `Не вдалося оновити оцінку ${assessmentId}`;
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *removeAssessment(assessmentId) {
        this.loading = true;
        this.error = null;
        const originalAssessments = [...this.assessments];
        try {
            runInAction(() => {
                this.assessments = this.assessments.filter(sa => sa.assessment_id !== assessmentId);
            });
            yield deleteStandardAssessment(assessmentId);
        } catch (error) {
            console.error(`Failed to delete standard assessment ${assessmentId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося видалити оцінку ${assessmentId}`;
                this.assessments = originalAssessments;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    clearSelectedAssessment() {
        this.selectedAssessment = null;
    }
}

const standardAssessmentStore = new StandardAssessmentStore();
export default standardAssessmentStore;