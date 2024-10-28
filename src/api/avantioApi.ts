import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'X-Avantio-Auth': process.env.API_KEY
    }
});

export default api;

