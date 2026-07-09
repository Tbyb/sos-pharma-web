import axiosInstance from './axiosInstance';

export function getDashboardStatsAPI() {
  return axiosInstance.get('/statistiques/dashboard');
}
