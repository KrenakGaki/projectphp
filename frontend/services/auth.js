import api from './api';

const authService = {
    async login(email, password) {
        // 2. Logar
        const response = await api.post('/login', {
            email,
            password
        });

    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuarios));
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
