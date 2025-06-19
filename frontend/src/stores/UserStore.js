import { makeAutoObservable, runInAction } from 'mobx';
import userService from '../services/UserService.js';

class UserStore {
    users = [];
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    fetchAll = async () => {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await userService.getAll();
            runInAction(() => {
                this.users = response.data.data;
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
            await userService.create(data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    updateMyPassword = async (passwordData) => {
        // Цей метод може просто викликати сервіс,
        // оскільки він не змінює стан (user's data), а лише пароль.
        // Можна додати обробку помилок, якщо потрібно.
        await userService.updateMyPassword(passwordData);
    };

    updateItem = async (id, data) => {
        try {
            await userService.update(id, data);
            await this.fetchAll();
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };

    deleteItem = async (id) => {
        try {
            await userService.delete(id);
            runInAction(() => {
                this.users = this.users.filter((u) => u.id !== id);
            });
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
        }
    };
}

export default UserStore;