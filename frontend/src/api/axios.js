// frontend/src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Utilise la variable d'environnement
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;