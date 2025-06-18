import { makeAutoObservable, runInAction } from 'mobx';
import trainingGroupService from '../services/trainingGroupService';

class TrainingGroupStore {
    groups = [];
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    fetchAll = async () => {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await trainingGroupService.getAll();
            runInAction(() => {
                this.groups = response.data.data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
                this.isLoading = false;
            });
        }
    };

    createItem = async (data) => {
        try {
            await trainingGroupService.create(data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    updateItem = async (id, data) => {
        try {
            await trainingGroupService.update(id, data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    deleteItem = async (id) => {
        try {
            await trainingGroupService.delete(id);
            runInAction(() => {
                this.groups = this.groups.filter((g) => g.id !== id);
            });
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };
}

export default TrainingGroupStore;