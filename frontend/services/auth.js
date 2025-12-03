import api from './api';

const authService = {
    async login(email, password) {
        // 1. Get CSRF token
        await api.get('/sanctum/csrf-cookie');

        // 2. Logar
        const response = await api.post('/login', {
            email,
            password
        });

        // 3. Salvar apenas o usuário
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    },

    async logout() {
        await api.post('/logout');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;
