import { makeAutoObservable, runInAction } from 'mobx';
import lessonService from '../services/lessonService';

class LessonStore {
    lessons = [];
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    fetchAll = async () => {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await lessonService.getAll();
            runInAction(() => {
                this.lessons = response.data.data;
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
            await lessonService.create(data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    updateItem = async (id, data) => {
        try {
            await lessonService.update(id, data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    deleteItem = async (id) => {
        try {
            await lessonService.delete(id);
            runInAction(() => {
                this.lessons = this.lessons.filter((l) => l.id !== id);
            });
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };
}

export default LessonStore;