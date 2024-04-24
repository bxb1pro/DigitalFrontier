import axios from 'axios';

// Setting up axios instance & providing necessary authorisation token for HTTP requests

const API = axios.create({ baseURL: 'http://localhost:5004/api/' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
