import { makeAutoObservable, runInAction } from 'mobx';
import academicDisciplineService from '../services/academicDisciplineService';

class AcademicDisciplineStore {
    disciplines = [];
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    fetchAll = async () => {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await academicDisciplineService.getAll();
            runInAction(() => {
                this.disciplines = response.data.data;
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
            await academicDisciplineService.create(data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    updateItem = async (id, data) => {
        try {
            await academicDisciplineService.update(id, data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    deleteItem = async (id) => {
        try {
            await academicDisciplineService.delete(id);
            runInAction(() => {
                this.disciplines = this.disciplines.filter((d) => d.id !== id);
            });
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };
}

export default AcademicDisciplineStore;