import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.189:8000/api',

    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Adicionar token em todas as requisições189
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



export default api;
