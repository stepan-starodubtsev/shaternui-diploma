import { makeAutoObservable, runInAction } from 'mobx';
import cadetService from '../services/cadetService';

class CadetStore {
    cadets = [];
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    fetchAll = async () => {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await cadetService.getAll();
            runInAction(() => {
                this.cadets = response.data.data;
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
            await cadetService.create(data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    updateItem = async (id, data) => {
        try {
            await cadetService.update(id, data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    deleteItem = async (id) => {
        try {
            await cadetService.delete(id);
            runInAction(() => {
                this.cadets = this.cadets.filter((c) => c.id !== id);
            });
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };
}

export default CadetStore;