import axios from 'axios';

// Same-origin '/api' goes through the Vite proxy, so the httpOnly auth cookie is sent automatically
export const api = axios.create({ baseURL: '/api', withCredentials: true });
