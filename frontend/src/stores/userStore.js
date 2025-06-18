import { makeAutoObservable, runInAction, flow } from 'mobx';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../services/userService.js';
import unitStore from "./unitStore.js";

class UserStore {
    users = [];
    selectedUser = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this, {
            loadUsers: flow,
            loadUserById: flow,
            addUser: flow,
            updateUser: flow,
            removeUser: flow
        });
    }

    *loadUsers(filters = {}) {
        this.loading = true;
        this.error = null;
        try {
            if (unitStore.units.length === 0 && !unitStore.loading) {
                yield unitStore.loadUnits();
            }
            const data = yield getUsers(filters);
            runInAction(() => {
                this.users = data || [];
            });
        } catch (error) {
            console.error("Failed to load users", error);
            runInAction(() => {
                this.error = error.message || "Не вдалося завантажити користувачів";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *loadUserById(userId) {
        this.loading = true;
        this.error = null;
        this.selectedUser = null;
        try {
            if (unitStore.units.length === 0 && !unitStore.loading) {
                yield unitStore.loadUnits();
            }
            const data = yield getUserById(userId);
            runInAction(() => {
                this.selectedUser = data;
            });
            return data;
        } catch (error) {
            console.error(`Failed to load user ${userId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося завантажити користувача ${userId}`;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *addUser(userData) {
        this.loading = true;
        this.error = null;
        try {
            const newUser = yield createUser(userData);
            runInAction(() => {
                this.users.push(newUser);
            });
            return newUser;
        } catch (error) {
            console.error("Failed to add user", error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || "Не вдалося створити користувача";
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *updateUser(userId, userData) {
        this.loading = true;
        this.error = null;
        try {
            const updated = yield updateUser(userId, userData);
            runInAction(() => {
                if(this.users.length === 0){
                    this.loadUsers();
                }
                const index = this.users.findIndex(u => u.user_id === userId);
                if (index !== -1) {
                    this.users[index] = updated;
                }
                if (this.selectedUser && this.selectedUser.user_id === userId) {
                    this.selectedUser = updated;
                }
            });
            return updated;
        } catch (error) {
            console.error(`Failed to update user ${userId}`, error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || `Не вдалося оновити користувача ${userId}`;
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *removeUser(userId) {
        this.loading = true;
        this.error = null;
        const originalUsers = [...this.users];
        try {
            runInAction(() => {
                this.users = this.users.filter(u => u.user_id !== userId);
            });
            yield deleteUser(userId);
        } catch (error) {
            console.error(`Failed to delete user ${userId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося видалити користувача ${userId}`;
                this.users = originalUsers;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    clearSelectedUser() {
        this.selectedUser = null;
    }
}

const userStore = new UserStore();
export default userStore;