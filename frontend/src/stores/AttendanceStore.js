import { makeAutoObservable, runInAction } from 'mobx';
import attendanceService from '../services/attendanceService';

class AttendanceStore {
    attendances = []; // Для зберігання списку відвідувань для конкретного заняття
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Спеціальний метод для завантаження відвідувань для одного заняття
    fetchByLessonId = async (lessonId) => {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await attendanceService.getByLessonId(lessonId);
            runInAction(() => {
                this.attendances = response.data.data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
                this.isLoading = false;
            });
        }
    };

    // Метод для оновлення статусу одного запису
    updateItem = async (id, data) => {
        this.error = null;
        try {
            const response = await attendanceService.update(id, data);
            runInAction(() => {
                // Оновлюємо один елемент у поточному списку, щоб уникнути повного перезавантаження
                const index = this.attendances.findIndex((a) => a.id === id);
                if (index !== -1) {
                    this.attendances[index] = response.data.data;
                }
            });
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    // У цьому сторі create та delete можуть бути не потрібні для звичайного користувача,
    // але їх можна додати за аналогією для адміна.
}

export default AttendanceStore;