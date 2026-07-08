import axiosInstance from './axiosInstance';

export function loginAPI({ email, password }) {
  return axiosInstance.post('/auth/login', { email, password });
}

export function registerAPI(data) {
  return axiosInstance.post('/auth/register', data);
}

export function logoutAPI() {
  return axiosInstance.post('/auth/logout');
}

export function getUserAPI() {
  return axiosInstance.get('/auth/user');
}
