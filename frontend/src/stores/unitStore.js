import { makeAutoObservable, runInAction, flow } from 'mobx';
import {
    getUnits,
    getUnitById,
    createUnit,
    updateUnit,
    deleteUnit
} from '../services/unitService.js';

class UnitStore {
    units = [];
    selectedUnit = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this, {
            loadUnits: flow,
            loadUnitById: flow,
            addUnit: flow,
            updateUnit: flow,
            removeUnit: flow
        });
    }

    *loadUnits() {
        this.loading = true;
        this.error = null;
        try {
            const data = yield getUnits();
            runInAction(() => {
                this.units = data || [];
            });
        } catch (error) {
            console.error("Failed to load units", error);
            runInAction(() => {
                this.error = error.message || "Не вдалося завантажити підрозділи";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *loadUnitById(unitId) {
        this.loading = true;
        this.error = null;
        this.selectedUnit = null;
        try {
            const data = yield getUnitById(unitId);
            runInAction(() => {
                this.selectedUnit = data;
            });
            return data;
        } catch (error) {
            console.error(`Failed to load unit ${unitId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося завантажити підрозділ ${unitId}`;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *addUnit(unitData) {
        this.loading = true;
        this.error = null;
        try {
            const newUnit = yield createUnit(unitData);
            runInAction(() => {
                this.units.push(newUnit);
            });
            return newUnit;
        } catch (error) {
            console.error("Failed to add unit", error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || "Не вдалося створити підрозділ";
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *updateUnit(unitId, unitData) {
        this.loading = true;
        this.error = null;
        try {
            const updated = yield updateUnit(unitId, unitData);
            runInAction(() => {
                const index = this.units.findIndex(u => u.unit_id === unitId);
                if (index !== -1) {
                    this.units[index] = updated;
                }
                if (this.selectedUnit && this.selectedUnit.unit_id === unitId) {
                    this.selectedUnit = updated;
                }
            });
            return updated;
        } catch (error) {
            console.error(`Failed to update unit ${unitId}`, error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || `Не вдалося оновити підрозділ ${unitId}`;
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *removeUnit(unitId) {
        this.loading = true;
        this.error = null;
        const originalUnits = [...this.units];
        try {
            runInAction(() => {
                this.units = this.units.filter(u => u.unit_id !== unitId);
            });
            yield deleteUnit(unitId);
        } catch (error) {
            console.error(`Failed to delete unit ${unitId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося видалити підрозділ ${unitId}`;
                this.units = originalUnits;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    clearSelectedUnit() {
        this.selectedUnit = null;
    }
}

const unitStore = new UnitStore();
export default unitStore;