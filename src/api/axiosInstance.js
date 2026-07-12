import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Accept': 'application/json' }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('sos_pharma_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const estRequeteConnexion = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !estRequeteConnexion) {
      localStorage.removeItem('sos_pharma_token');
      localStorage.removeItem('sos_pharma_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
