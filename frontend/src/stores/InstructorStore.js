import { makeAutoObservable, runInAction } from 'mobx';
import instructorService from '../services/instructorService';

class InstructorStore {
    instructors = [];
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    fetchAll = async () => {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await instructorService.getAll();
            runInAction(() => {
                this.instructors = response.data.data;
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
            await instructorService.create(data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    updateItem = async (id, data) => {
        try {
            await instructorService.update(id, data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    deleteItem = async (id) => {
        try {
            await instructorService.delete(id);
            runInAction(() => {
                this.instructors = this.instructors.filter((i) => i.id !== id);
            });
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };
}

export default InstructorStore;