import { makeAutoObservable, runInAction } from 'mobx';
import authService from '..//services/authService';
import apiClient, {configureApiClientAuth} from '../utils/apiClient';

class AuthStore {
    token = localStorage.getItem('token') || null;
    user = null;
    isAuthenticated = false;
    isLoading = true;

    constructor() {
        makeAutoObservable(this);
        configureApiClientAuth({
            getToken: () => this.token,
            logout: this.logout,
        });
        this.initialize();
    }

    initialize = async () => {
        if (this.token) {
            await this.fetchMe();
        }
        runInAction(() => {
            this.isLoading = false;
        });
    }

    login = async (credentials) => {
        try {
            const response = await authService.login(credentials);

            runInAction(() => {
                this.token = response.data.token;
                this.user = response.data.data.user;
                this.isAuthenticated = true;
            });

            localStorage.setItem('token', response.data.token);
        } catch (error) {
            console.error("Login failed", error);
            this.logout();
            throw error;
        }
    }

    logout = () => {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
    }

    fetchMe = async () => {
        try {
            const response = await authService.getMe();
            runInAction(() => {
                this.user = response.data.data;
                this.isAuthenticated = true;
            });
        } catch (error) {
            console.error("Failed to fetch user", error);
            this.logout();
        }
    }
}

export default AuthStore;