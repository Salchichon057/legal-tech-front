import apiClient from '@/lib/api-client';

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const authService = {
    async register(data: RegisterData) {
        const response = await apiClient.post('/auth/register', data);
        return response.data.data;
    },

    async login(data: LoginData) {
        const response = await apiClient.post('/auth/login', data);
        const { idToken, refreshToken } = response.data.data;

        if (idToken) {
            localStorage.setItem('accessToken', idToken);
        }
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }

        return { accessToken: idToken };
    },

    async logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    async getCurrentUser() {
        try {
            const { data } = await apiClient.get('/auth/me');
            return data.data;
        } catch {
            return null;
        }
    },

    isAuthenticated() {
        return !!localStorage.getItem('accessToken');
    },
};
