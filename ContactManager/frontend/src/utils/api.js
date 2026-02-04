import axios from 'axios';

// 2. Add Debugging: Print the baseURL to seeing if it's undefined
const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : import.meta.env.VITE_API_URL;
console.log("API Base URL:", baseURL);

const api = axios.create({
    baseURL: baseURL,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
